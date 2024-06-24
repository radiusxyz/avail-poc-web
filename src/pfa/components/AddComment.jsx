import React, { useRef, useState } from "react";
import classes from "./styles/AddComment.module.css";
import StyledInput from "./UI/styles/StyledInput";
import { TopMostContainer, Header, CharLeft } from "./styles/AddCommentStyles";
import Button from "./UI/Button";
import Container from "./Container";

const AddComment = ({ suggestion, handler, handleCommentReply }) => {
  const [quantity, setQuantity] = useState(250);
  const [comment, setComment] = useState("");
  const inputData = useRef();

  const handleComment = () => {
    setQuantity(() => 250 - inputData.current.value.length);
    setComment(inputData.current.value);
  };

  const handlePostComment = () => {
    comment &&
      handler((prevState) => [
        ...prevState.map((prevSuggestion) =>
          prevSuggestion.id !== suggestion.id
            ? prevSuggestion
            : handleCommentReply(comment)
        ),
      ]);
    inputData.current.value = "";
    setComment(() => "");
    setQuantity(() => 250);
  };

  const handleEnterPress = (event) => {
    if (event.code === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handlePostComment();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handlePostComment();
  };

  return (
    <form onSubmit={handleSubmit}>
      <TopMostContainer>
        <Header>Add Comment</Header>
        <Container className={classes.level_0}>
          <StyledInput
            maxLength={250}
            ref={inputData}
            onChange={handleComment}
            as="textarea"
            placeholder="Type your comment here"
            onKeyDown={handleEnterPress}
          />
        </Container>
        <Container className={classes.level_1}>
          <CharLeft>{quantity} characters left</CharLeft>
          <Button type="submit" kind="default" paint="#AD1FEA">
            <p>Post Comment</p>
          </Button>
        </Container>
      </TopMostContainer>
    </form>
  );
};
export default AddComment;
