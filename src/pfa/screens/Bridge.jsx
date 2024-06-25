import React, { useEffect, useReducer, useState } from "react";
import classes from "./styles/CreateEditFeedback.module.css";
import radius from "../assets/images/favicon1.png";
import InputRow from "../components/InputRow";
import Arrow from "../components/UI/Arrow";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import SelectBox from "../components/UI/SelectBox";
import Container from "../components/Container";
import { useSDK } from "@metamask/sdk-react";
import { recoverAddress } from "@ethersproject/transactions";
import { _TypedDataEncoder as typedDataEncoder } from "@ethersproject/hash";

import { splitSignature } from "@ethersproject/bytes";

import { ButtonWrapper, Icon, ModalTitle, Wrapper } from "./styles/CreateEditFeedbackStyles";

const tokens = [{ label: "RAD" }, { label: "ETH" }];

const rollups = [{ label: "Rollup A" }, { label: "Rollup B" }, { label: "Rollup C" }];

const Bridge = () => {
  const [account, setAccount] = useState(localStorage.getItem("account"));
  const { sdk, connected, connecting, provider, chainId } = useSDK();

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

  useEffect(() => {
    const storedAccount = localStorage.getItem("account");
    if (storedAccount && !connected && !connecting) {
      connect();
    }
  }, [connected, connecting]);

  const [dynamicNetworks, setDynamicNetworks] = useState(rollups);

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
    token: "",
    amount: {
      value: "",
      isValid: false,
      touched: false,
    },
    from: "",
    to: "",
  });

  const handleToken = (token) => {
    dispatchForm({ type: "TOKEN_SELECT", val: token });
  };
  const handleAmount = (event) => {
    dispatchForm({ type: "AMOUNT_INPUT", val: event.target.value.trim() });
  };

  const handleAmountBlur = (event) => {
    dispatchForm({ type: "AMOUNT_TOUCH", val: true });
    console.log(formState.amount);
  };
  const handleFrom = (from) => {
    setDynamicNetworks(rollups.filter((network) => network.label !== from));
    dispatchForm({ type: "FROM_SELECT", val: from });
  };
  const handleTo = (to) => {
    setDynamicNetworks(rollups.filter((network) => network.label !== to));
    dispatchForm({ type: "TO_SELECT", val: to });
  };

  let modalTitle = "Radius Bridge";

  const transfer = async (event) => {
    event.preventDefault();
    dispatchForm({ type: "AMOUNT_TOUCH", val: true });
    dispatchForm({ type: "DETAILS_TOUCH", val: true });

    alert("hi");

    // eth_signTypedData_v4 parameters. All of these parameters affect the resulting signature.
    const msgParamObject = {
      domain: {
        // This defines the network, in this case, Mainnet.
        chainId: 1,
        // Give a user-friendly name to the specific contract you're signing for.
        name: "Ether Mail",
        // Add a verifying contract to make sure you're establishing contracts with the proper entity.
        verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
        // This identifies the latest version.
        version: "1",
      },

      // This defines the message you're proposing the user to sign, is dapp-specific, and contains
      // anything you want. There are no required fields. Be as explicit as possible when building out
      // the message schema.
      message: {
        contents: "Hello, Bob!",
        attachedMoneyInEth: 4.2,
        from: {
          name: "Cow",
          wallets: ["0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826", "0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF"],
        },
        to: [
          {
            name: "Bob",
            wallets: [
              "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
              "0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57",
              "0xB0B0b0b0b0b0B000000000000000000000000000",
            ],
          },
        ],
      },
      // This refers to the keys of the following types object.
      primaryType: "Mail",
      types: {
        // This refers to the domain the contract is hosted on.
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        // Refer to primaryType.
        Mail: [
          { name: "from", type: "Person" },
          { name: "to", type: "Person[]" },
          { name: "contents", type: "string" },
        ],
        // Not an EIP712Domain definition.
        Person: [
          { name: "name", type: "string" },
          { name: "wallets", type: "address[]" },
        ],
      },
    };
    const msgParams = JSON.stringify(msgParamObject);

    var params = [account, msgParams];
    var method = "eth_signTypedData_v4";

    provider // Or window.ethereum if you don't support EIP-6963.
      .sendAsync(
        {
          method,
          params,
          from: account,
        },
        function (err, result) {
          // debugger;
          if (err) return console.dir(err);
          if (result.error) {
            alert(result.error.message);
          }
          if (result.error) return console.error("ERROR", result);
          console.log("TYPED SIGNED:" + JSON.stringify(result.result));

          const sig = splitSignature(result.result);
          console.log("sig", sig);

          const msgHash = typedDataEncoder.hash(
            msgParamObject.domain,
            {
              Mail: msgParamObject.types["Mail"],
              Person: msgParamObject.types["Person"],
            },
            msgParamObject.message
          );

          const verifySigner = recoverAddress(msgHash, sig);

          alert(verifySigner);
        }
      );
  };

  return (
    <Container className={classes.level_0}>
      <ModalTitle>{account}</ModalTitle>
      <Container className={classes.level_1}>
        <Wrapper>
          <Icon>
            <img width='64' src={radius} alt={`${radius}`} />
          </Icon>
          <ModalTitle>{modalTitle}</ModalTitle>
          <Container className={classes.level_2}>
            <InputRow title='Token' description='Select the asset you would like to bridge'>
              <SelectBox name='options' options={tokens} handleOption={handleToken}>
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
            <InputRow title='From' description='Select the network you want to bridge from'>
              <SelectBox name='options' options={dynamicNetworks} handleOption={handleFrom}>
                <Arrow direction='down' paint='#4661E6' />
              </SelectBox>
            </InputRow>
            <InputRow title='To' description='Select the network you want to bridge to'>
              <SelectBox name='options' options={dynamicNetworks} handleOption={handleTo}>
                <Arrow direction='down' paint='#4661E6' />
              </SelectBox>
            </InputRow>
          </Container>
          <Container className={classes.level_3}>
            {connected ? (
              <>
                <ButtonWrapper>
                  <Button className={classes.level_4} kind='default' type='button' paint='#D73737' onClick={disconnect}>
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
  );
};

export default Bridge;
