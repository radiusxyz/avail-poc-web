import classes from "./styles/BoardTitle.module.css";
import styled from "styled-components";
import Container from "./Container";
import hamburger from "../assets/icons/hamburger.png";
import close from "../assets/icons/close.png";

const Title = styled.p`
  ${(props) => props.theme.typography.size20};
  color: #ffffff;
  @media (max-width: 600px) {
    ${(props) => props.theme.typography.size15bold};
  }
`;

const Description = styled.p`
  color: #e1d4fc;
  ${(props) => props.theme.typography.size15semi};
  @media (max-width: 600px) {
    ${(props) => props.theme.typography.size13_500};
  }
`;

const BoardTitle = ({ displayRightPanel, handler }) => (
  <Container className={classes.level_0}>
    <Container className={classes.level_1}>
      <Title>Frontend Mentor</Title>
      <Description>Feedback Board</Description>
    </Container>
    {window.innerWidth <= 600 && (
      <Container onClick={handler} className={classes.level_2}>
        {displayRightPanel ? (
          <img src={close} alt="close" />
        ) : (
          <img src={hamburger} alt="hamburger" />
        )}
      </Container>
    )}
  </Container>
);
export default BoardTitle;
