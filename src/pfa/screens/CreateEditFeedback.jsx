import React, { useReducer } from "react";
import classes from "./styles/CreateEditFeedback.module.css";
import { useParams } from "react-router-dom";
import plus_icon from "../assets/icons/modal_plus_icon.svg";
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

const categories = [
  { label: "Feature" },
  { label: "UI" },
  { label: "UX" },
  { label: "Ehnhancement" },
  { label: "Bug" },
];

const statuses = [{ label: "Planned" }, { label: "In-Progress" }, { label: "Live" }];

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
      return { ...state, category: action.val };
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
    category: categories[0].label,
    status: statuses[0].label,
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

  let icon = edit ? pen_icon : plus_icon;
  // let modalTitle = edit ? `Editing ‘${feedback.title}’` : "Create New Feedback";
  let modalTitle = "Bridge Tokens Between Rollups";

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
                tag: formState.category,
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
        {/* <Container>
          <Button
            kind='back'
            paint='transparent'
            onClick={() => {
              navigate("/");
            }}
          >
            <Arrow direction='left' paint='#4661E6' />
            Go back
          </Button>
        </Container> */}
        <Wrapper edit={edit}>
          <Icon>
            <img src={icon} alt={`${icon}`} />
          </Icon>
          <ModalTitle>{modalTitle}</ModalTitle>
          <Container className={classes.level_2}>
            <InputRow title='Feedback Title' description='Add a short, descriptive headline'>
              <Input
                id='title'
                name='title'
                onBlur={handleTitleBlur}
                onChange={handleTitle}
                error={!formState.title.isValid && formState.title.touched ? true : false}
                defaultValue={formState.title.value}
              />
            </InputRow>
            <InputRow title='Category' description='Choose a category for your feedback'>
              <SelectBox name='options' options={categories} handleOption={handleCategory}>
                <Arrow direction='down' paint='#4661E6' />
              </SelectBox>
            </InputRow>
            {edit && (
              <InputRow title='Update Status' description='Change feedback state'>
                <SelectBox name='statuses' options={statuses} handleOption={handleStatus}>
                  <Arrow direction='down' paint='#4661E6' />
                </SelectBox>
              </InputRow>
            )}
            <InputRow
              title='Feedback Detail'
              description='Include any specific comments on what should be improved, added,
            etc.'
            >
              <TextareaWrapper>
                <Input
                  name='detail'
                  id='detail'
                  as='textarea'
                  onBlur={handleDetailsBlur}
                  onChange={handleDetails}
                  error={!formState.details.isValid && formState.details.touched ? true : false}
                  defaultValue={formState.details.value}
                />
              </TextareaWrapper>
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
              <Button
                className={classes.level_4}
                kind='default'
                type='button'
                onClick={() => {
                  navigate("/");
                }}
                paint='#3A4374'
              >
                Cancel
              </Button>
            </Container>
            <Container>
              <Button className={classes.level_4} kind='default' paint='#AD1FEA' type='button' onClick={handleSubmit}>
                {edit ? "Save Changes" : "Add Feedback"}
              </Button>
            </Container>
          </Container>
        </Wrapper>
      </Container>
    </Container>
  );
};

export default CreateEditFeedback;
