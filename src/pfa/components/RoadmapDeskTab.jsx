import React from "react";
import Container from "./Container";
import { Description } from "./StyledRoadmap";
import classes from "../screens/styles/Roadmap.module.css";
import { Title } from "./SuggestionCardStyles";

const RoadmapDeskTab = ({ grid }) => (
  <Container className={classes.level_3}>
    <Container className={classes.level_4}>
      <Container className={classes.level_5}>
        <Title>Planned ({grid[0].length})</Title>
        <Description>Ideas prioritized for research</Description>
      </Container>
      {grid[0]}
    </Container>
    <Container className={classes.level_4}>
      <Container className={classes.level_5}>
        <Title>In-Progress ({grid[1].length})</Title>
        <Description>Currently being developed</Description>
      </Container>
      {grid[1]}
    </Container>
    <Container className={classes.level_4}>
      <Container className={classes.level_5}>
        <Title>Live ({grid[2].length})</Title>
        <Description>Released features</Description>
      </Container>
      {grid[2]}
    </Container>
  </Container>
);

export default RoadmapDeskTab;
