import React from "react";
import classes from "./styles/RoadmapCard.module.css";
import styled from "styled-components";
import BubbleIcon from "./UI/BubbleIcon";
import { Num } from "./SuggestionCardStyles";
import Button from "./UI/Button";
import Arrow from "./UI/Arrow";
import Container from "./Container";

const TopMostContainer = styled.div`
  padding: 25px 32px 32px 32px;
  border-top: 6px solid
    ${(props) =>
      (props.status === "Planned" && "#f49f85") ||
      (props.status === "In-Progress" && "#ad1fea") ||
      (props.status === "Live" && "#62bcfa")};
  border-radius: 5px;
  max-width: 350px;
  min-height: 272px;
  background-color: #ffffff;
  @media (max-width: 800px) {
    max-width: 223px;
    min-height: 251px;
  }
  @media (max-width: 600px) {
    width: 100%;
    max-width: none;
    min-height: 0;
  }
`;

const Title = styled.p`
  ${(props) => props.theme.typography.size18};
  margin-top: 8px;
  margin-bottom: 4px;
  color: #3a4374;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  @media (max-width: 800px) {
    ${(props) => props.theme.typography.size13bold};
  }
`;

const Details = styled.p`
  ${(props) => props.theme.typography.size16};
  margin-bottom: 16px;
  color: #647196;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  @media (max-width: 800px) {
    ${(props) => props.theme.typography.size13regular};
  }
  @media (max-width: 600px) {
    white-space: normal;
    ${(props) => props.theme.typography.size13regular};
  }
`;

const Status = styled.p`
  ${(props) => props.theme.typography.size16}
  color: #647196;
  @media (max-width: 1160px) {
    ${(props) => props.theme.typography.size13regular}
  }
`;

const Dot = styled.div`
  border-radius: 50%;
  width: 8px;
  height: 8px;
  background-color: ${(props) => props.color};
`;

const RoadmapCard = ({ suggestion, handler, navigate }) => {
  const handleQuantity = () => {
    const quantity = suggestion.upvotedByMe
      ? suggestion.upvotes - 1
      : suggestion.upvotes + 1;
    return {
      ...suggestion,
      upvotes: quantity,
      upvotedByMe: !suggestion.upvotedByMe,
    };
  };

  const handleUpvote = (event) => {
    handler((prevState) => [
      ...prevState.map((prevSuggestion) =>
        prevSuggestion.id !== suggestion.id ? prevSuggestion : handleQuantity()
      ),
    ]);
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <TopMostContainer onClick={navigate} status={suggestion.status}>
      <Container className={classes.level_0}>
        <Dot
          color={
            (suggestion.status === "Planned" && "#f49f85") ||
            (suggestion.status === "In-Progress" && "#ad1fea") ||
            (suggestion.status === "Live" && "#62bcfa")
          }
        />
        <Status>{suggestion.status}</Status>
      </Container>
      <Title>{suggestion.title}</Title>
      <Details>{suggestion.details}</Details>
      <Button kind="tag">{suggestion.tag}</Button>
      <Container className={classes.level_1}>
        <Button
          onClick={handleUpvote}
          upvoted={suggestion.upvotedByMe}
          kind="upvote"
          direction="horizontal"
        >
          {suggestion.upvotes}
          <Arrow direction="up" paint="#4661E6" />
        </Button>
        <Container className={classes.level_2}>
          <BubbleIcon />
          <Num>{suggestion.comments.quantity}</Num>
        </Container>
      </Container>
    </TopMostContainer>
  );
};

export default RoadmapCard;
