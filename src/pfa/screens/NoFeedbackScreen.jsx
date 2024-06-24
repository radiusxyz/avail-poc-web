import { useNavigate } from "react-router-dom";
import classes from "./styles/NoFeedbackScreen.module.css";
import Container from "../components/Container";
import Button from "../components/UI/Button";
import ImageNoFeedback from "../components/UI/ImageNoFeedback";
import { Details, Title } from "./styles/NoFeedbackScreenStyles";

const NoFeedBackScreen = () => {
  const navigate = useNavigate();
  return (
    <Container className={classes.level_0}>
      <ImageNoFeedback />
      <Title>There is no feedback yet.</Title>
      <Details>
        <p>Got a suggestion? Found a bug that needs to be squashed?</p>
        <p>We love hearing about new ideas to improve our app.</p>
      </Details>
      <Button
        kind="default"
        onClick={() => {
          navigate("/create-feedback");
        }}
        paint="#AD1FEA"
      >
        + Add Feedback
      </Button>
    </Container>
  );
};
export default NoFeedBackScreen;
