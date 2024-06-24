import React, { useReducer } from "react";
import classes from "./styles/CreateEditFeedback.module.css";
import { useParams } from "react-router-dom";
import radius from "../assets/images/favicon1.png";
import pen_icon from "../assets/icons/modal_pen_icon.svg";
import InputRow from "../components/InputRow";
import Arrow from "../components/UI/Arrow";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import SelectBox from "../components/UI/SelectBox";
import Container from "../components/Container";
import { useNavigate } from "react-router";
import cuid from "cuid";
import { ButtonWrapper, Icon, ModalTitle, TextareaWrapper, Wrapper } from "./styles/CreateEditFeedbackStyles";

const tokens = [{ label: "RAD" }, { label: "ETH" }];

const rollups = [{ label: "Rollup A" }, { label: "Rollup B" }, { label: "Rollup C" }, { label: "Rollup D" }];

const CreateEditFeedback = ({ edit, suggestions, handler }) => {
  const navigate = useNavigate();
  const params = useParams();
  const feedback = params.id ? { ...suggestions.find((suggestion) => suggestion.id === params.id) } : {};
  const id = edit ? feedback.id : cuid();

  const formReducer = (state, action) => {
    if (action.type === "TITLE_INPUT") {
      return {
        ...state,
        title: {
          value: action.val,
          isValid: action.val.length !== 0,
          touched: true,
        },
      };
    }
    if (action.type === "DETAILS_INPUT") {
      return {
        ...state,
        details: {
          value: action.val,
          isValid: action.val.length !== 0,
          touched: true,
        },
      };
    }
    if (action.type === "TITLE_VALID") {
      return {
        ...state,
        title: { ...state.title, isValid: action.val },
      };
    }
    if (action.type === "DETAILS_VALID") {
      return {
        ...state,
        details: { ...state.details, isValid: action.val },
      };
    }
    if (action.type === "TITLE_TOUCH") {
      return {
        ...state,
        title: {
          ...state.title,
          isValid: !(action.val && state.title.value === ""),
          touched: action.val,
        },
      };
    }
    if (action.type === "DETAILS_TOUCH") {
      return {
        ...state,
        details: {
          ...state.details,
          isValid: !(action.val && state.details.value === ""),
          touched: action.val,
        },
      };
    }
    if (action.type === "CATEGORY_SELECT") {
      return { ...state, rollup: action.val };
    }
    if (action.type === "STATUS_SELECT") {
      return { ...state, status: action.val };
    }
    return { ...state };
  };

  const [formState, dispatchForm] = useReducer(formReducer, {
    title: {
      value: edit ? feedback.title : "",
      isValid: edit ? true : false,
      touched: edit ? true : false,
    },
    details: {
      value: edit ? feedback.title : "",
      isValid: edit ? true : false,
      touched: edit ? true : false,
    },
    from: rollups[0].label,
    to: rollups[1].label,
  });

  const handleTitle = (event) => {
    dispatchForm({ type: "TITLE_INPUT", val: event.target.value.trim() });
  };

  const handleTitleBlur = (event) => {
    dispatchForm({ type: "TITLE_TOUCH", val: true });
    console.log(formState.title);
  };

  const handleDetails = (event) => {
    dispatchForm({ type: "DETAILS_INPUT", val: event.target.value.trim() });
  };

  const handleDetailsBlur = (event) => {
    dispatchForm({ type: "DETAILS_TOUCH", val: true });
  };

  const handleCategory = (category) => {
    dispatchForm({ type: "CATEGORY_SELECT", val: category });
  };

  const handleStatus = (status) => {
    dispatchForm({ type: "STATUS_SELECT", val: status });
  };

  // let modalTitle = edit ? `Editing ‘${feedback.title}’` : "Create New Feedback";
  let modalTitle = "Radius Bridge";

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatchForm({ type: "TITLE_TOUCH", val: true });
    dispatchForm({ type: "DETAILS_TOUCH", val: true });
    //Ask Abdulla why does not it work without timer
    if (formState.title.isValid && formState.details.isValid) {
      handler(() => {
        return event.target.innerText === "Delete"
          ? [...suggestions.filter((suggestion) => suggestion.id !== feedback.id)]
          : [
              {
                id: id,
                title: formState.title.value,
                details: formState.details.value,
                tag: formState.rollup,
                status: formState.status,
                upvotedByMe: feedback.upvotedByMe || false,
                upvotes: feedback.upvotes || 0,
                comments: feedback.comments || { quantity: 0, commentList: [] },
              },
              ...suggestions.filter((suggestion) => suggestion.id !== id),
            ];
      });
      setTimeout(() => {
        navigate("/");
      }, 200);
    }
  };

  return (
    <Container className={classes.level_0}>
      <Container className={classes.level_1}>
        <Wrapper edit={edit}>
          <Icon>
            <img width='64' src={radius} alt={`${radius}`} />
          </Icon>
          <ModalTitle>{modalTitle}</ModalTitle>
          <Container className={classes.level_2}>
            <InputRow title='Token' description='Select the asset you would like to bridge'>
              <SelectBox name='options' options={tokens} handleOption={handleCategory}>
                <Arrow direction='down' paint='#4661E6' />
              </SelectBox>
            </InputRow>
            <InputRow title='Amount' description='Input the amount you would like to bridge'>
              <Input
                id='title'
                name='title'
                onBlur={handleTitleBlur}
                onChange={handleTitle}
                error={!formState.title.isValid && formState.title.touched ? true : false}
                defaultValue={formState.title.value}
              />
            </InputRow>
            <InputRow title='From' description='Select the network you want to bridge from'>
              <SelectBox name='options' options={rollups} handleOption={handleCategory}>
                <Arrow direction='down' paint='#4661E6' />
              </SelectBox>
            </InputRow>
            <InputRow title='To' description='Select the network you want to bridge to'>
              <SelectBox name='options' options={rollups} handleOption={handleCategory}>
                <Arrow direction='down' paint='#4661E6' />
              </SelectBox>
            </InputRow>
          </Container>
          <Container className={classes.level_3}>
            {edit && (
              <ButtonWrapper>
                <Button className={classes.level_4} kind='default' type='button' paint='#D73737' onClick={handleSubmit}>
                  Delete
                </Button>
              </ButtonWrapper>
            )}
            <Container>
              <Button className={classes.level_4} kind='default' paint='#AD1FEA' type='button' onClick={handleSubmit}>
                Bridge
              </Button>
            </Container>
          </Container>
        </Wrapper>
      </Container>
    </Container>
  );
};

export default CreateEditFeedback;
