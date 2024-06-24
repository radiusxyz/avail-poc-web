import cuid from "cuid";
import React from "react";
import classes from "./styles/Roadmap.module.css";
import Container from "../components/Container";
import RoadmapCard from "../components/RoadmapCard";
import Arrow from "../components/UI/Arrow";
import Button from "../components/UI/Button";
import { useNavigate } from "react-router-dom";
import RoadmapMob from "../components/RoadmapMob";
import RoadmapDeskTab from "../components/RoadmapDeskTab";
import { ButtonTitle, PageTitle } from "../components/StyledRoadmap";

const Roadmap = ({ suggestions, handler }) => {
  const navigate = useNavigate();
  const grid = [[], [], []];
  const statusIndex = { "Planned": 0, "In-Progress": 1, "Live": 2 };

  suggestions.forEach((suggestion) => {
    grid[statusIndex[suggestion.status]].push(
      <RoadmapCard
        navigate={() => {
          navigate(`/suggestions/${suggestion.id}`);
        }}
        key={cuid()}
        suggestion={suggestion}
        handler={handler}
      />
    );
  });
  return (
    <Container className={classes.level_0}>
      <Container className={classes.level_1}>
        <Container className={classes.level_2}>
          <Button
            onClick={() => {
              navigate("/");
            }}
            kind="back"
            paint="transparent"
            jc="flex-start"
          >
            <Arrow direction="left" paint="#4661E6" />
            <ButtonTitle>Go back</ButtonTitle>
          </Button>

          <PageTitle>Roadmap</PageTitle>
        </Container>
        <Container>
          <Button
            onClick={() => {
              navigate("/create-feedback");
            }}
            kind="default"
            paint="#AD1FEA"
          >
            + Add Feedback
          </Button>
        </Container>
      </Container>
      {window.innerWidth <= 600 ? (
        <RoadmapMob suggestions={suggestions} grid={grid} />
      ) : (
        <RoadmapDeskTab suggestions={suggestions} grid={grid} />
      )}
    </Container>
  );
};

export default Roadmap;
