import React, { useReducer, useState } from "react";
import classes from "./styles/CreateEditFeedback.module.css";
import { useParams } from "react-router-dom";
import radius from "../assets/images/favicon1.png";
import InputRow from "../components/InputRow";
import Arrow from "../components/UI/Arrow";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import SelectBox from "../components/UI/SelectBox";
import Container from "../components/Container";
import { useNavigate } from "react-router";
import cuid from "cuid";
import { ButtonWrapper, Icon, ModalTitle, Wrapper } from "./styles/CreateEditFeedbackStyles";

const tokens = [{ label: "RAD" }, { label: "ETH" }];

const rollups = [{ label: "Rollup A" }, { label: "Rollup B" }, { label: "Rollup C" }, { label: "Rollup D" }];

const CreateEditFeedback = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [dynamicNetworks, setDynamicNetworks] = useState(rollups);
  const handleIsConnected = () => {
    setIsConnected((prevState) => !prevState);
  };
  const navigate = useNavigate();

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
      return { ...state, rollup: action.val };
    }
    if (action.type === "FROM_SELECT") {
      return { ...state, rollup: action.val };
    }
    if (action.type === "TO_SELECT") {
      return { ...state, status: action.val };
    }
    return { ...state };
  };

  const [formState, dispatchForm] = useReducer(formReducer, {
    amount: {
      value: "",
      isValid: false,
      touched: false,
    },
    from: rollups[0].label,
    to: rollups[1].label,
  });

  const handleToken = (token) => {
    dispatchForm({ type: "TOKEN_SELECT", val: token });
  };
  const handleAmount = (event) => {
    dispatchForm({ type: "AMOUNT_INPUT", val: event.target.value?.trim() });
  };

  const handleAmountBlur = (event) => {
    dispatchForm({ type: "AMOUNT_TOUCH", val: true });
    console.log(formState.amount);
  };
  const handleFrom = (from) => {
    dispatchForm({ type: "FROM_SELECT", val: from });
  };
  const handleTo = (to) => {
    dispatchForm({ type: "TO_SELECT", val: to });
  };

  let modalTitle = "Radius Bridge";

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatchForm({ type: "AMOUNT_TOUCH", val: true });
    dispatchForm({ type: "DETAILS_TOUCH", val: true });
    //Ask Abdulla why does not it work without timer
    if (formState.amount.isValid && formState.details.isValid) {
      setTimeout(() => {
        navigate("/");
      }, 200);
    }
  };

  return (
    <Container className={classes.level_0}>
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
              <SelectBox name='options' options={rollups} handleOption={handleFrom}>
                <Arrow direction='down' paint='#4661E6' />
              </SelectBox>
            </InputRow>
            <InputRow title='To' description='Select the network you want to bridge to'>
              <SelectBox name='options' options={rollups} handleOption={handleTo}>
                <Arrow direction='down' paint='#4661E6' />
              </SelectBox>
            </InputRow>
          </Container>
          <Container className={classes.level_3}>
            {isConnected ? (
              <>
                <ButtonWrapper>
                  <Button
                    className={classes.level_4}
                    kind='default'
                    type='button'
                    paint='#D73737'
                    onClick={handleIsConnected}
                  >
                    Disconnect
                  </Button>
                </ButtonWrapper>

                <Container>
                  <Button
                    className={classes.level_4}
                    kind='default'
                    paint='#AD1FEA'
                    type='button'
                    onClick={handleSubmit}
                  >
                    Transfer
                  </Button>
                </Container>
              </>
            ) : (
              <Container>
                <Button
                  className={classes.level_4}
                  kind='default'
                  type='button'
                  onClick={handleIsConnected}
                  paint='#3A4374'
                >
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

export default CreateEditFeedback;
