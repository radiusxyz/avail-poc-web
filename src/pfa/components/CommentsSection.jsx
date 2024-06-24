import cuid from "cuid";
import React from "react";
import classes from "./styles/CommentsSection.module.css";
import {
  CommentQuantity,
  CommentsWrapper,
  VerticalLine,
} from "./SuggestionDetailsStyles";
import horizontal_line from "../assets/images/horizontal_line.svg";
import Comment from "./Comment.jsx";
import Container from "./Container";

const CommentsSection = ({ suggestion, handler, handleCommentReply }) => {
  const handleComments = (comment, replyTo) => {
    handler((prevState) => [
      ...prevState.map((prevSuggestion) =>
        prevSuggestion.id !== suggestion.id
          ? prevSuggestion
          : handleCommentReply(comment, replyTo)
      ),
    ]);
  };

  return (
    <CommentsWrapper>
      <CommentQuantity>{suggestion.comments.quantity} Comments</CommentQuantity>
      <Container className={classes.level_0}>
        {suggestion.comments.commentList.map((comment, i) => {
          return comment.children.length ? (
            <Container className={classes.level_1} key={cuid()}>
              <Comment comment={comment} handler={handleComments} />
              <Container className={classes.level_2}>
                {comment.children.map((child) => (
                  <Comment
                    key={cuid()}
                    comment={child}
                    handler={handleComments}
                  />
                ))}
              </Container>
              <VerticalLine />
              {i < suggestion.comments.commentList.length - 1 && (
                <img src={horizontal_line} alt="horizontal_line" />
              )}
            </Container>
          ) : (
            <Container className={classes.level_3} key={cuid()}>
              <Comment comment={comment} handler={handleComments} />
              {i < suggestion.comments.commentList.length - 1 && (
                <img src={horizontal_line} alt="horizontal_line" />
              )}
            </Container>
          );
        })}
      </Container>
    </CommentsWrapper>
  );
};

export default CommentsSection;
