import React, { useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import classes from "./styles/Modal.module.css";
import radius from "../assets/images/favicon1.png";
import InputRow from "../components/InputRow";
import Arrow from "../components/UI/Arrow";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import SelectBox from "../components/UI/SelectBox";
import Container from "../components/Container";

import rTokenInfo from "../artifacts/contracts/rToken.sol/rToken.json";
import bundlerInfo from "../artifacts/contracts/Bundler.sol/Bundler.json";
import { splitSignature } from "@ethersproject/bytes";
import { ethers } from "ethers";
import { Icon, ModalTitle, Wrapper } from "./styles/ModalStyles";
import { formReducer, initialFormState } from "../reducers/formReducer";
import { TOKENS, ROLLUPS } from "../assets/database";
import { useAccount, useConnect, useDisconnect } from "wagmi";

const StyledAccount = styled.span`
  font-weight: 700;
  z-index: 100;
  font-size: 13px;
  line-height: 19px;
  padding: 10.5px 17px 10.5px 16px;
  border: none;
  box-shadow: rgb(0, 0, 0) -5px 5px;
  border-radius: 0;
  display: flex;
  white-space: nowrap;
  text-align: center;
  justify-content: center;
  align-items: center;
  gap: 15px;
  color: #f2f4fe;
  padding: 12.5px 25px 11.5px 24px;
  background-color: #ad1fea;
  font-weight: 700;
  font-size: 14px;
  line-height: 20.23px;
  letter-spacing: -0.25px;
  position: absolute;
  bottom: 20px;
  right: 20px;
`;

const Bridge = () => {
  const [dynamicRollups, setDynamicRollups] = useState(ROLLUPS);

  const { address, isConnected } = useAccount();
  const { connect } = useConnect();

  const [formState, dispatchForm] = useReducer(formReducer, initialFormState);

  const handleToken = (tokenName) => {
    const selectedToken = TOKENS.find((t) => t.label === tokenName);
    dispatchForm({ type: "UPDATE_FIELD", field: "token", value: selectedToken });
  };

  const handleAmount = (event) => {
    const value = event.target.value.trim();
    dispatchForm({ type: "UPDATE_AMOUNT", value });
  };

  const handleAmountBlur = () => {
    dispatchForm({ type: "UPDATE_AMOUNT", touched: true });
  };

  const handleFrom = (from) => {
    const selectedRollup = ROLLUPS.find((rollup) => rollup.label === from);
    setDynamicRollups(ROLLUPS.filter((rollup) => rollup.label !== from));
    dispatchForm({ type: "UPDATE_FIELD", field: "from", value: selectedRollup });
  };

  const handleTo = (to) => {
    const selectedRollup = ROLLUPS.find((rollup) => rollup.label === to);
    setDynamicRollups(ROLLUPS.filter((rollup) => rollup.label !== to));
    dispatchForm({ type: "UPDATE_FIELD", field: "to", value: selectedRollup });
  };

  // -----------------------------------------------------------------

  async function transfer(event) {
    event.preventDefault();
    dispatchForm({ type: "AMOUNT_TOUCH", val: true });
    dispatchForm({ type: "DETAILS_TOUCH", val: true });

    let option = {
      batchMaxCount: 2,
    };

    const bridgeOperation = {
      rTokenAddress: {
        from: formState.token.address,
        to: formState.token.address,
      },
      bundlerAddress: {
        from: formState.from.bundleContractAddress,
        to: formState.to.bundleContractAddress,
      },

      rollupProvider: {
        from: new ethers.JsonRpcProvider(formState.from.providerUrl, undefined, option),
        to: new ethers.JsonRpcProvider(formState.to.providerUrl, undefined, option),
      },

      wallet: {
        get from() {
          return new ethers.Wallet(
            "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
            this.rollupProvider.from
          );
        },
        get to() {
          return new ethers.Wallet(
            "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
            this.rollupProvider.to
          );
        },
      },

      rTokenContract: {
        get from() {
          return new ethers.Contract(this.rTokenAddress.from, rTokenInfo.abi, this.wallet.from);
        },
        get to() {
          return new ethers.Contract(this.rTokenAddress.to, rTokenInfo.abi, this.wallet.to);
        },
      },

      bundlerContract: {
        get from() {
          return new ethers.Contract(this.bundlerAddress.from, bundlerInfo.abi, this.wallet.from);
        },
        get to() {
          return new ethers.Contract(this.bundlerAddress.to, bundlerInfo.abi, this.wallet.to);
        },
      },
      // async
      userNonce: {
        get from() {
          return this.bundlerContract.from.nonces(account);
        },
        get to() {
          return this.bundlerContract.to.nonces(account);
        },
      },
      // async
      rollupFeeData: {
        get from() {
          return this.rollupProvider.from.getFeeData();
        },
        get to() {
          return this.rollupProvider.to.getFeeData();
        },
      },
      userTx: {
        get from() {
          return {
            to: this.rTokenAddress.from,
            value: 0,
            data: this.rTokenContract.from.interface.encodeFunctionData("burnFrom", [account, formState.amount.value]),
            nonce: Number(this.userNonce.from),
            chainId: formState.from.chainId,
            maxGasPrice: Number(this.rollupFeeData.from.gasPrice * 2n),
          };
        },
        get to() {
          return {
            to: this.rTokenAddress.to,
            value: 0,
            data: this.rTokenContract.to.interface.encodeFunctionData("mint", [account, formState.amount.value]),
            nonce: Number(this.userNonce.to),
            chainId: formState.to.chainId,
            maxGasPrice: Number(this.rollupFeeData.to.gasPrice * 2n),
          };
        },
      },

      encodedTx: {
        get from() {
          return ethers.solidityPackedKeccak256(
            ["bytes"],
            [
              ethers.solidityPacked(
                ["uint256", "address", "uint256", "bytes", "uint256", "uint256"],
                [
                  this.userTx.from.nonce,
                  this.userTx.from.to,
                  this.userTx.from.value,
                  this.userTx.from.data,
                  this.userTx.from.chainId,
                  this.userTx.from.maxGasPrice,
                ]
              ),
            ]
          );
        },
        get to() {
          return ethers.solidityPackedKeccak256(
            ["bytes"],
            [
              ethers.solidityPacked(
                ["uint256", "address", "uint256", "bytes", "uint256", "uint256"],
                [
                  this.userTx.to.nonce,
                  this.userTx.to.to,
                  this.userTx.to.value,
                  this.userTx.to.data,
                  this.userTx.to.chainId,
                  this.userTx.to.maxGasPrice,
                ]
              ),
            ]
          );
        },
      },
      rawTxHash: {
        get from() {
          return ethers.solidityPackedKeccak256(["bytes"], [this.encodedTx.from]);
        },
        get to() {
          return ethers.solidityPackedKeccak256(["bytes"], [this.encodedTx.to]);
        },
      },
      get digest() {
        return ethers.solidityPackedKeccak256(["bytes"], [ethers.concat([this.encodedTx.from, this.encodedTx.to])]);
      },
      // async
      get bundleTxSignature() {
        return signMessage(account, this.digest);
      },

      get signature() {
        return splitSignature(this.bundleTxSignature);
      },
    };

    verifySignature(account, digest, bundleTxSignature);

    // 1. TODO: generate time lock puzzle
    // const timeLockPuzzle = await generateTimeLockPuzzle(timeLockPuzzleParam);
    /*
    {
      o: "..",
      t: "..",
      n: ".."
    }
    */

    // 2. TODO: encrypt transactions (fromUserTx / toUserTx) -> JSON.stringify(fromUserTx) - raw data
    // const encryptedFromUserTx = await encryptMessage(message, encryptionKey);
    // const encryptedToUserTx = await encryptMessage(message, encryptionKey);

    // 3. TODO: prove (1time: timelock puzzle / 2times; encryption)
    // const encryptionProof = await generateEncryptionProof(
    //   encryptionZkpParam,
    //   encryptionProvingKey,
    //   encryptionPublicInput,
    //   encryptionSecretInput // - fromUserTx / toUserTx are diffent input (i.e., data: message)
    // );

    // 2. TODO: convert transaction (2 times)
    let encrypted_tx = {
      open_data: {
        raw_tx_hash: "", // get from fromUserTx / toUserTx - empty ok (1,2)
      },
      encrypted_data: "sdfsf123123", // result of 2 (encrypted - encryptedFromUserTx / encryptedToUserTx)
      pvde_zkp: {
        public_input: {
          r1: BigUint,
          r2: BigUint,
          z: BigUint,
          o: BigUint,
          k_two: BigUint,
          k_hash_value: HashValue,
        },
        time_lock_puzzle_proof: {},
        encryption_proof: {},
      },
    };

    let parameter = {
      from: account,
      rollup_id_list: [formState.from.rollupId, formState.to.rollupId],
      encrypted_tx_list: [encrypted_tx1, encrypted_tx2],
      time_lock_puzzle: timeLockPuzzle,
      bundle_tx_signature: bundleTxSignature,
    };

    console.log(parameter);

    // requestToSendEncryptedBundleTx(
    //   account,
    //   [formState.from.rollupId, formState.to.rollupId],
    //   [JSON.stringify(fromUserTx), JSON.stringify(toUserTx)],
    //   ["eth_bundle_tx", "eth_bundle_tx"],
    //   bundleTxSignature
    // );
  }

  async function requestToSendEncryptedBundleTx(
    userAddress,
    rollup_id_list,
    raw_tx_list,
    tx_type_list,
    bundleTxSignature
  ) {
    const RequestToSendEncryptedBundleTx = {
      from: userAddress,
      encrypt_bundle_tx_parameter: {
        rollup_id_list,
        raw_tx_list,
        tx_type_list,
      },
      bundle_tx_signature: bundleTxSignature,
    };

    const url = "http://localhost:8001";
    const payload = {
      jsonrpc: "2.0",
      method: "request_to_send_encrypted_bundle_tx",
      params: RequestToSendEncryptedBundleTx,
      id: 1,
    };

    console.log(payload);
  }

  function signMessage(address, message) {
    return new Promise((resolve, reject) => {
      provider // Or window.ethereum if you don't support EIP-6963.
        .sendAsync(
          {
            method: "personal_sign",
            params: [message, address],
          },
          function (err, result) {
            if (err) reject(err);
            if (result.error) reject(err);

            resolve(result.result);
          }
        );
    });
  }

  function verifySignature(address, message, signature) {
    const recoveredAddress = ethers.verifyMessage(ethers.getBytes(message), signature);

    alert(recoveredAddress);

    return recoveredAddress == address;
  }

  return (
    <>
      <StyledAccount>{isConnected ? address : "Not Connected"}</StyledAccount>
      <Container className={classes.level_0}>
        <Container className={classes.level_1}>
          <Wrapper>
            <Icon>
              <img width='64' src={radius} alt={`${radius}`} />
            </Icon>
            <ModalTitle>Create your bundle transaction</ModalTitle>
            <Container className={classes.level_2}>
              <InputRow title='Token'>
                <SelectBox
                  name='options'
                  options={TOKENS}
                  handleOption={handleToken}
                  placeholder='Select the asset you would like to transfer'
                >
                  <Arrow direction='down' paint='#4661E6' />
                </SelectBox>
              </InputRow>
              <InputRow title='Amount'>
                <Input
                  id='amount'
                  name='amount'
                  onBlur={handleAmountBlur}
                  onChange={handleAmount}
                  $error={!formState.amount.isValid && formState.amount.touched ? true : false}
                  defaultValue={formState.amount.value}
                  placeholder='Input the amount you would like to transfer'
                />
              </InputRow>

              <InputRow title='From' balance={0}>
                <SelectBox name='options' options={dynamicRollups} handleOption={handleFrom} placeholder='Select'>
                  <Arrow direction='down' paint='#4661E6' />
                </SelectBox>
              </InputRow>
              <InputRow title='To' balance={1000}>
                <SelectBox name='options' options={dynamicRollups} handleOption={handleTo} placeholder='Select'>
                  <Arrow direction='down' paint='#4661E6' />
                </SelectBox>
              </InputRow>
            </Container>
            <Container className={classes.level_3}>
              {isConnected ? (
                <Container>
                  <Button className={classes.level_4} kind='default' paint='#AD1FEA' type='button' onClick={transfer}>
                    Transfer
                  </Button>
                </Container>
              ) : (
                // </>
                <Container>
                  <Button className={classes.level_4} kind='default' type='button' onClick={connect} paint='#3A4374'>
                    Connect Wallet
                  </Button>
                </Container>
              )}
            </Container>
          </Wrapper>
        </Container>
      </Container>
    </>
  );
};

export default Bridge;
