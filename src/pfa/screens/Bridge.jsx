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
import { defaultAbiCoder } from "@ethersproject/abi";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { useSDK } from "@metamask/sdk-react";
import { recoverAddress } from "@ethersproject/transactions";
import { _TypedDataEncoder as typedDataEncoder } from "@ethersproject/hash";
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
    rollupId: "radius",
    bundleContractAddress: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
  },
  {
    label: "Avail",
    rollupId: "avail",
    bundleContractAddress: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
  },
];

const Bridge = () => {
  const [account, setAccount] = useState(localStorage.getItem("account"));
  const { sdk, connected, connecting, chainId, provider } = useSDK(); // provider

  const MODAL_TITLE = "Radius Bridge";

  const USER_TX_TYPE_HASH = ethers.solidityPackedKeccak256(
    ["string"],
    ["UserTx(address to,uint256 value,bytes data,uint256 nonce)"]
  );

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

  const [dynamicRollups, setDynamicRollups] = useState(ROLLUPS);

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

  async function getLibrary(provider) {
    return new Web3Provider(provider); // From @ethersproject/providers
  }

  const transfer = async (event) => {
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

    // TODO: use this code but it doesn't work now
    // const eip712Domain = await bundler.eip712Domain();

    const fromEIP712Domain = {
      chainId: 31337, // eip712Domain[3],
      name: "Bundler",
      verifyingContract: fromBundlerAddress,
      version: "1",
    };

    const fromTypes = {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      UserTx: [
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
        { name: "data", type: "bytes" },
        { name: "nonce", type: "uint256" },
      ],
    };

    const fromUserTx = {
      to: fromRTokenAddress,
      value: 0,
      data: fromRTokenContract.interface.encodeFunctionData("burnFrom", [account, formState.amount.value]),
      nonce: fromUserNonce.toNumber(),
    };
    leaves.push([makeHashStruct(fromUserTx)]);

    const fromParams = {
      domain: fromEIP712Domain,
      message: fromUserTx,
      primaryType: "UserTx",
      types: fromTypes,
    };

    const fromUserTxSignature = await signTypedMessage(account, fromParams);

    verifySignature(
      account,
      fromEIP712Domain,
      {
        UserTx: fromTypes.UserTx,
      },
      fromUserTx,
      fromUserTxSignature
    );
    // --------- From --------- end

    // --------- To ---------
    const toRTokenAddress = formState.token.address;
    const toBundlerAddress = formState.to.bundleContractAddress;

    const toRTokenContract = new Contract(toRTokenAddress, rTokenInfo.abi, library.getSigner());

    const toBundlerContract = new Contract(toBundlerAddress, bundlerInfo.abi, library.getSigner());

    const toUserNonce = await toBundlerContract.nonces(account);

    // TODO: use this code but it doesn't work now
    // const eip712Domain = await bundler.eip712Domain();

    const toEIP712Domain = {
      chainId: 31337, // eip712Domain[3],
      name: "Bundler",
      verifyingContract: toBundlerAddress,
      version: "1",
    };

    const toTypes = {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      UserTx: [
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
        { name: "data", type: "bytes" },
        { name: "nonce", type: "uint256" },
      ],
    };

    const toUserTx = {
      to: toRTokenAddress,
      value: 0,
      data: toRTokenContract.interface.encodeFunctionData("mint", [account, formState.amount.value]),
      nonce: toUserNonce.toNumber(),
    };
    leaves.push([makeHashStruct(toUserTx)]);

    const toParams = {
      domain: toEIP712Domain,
      message: toUserTx,
      primaryType: "UserTx",
      types: toTypes,
    };

    const toUserTxSignature = await signTypedMessage(account, toParams);

    verifySignature(
      account,
      toEIP712Domain,
      {
        UserTx: toTypes.UserTx,
      },
      toUserTx,
      toUserTxSignature
    );
    // --------- To --------- end

    generateTx(
      account,
      fromUserTx,
      fromUserTxSignature,
      toUserTx,
      toUserTxSignature,
      fromEIP712Domain,
      toEIP712Domain,
      leaves
    );
  };

  // TODO: use this code but it doesn't work now
  async function generateTx(
    userAddress,
    fromUserTx,
    fromUserTxSignature,
    toUserTx,
    toUserTxSignature,
    fromEIP712Domain,
    toEIP712Domain,
    leaves
  ) {
    const tree = createMerkleTree(leaves);

    const BundleTypes = {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      BundleRoot: [{ name: "root", type: "bytes32" }],
    };

    const fromParams = {
      domain: fromEIP712Domain,
      message: {
        root: tree.root,
      },
      primaryType: "BundleRoot",
      types: BundleTypes,
    };

    const fromBundleTxSignature = await signTypedMessage(userAddress, fromParams);

    const fromTx = {
      from: account,
      to: fromUserTx.to,
      value: fromUserTx.value,
      data: fromUserTx.data,
      gasLimit: 0,
      gasPrice: 0,
      txSig: fromUserTxSignature,
      bundle_tx_merkle_path: makeProof(tree, makeHashStruct(fromUserTx)),
      bundle_tx_root: tree.root,
      bundle_tx_signature: fromBundleTxSignature,
      revert_flag: false,
    };

    debugger;

    // --------- To ---------
    const toParams = {
      domain: toEIP712Domain,
      message: {
        root: tree.root,
      },
      primaryType: "BundleRoot",
      types: BundleTypes,
    };

    const toBundleTxSignature = await signTypedMessage(userAddress, toParams);

    const toTx = {
      from: account,
      to: toUserTx.to,
      value: toUserTx.value,
      data: toUserTx.data,
      gasLimit: 0,
      gasPrice: 0,
      txSig: toUserTxSignature,
      bundle_tx_merkle_path: makeProof(tree, makeHashStruct(toUserTx)),
      bundle_tx_root: tree.root,
      bundle_tx_signature: toBundleTxSignature,
      revert_flag: false,
    };

    console.log("fromTx", fromTx);
    console.log("toTx", toTx);
  }

  async function signTypedMessage(address, params) {
    let signature;

    return new Promise((resolve, reject) => {
      provider // Or window.ethereum if you don't support EIP-6963.
        .sendAsync(
          {
            method: "eth_signTypedData_v4",
            params: [address, params],
            from: address,
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

  async function verifySignature(address, EIP712Domain, types, message, signature) {
    const msgHash = typedDataEncoder.hash(EIP712Domain, types, message);

    const recoveredAddress = recoverAddress(msgHash, signature);

    alert(recoveredAddress);

    return recoveredAddress == address;
  }

  function createMerkleTree(elements) {
    return StandardMerkleTree.of(elements, ["bytes32"]);
  }

  function makeHashStruct(tx) {
    const encodedData = defaultAbiCoder.encode(
      ["bytes32", "address", "uint256", "bytes32", "uint256"],
      [USER_TX_TYPE_HASH, tx.to, tx.value, ethers.solidityPackedKeccak256(["bytes"], [tx.data]), tx.nonce]
    );
    const hash = ethers.solidityPackedKeccak256(["bytes"], [encodedData]);
    return hash;
  }

  function makeProof(tree, value) {
    return tree.getProof([value]);
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
