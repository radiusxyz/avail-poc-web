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

const TOKENS = [{ label: "USDC", address: "0x5fbdb2315678afecb367f032d93f642f64180aa3" }];

const ROLLUPS = [
  {
    label: "Radius",
    rollupId: 31337,
    bundleContractAddress: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
  },
  {
    label: "Avail",
    rollupId: 31337,
    bundleContractAddress: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
  },
];

const Bridge = () => {
  const [account, setAccount] = useState(localStorage.getItem("account"));
  const { sdk, connected, connecting, provider } = useSDK(); // provider
  const [dynamicRollups, setDynamicRollups] = useState(ROLLUPS);

  const MODAL_TITLE = "Radius Bridge";

  useEffect(() => {
    async function connect() {
      if (connected) {
        const accounts = await sdk?.connect();
        const account = accounts?.[0];
        setAccount(account);
      }
    }

    connect();
  }, []);

  useEffect(() => {
    const storedAccount = localStorage.getItem("account");
    if (storedAccount && !connected && !connecting) {
      connect();
    }
  }, [connected, connecting]);

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

  async function getLibrary(provider) {
    return new Web3Provider(provider);
  }

  async function transfer(event) {
    event.preventDefault();
    dispatchForm({ type: "AMOUNT_TOUCH", val: true });
    dispatchForm({ type: "DETAILS_TOUCH", val: true });

    const library = await getLibrary(provider);
    let leaves = [];

    // --------- From ---------
    const fromRTokenAddress = formState.token.address;
    const fromBundlerAddress = formState.from.bundleContractAddress;

    const fromRTokenContract = new Contract(fromRTokenAddress, rTokenInfo.abi, library.getSigner());

    const fromBundlerContract = new Contract(fromBundlerAddress, bundlerInfo.abi, library.getSigner());

    const fromUserNonce = await fromBundlerContract.nonces(account);

    // TODO: check maxGasPrice
    const fromUserTx = {
      to: fromRTokenAddress,
      value: 0,
      data: fromRTokenContract.interface.encodeFunctionData("burnFrom", [account, formState.amount.value]),
      nonce: fromUserNonce.toNumber(),
      chainId: formState.from.rollupId,
      maxGasPrice: 10, // TODO: check maxGasPrice
    };
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
    const toRTokenAddress = formState.token.address;
    const toBundlerAddress = formState.to.bundleContractAddress;

    const toRTokenContract = new Contract(toRTokenAddress, rTokenInfo.abi, library.getSigner());

    const toBundlerContract = new Contract(toBundlerAddress, bundlerInfo.abi, library.getSigner());

    const toUserNonce = await toBundlerContract.nonces(account);

    const toUserTx = {
      to: toRTokenAddress,
      value: 0,
      data: toRTokenContract.interface.encodeFunctionData("burnFrom", [account, formState.amount.value]),
      nonce: toUserNonce.toNumber(),
      chainId: formState.to.rollupId,
      maxGasPrice: 10,
    };
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

    verifySignature(account, digest, bundleTxSignature);
    generateTx(account, fromUserTx, toUserTx, bundleTxSignature);
  }

  function generateTx(userAddress, fromUserTx, toUserTx, bundleTxSignature) {
    let fromBundleTx = {
      from: userAddress,
      userTxIdx: 0,
      userTxs: [fromUserTx, toUserTx],
      bundleTxSignature: bundleTxSignature,
      revertFlag: false,
    };

    let toBundleTx = {
      from: userAddress,
      userTxIdx: 1,
      userTxs: [fromUserTx, toUserTx],
      bundleTxSignature: bundleTxSignature,
      revertFlag: false,
    };

    console.log("fromBundleTx", fromBundleTx);
    console.log("toBundleTx", toBundleTx);
  }

  async function signMessage(address, message) {
    let signature;

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

            signature = splitSignature(result.result);
            resolve(signature);
          }
        );
    });
  }

  async function verifySignature(address, message, signature) {
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
              <InputRow title='Token' description='Select the asset you would like to bridge'>
                <SelectBox name='options' options={TOKENS} handleOption={handleToken}>
                  <Arrow direction='down' paint='#4661E6' />
                </SelectBox>
              </InputRow>
              <InputRow title='Amount' description='Input the amount you would like to bridge'>
                <Input
                  id='amount'
                  name='amount'
                  onBlur={handleAmountBlur}
                  onChange={handleAmount}
                  error={!formState.amount.isValid && formState.amount.touched ? true : false}
                  defaultValue={formState.amount.value}
                />
              </InputRow>
              <InputRow title='From' description='Select the rollup you want to bridge from'>
                <SelectBox name='options' options={dynamicRollups} handleOption={handleFrom}>
                  <Arrow direction='down' paint='#4661E6' />
                </SelectBox>
              </InputRow>
              <InputRow title='To' description='Select the rollup you want to bridge to'>
                <SelectBox name='options' options={dynamicRollups} handleOption={handleTo}>
                  <Arrow direction='down' paint='#4661E6' />
                </SelectBox>
              </InputRow>
            </Container>
            <Container className={classes.level_3}>
              {connected ? (
                <>
                  <ButtonWrapper>
                    <Button
                      className={classes.level_4}
                      kind='default'
                      type='button'
                      paint='#D73737'
                      onClick={disconnect}
                    >
                      Disconnect
                    </Button>
                  </ButtonWrapper>

                  <Container>
                    <Button className={classes.level_4} kind='default' paint='#AD1FEA' type='button' onClick={transfer}>
                      Transfer
                    </Button>
                  </Container>
                </>
              ) : (
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
