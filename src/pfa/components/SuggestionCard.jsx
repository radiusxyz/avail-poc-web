import classes from "./styles/SuggestionCard.module.css";
import Arrow from "./UI/Arrow";
import BubbleIcon from "./UI/BubbleIcon";
import Button from "./UI/Button";
import { Content, Title, Details, Num } from "./SuggestionCardStyles";
import Container from "./Container";

const SuggestionCard = ({ suggestion, handler }) => {
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

  return window.innerWidth > 600 ? (
    <Container className={classes.level_0}>
      <Container className={classes.level_1}>
        <Button
          onClick={handleUpvote}
          upvoted={suggestion.upvotedByMe}
          kind="upvote"
        >
          <Arrow paint="#4661E6" />
          {suggestion.upvotes}
        </Button>
        <Content>
          <Title>{suggestion.title}</Title>
          <Details>{suggestion.details}</Details>
          <Button kind="tag">{suggestion.tag}</Button>
        </Content>
      </Container>
      <Container className={classes.level_2}>
        <BubbleIcon />
        <Num>{suggestion.comments.quantity}</Num>
      </Container>
    </Container>
  ) : (
    <Container className={classes.level_0}>
      <Container className={classes.level_1}>
        <Content>
          <Title>{suggestion.title}</Title>
          <Details>{suggestion.details}</Details>
          <Button kind="tag">{suggestion.tag}</Button>
        </Content>
      </Container>
      <Container className={classes.level_3}>
        <Button
          direction="horizontal"
          onClick={handleUpvote}
          upvoted={suggestion.upvotedByMe}
          kind="upvote"
        >
          <Arrow paint="#4661E6" />
          {suggestion.upvotes}
        </Button>
        <Container className={classes.level_2}>
          <BubbleIcon />
          <Num>{suggestion.comments.quantity}</Num>
        </Container>
      </Container>
    </Container>
  );
};

export default SuggestionCard;
