import React, { useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import classes from "./styles/CreateEditFeedback.module.css";
import radius from "../assets/images/favicon1.png";
import InputRow from "../components/InputRow";
import Arrow from "../components/UI/Arrow";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import SelectBox from "../components/UI/SelectBox";
import Container from "../components/Container";
import { useSDK } from "@metamask/sdk-react";
import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import rTokenInfo from "../../artifacts/contracts/rToken.sol/rToken.json";
import bundlerInfo from "../../artifacts/contracts/Bundler.sol/Bundler.json";
import { splitSignature } from "@ethersproject/bytes";
import { ethers } from "ethers";
import { ButtonWrapper, Icon, ModalTitle, Wrapper } from "./styles/CreateEditFeedbackStyles";

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

const TOKENS = [{ label: "wUSDT", address: "0x3Ca8f9C04c7e3E1624Ac2008F92f6F366A869444" }];

const ROLLUPS = [
  {
    label: "Rollup A",
    rollupId: "A",
    chainId: 1001,
    bundleContractAddress: "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e",
    providerUrl: "http://192.168.12.68:8123",
  },
  {
    label: "Rollup B",
    rollupId: "B",
    chainId: 1001,
    bundleContractAddress: "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e",
    providerUrl: "http://192.168.12.201:8123",
  },
];

const Bridge = () => {
  const [account, setAccount] = useState(localStorage.getItem("account"));
  const { sdk, connected, connecting, provider } = useSDK(); // provider
  const [dynamicRollups, setDynamicRollups] = useState(ROLLUPS);

  const [fromBalance, setFromBalance] = useState(undefined);
  const [toBalance, setToBalance] = useState(undefined);

  const MODAL_TITLE = "Create your bundle transaction";

  const updateBalance = async () => {
    if (formState.token) {
      const rTokenAddress = formState.token.address;

      if (formState.from) {
        let option = {
          batchMaxCount: 2,
        };

        const fromRollupProvider = new ethers.JsonRpcProvider(formState.from.providerUrl, undefined, option);

        const fromWallet = new ethers.Wallet(
          "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
          fromRollupProvider
        );

        const rTokenContract = new ethers.Contract(rTokenAddress, rTokenInfo.abi, fromWallet);

        let userBalance = await rTokenContract.balanceOf(account);

        setFromBalance(Number(userBalance));
      }

      if (formState.to) {
        let option = {
          batchMaxCount: 2,
        };

        const toRollupProvider = new ethers.JsonRpcProvider(formState.to.providerUrl, undefined, option);

        const toWallet = new ethers.Wallet(
          "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
          toRollupProvider
        );

        const rTokenContract = new ethers.Contract(rTokenAddress, rTokenInfo.abi, toWallet);

        let userBalance = await rTokenContract.balanceOf(account);

        setToBalance(Number(userBalance));
      }
    }
  };

  setInterval(updateBalance, 1000);

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        // Update with the first account since we're assuming only one
        const newAccount = accounts[0];
        setAccount(newAccount);
        localStorage.setItem("account", newAccount);
      } else {
        // Handle account disconnection
        setAccount(null);
        localStorage.removeItem("account");
      }
    };

    const initMetaMask = async () => {
      // Check for already connected accounts
      try {
        const accounts = await provider.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          handleAccountsChanged(accounts);
        } else if (connected) {
          // No accounts found, request access to get the account
          const requestedAccounts = await provider.request({ method: "eth_requestAccounts" });
          handleAccountsChanged(requestedAccounts);
        }
      } catch (error) {
        console.error("Error while trying to retrieve accounts:", error);
      }
    };

    initMetaMask();

    // Listen to account changes
    provider?.on("accountsChanged", handleAccountsChanged);

    // Clean up the event listener when the component unmounts
    return () => {
      provider?.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, [provider, connected]);

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      const account = accounts?.[0];
      setAccount(account);
      localStorage.setItem("account", account);
    } catch (err) {
      console.warn("failed to connect..", err);
    }
  };

  const disconnect = async () => {
    try {
      sdk?.disconnect();
      setAccount(undefined);
      localStorage.removeItem("account");
    } catch (err) {
      console.warn("failed to disconnect..", err);
    }
  };

  const formReducer = (state, action) => {
    if (action.type === "AMOUNT_INPUT") {
      return {
        ...state,
        amount: {
          value: action.val,
          isValid: action.val.length !== 0,
          touched: true,
        },
      };
    }

    if (action.type === "AMOUNT_VALID") {
      return {
        ...state,
        amount: { ...state.amount, isValid: action.val },
      };
    }

    if (action.type === "AMOUNT_TOUCH") {
      return {
        ...state,
        amount: {
          ...state.amount,
          isValid: !(action.val && state.amount.value === ""),
          touched: action.val,
        },
      };
    }
    if (action.type === "TOKEN_SELECT") {
      return { ...state, token: action.val };
    }
    if (action.type === "FROM_SELECT") {
      return { ...state, from: action.val };
    }
    if (action.type === "TO_SELECT") {
      return { ...state, to: action.val };
    }
    return { ...state };
  };

  const [formState, dispatchForm] = useReducer(formReducer, {
    token: null,
    amount: {
      value: "",
      isValid: false,
      touched: false,
    },
    from: null,
    to: null,
  });

  const handleToken = (tokenName) => {
    const selectedToken = TOKENS.find((t) => t.label === tokenName);

    dispatchForm({ type: "TOKEN_SELECT", val: selectedToken });
  };

  const handleAmount = (event) => {
    dispatchForm({ type: "AMOUNT_INPUT", val: event.target.value.trim() });
  };

  const handleAmountBlur = (event) => {
    dispatchForm({ type: "AMOUNT_TOUCH", val: true });
  };

  const handleFrom = (from) => {
    const selectedRollup = ROLLUPS.find((rollup) => rollup.label === from);

    setDynamicRollups(ROLLUPS.filter((rollup) => rollup.label !== from));
    dispatchForm({ type: "FROM_SELECT", val: selectedRollup });
  };

  const handleTo = (to) => {
    const selectedRollup = ROLLUPS.find((rollup) => rollup.label === to);

    setDynamicRollups(ROLLUPS.filter((rollup) => rollup.label !== to));
    dispatchForm({ type: "TO_SELECT", val: selectedRollup });
  };

  // -----------------------------------------------------------------

  function getLibrary(provider) {
    return new Web3Provider(provider);
  }

  async function transfer(event) {
    event.preventDefault();
    dispatchForm({ type: "AMOUNT_TOUCH", val: true });
    dispatchForm({ type: "DETAILS_TOUCH", val: true });

    // const fromLibrary = getLibrary(fromProvider);
    // const toLibrary = getLibrary(toProvider);

    // --------- From ---------
    const fromRTokenAddress = formState.token.address;
    const fromBundlerAddress = formState.from.bundleContractAddress;

    let option = {
      batchMaxCount: 2,
    };

    const fromRollupProvider = new ethers.JsonRpcProvider(formState.from.providerUrl, undefined, option);
    // const fromLibrary = getLibrary(fromRollupProvider);

    // const fromRTokenContract = await ethers.getContractAt(rTokenInfo.abi, fromRTokenAddress, fromRollupProvider);
    // const fromBundlerContract = await ethers.getContractAt(bundlerInfo.abi, fromBundlerAddress, fromRollupProvider);

    // const fromRTokenContract = new Contract(fromRTokenAddress, rTokenInfo.abi, fromLibrary.getSigner());
    // const fromBundlerContract = new Contract(fromBundlerAddress, bundlerInfo.abi, fromLibrary.getSigner());

    const fromWallet = new ethers.Wallet(
      "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      fromRollupProvider
    );

    // const fromRTokenContract = new ethers.Contract(fromRTokenAddress, rTokenInfo.abi, fromLibrary.getSigner());
    // const fromBundlerContract = new ethers.Contract(fromBundlerAddress, bundlerInfo.abi, fromLibrary.getSigner());
    // const rTokenContract = ethers.ContractFactory(rTokenInfo.abi, rTokenInfo.bytecode);
    const fromRTokenContract = new ethers.Contract(fromRTokenAddress, rTokenInfo.abi);
    const fromBundlerContract = new ethers.Contract(fromBundlerAddress, bundlerInfo.abi, fromWallet);

    // const data = fromBundlerContract.interface.encodeFunctionData("nonces", [account]);

    // const callData = {
    //   to: fromBundlerAddress,
    //   data: data,
    // };

    // const result = await fromRollupProvider.call(callData);
    // console.log(result);

    const fromUserNonce = await fromBundlerContract.nonces(account);

    const fromRollupFeeData = await fromRollupProvider.getFeeData();

    const fromUserTx = {
      to: fromRTokenAddress,
      value: 0,
      data: fromRTokenContract.interface.encodeFunctionData("burnFrom", [account, formState.amount.value]),
      nonce: Number(fromUserNonce),
      chainId: formState.from.chainId,
      maxGasPrice: Number(fromRollupFeeData.gasPrice * 2n),
    };

    console.log("fromUserTx", account, formState.amount.value);

    const fromEncodedTx = ethers.solidityPackedKeccak256(
      ["bytes"],
      [
        ethers.solidityPacked(
          ["uint256", "address", "uint256", "bytes", "uint256", "uint256"],
          [
            fromUserTx.nonce,
            fromUserTx.to,
            fromUserTx.value,
            fromUserTx.data,
            fromUserTx.chainId,
            fromUserTx.maxGasPrice,
          ]
        ),
      ]
    );
    // --------- From --------- end

    // --------- To ---------
    const toRollupProvider = new ethers.JsonRpcProvider(formState.to.providerUrl, undefined, option);
    // const toLibrary = getLibrary(toRollupProvider);

    const toRTokenAddress = formState.token.address;
    const toBundlerAddress = formState.to.bundleContractAddress;

    const toWallet = new ethers.Wallet(
      "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      toRollupProvider
    );

    const toRTokenContract = new Contract(toRTokenAddress, rTokenInfo.abi);

    // const toBundlerContract = new Contract(toBundlerAddress, bundlerInfo.abi, toWallet);
    // const toUserNonce = await toBundlerContract.nonces(account);

    const toUserNonce = fromUserNonce;
    const toRollupFeeData = await toRollupProvider.getFeeData();

    const toUserTx = {
      to: toRTokenAddress,
      value: 0,
      data: toRTokenContract.interface.encodeFunctionData("mint", [account, formState.amount.value]),
      nonce: Number(toUserNonce),
      chainId: formState.to.chainId,
      maxGasPrice: Number(toRollupFeeData.gasPrice * 2n),
    };

    console.log("toUserTx", account, formState.amount.value);

    const toEncodedTx = ethers.solidityPackedKeccak256(
      ["bytes"],
      [
        ethers.solidityPacked(
          ["uint256", "address", "uint256", "bytes", "uint256", "uint256"],
          [toUserTx.nonce, toUserTx.to, toUserTx.value, toUserTx.data, toUserTx.chainId, toUserTx.maxGasPrice]
        ),
      ]
    );
    // --------- To --------- end

    const digest = ethers.solidityPackedKeccak256(["bytes"], [ethers.concat([fromEncodedTx, toEncodedTx])]);

    const bundleTxSignature = await signMessage(account, digest);

    let signature = splitSignature(bundleTxSignature);

    console.log(bundleTxSignature);
    console.log(signature);

    verifySignature(account, digest, bundleTxSignature);

    fromUserTx.rawTxHash = ethers.solidityPackedKeccak256(["bytes"], [fromEncodedTx]);
    toUserTx.rawTxHash = ethers.solidityPackedKeccak256(["bytes"], [toEncodedTx]);

    requestToSendEncryptedBundleTx(
      account,
      [formState.from.rollupId, formState.to.rollupId],
      [JSON.stringify(fromUserTx), JSON.stringify(toUserTx)],
      ["eth_bundle_tx", "eth_bundle_tx"],
      bundleTxSignature
    );
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

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.error) {
        console.log(data.error);
      } else {
        console.log(data.result);
      }
    } catch (err) {
      console.log(err.message);
    }
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
      <StyledAccount>{account ? account : "Not Connected"}</StyledAccount>
      <Container className={classes.level_0}>
        <Container className={classes.level_1}>
          <Wrapper>
            <Icon>
              <img width='64' src={radius} alt={`${radius}`} />
            </Icon>
            <ModalTitle>{MODAL_TITLE}</ModalTitle>
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
                  error={!formState.amount.isValid && formState.amount.touched ? true : false}
                  defaultValue={formState.amount.value}
                  placeholder='Input the amount you would like to transfer'
                />
              </InputRow>

              <InputRow title='From' balance={fromBalance}>
                <SelectBox name='options' options={dynamicRollups} handleOption={handleFrom} placeholder='Select'>
                  <Arrow direction='down' paint='#4661E6' />
                </SelectBox>
              </InputRow>
              <InputRow title='To' balance={toBalance}>
                <SelectBox name='options' options={dynamicRollups} handleOption={handleTo} placeholder='Select'>
                  <Arrow direction='down' paint='#4661E6' />
                </SelectBox>
              </InputRow>
            </Container>
            <Container className={classes.level_3}>
              {connected ? (
                // <>
                //   <ButtonWrapper>
                //     <Button
                //       className={classes.level_4}
                //       kind='default'
                //       type='button'
                //       paint='#D73737'
                //       onClick={disconnect}
                //     >
                //       Disconnect
                //     </Button>
                //   </ButtonWrapper>

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
