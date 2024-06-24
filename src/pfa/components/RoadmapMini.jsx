import classes from "./styles/RoadmapMini.module.css";
import Container from "./Container";
import {
  Header,
  Link as Span,
  Status,
  Dot,
  Quantity,
} from "./RoadmapMiniStyles";
import StyledLink from "./UI/styles/StyledLink";

const RoadmapMini = ({ suggestions }) => {
  const statusesAmount = [
    suggestions.filter((suggestion) => suggestion.status === "Planned").length,
    suggestions.filter((suggestion) => suggestion.status === "In-Progress")
      .length,
    suggestions.filter((suggestion) => suggestion.status === "Live").length,
  ];
  return (
    <Container className={classes.level_0}>
      <Container className={classes.level_1}>
        <Header>Roadmap</Header>
        <Span number={suggestions.length}>
          <StyledLink to="/roadmap">View</StyledLink>
        </Span>
      </Container>
      <Container className={classes.level_2}>
        <Container className={classes.level_3}>
          <Dot color="#f49f85" />
          <Status>Planned</Status>
          <Quantity>{statusesAmount[0]}</Quantity>
        </Container>
        <Container className={classes.level_3}>
          <Dot color="#ad1fea" />
          <Status>In-Progress</Status>
          <Quantity>{statusesAmount[1]}</Quantity>
        </Container>
        <Container className={classes.level_3}>
          <Dot color="#62bcfa" />
          <Status>Live</Status>
          <Quantity>{statusesAmount[2]}</Quantity>
        </Container>
      </Container>
    </Container>
  );
};

export default RoadmapMini;
