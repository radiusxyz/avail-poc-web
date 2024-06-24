import React, { useState } from "react";
import Container from "./Container";
import { Description, Title } from "./StyledRoadmap";
import classes from "../screens/styles/Roadmap.module.css";

const RoadmapMob = ({ grid }) => {
  const [activeTab, setActiveTab] = useState("Planned");
  const handleActiveTab = (event) => {
    setActiveTab(event.target.textContent);
  };
  return (
    <>
      <Container className={classes.level_0_mob}>
        <Container
          onClick={handleActiveTab}
          className={
            activeTab.includes("Planned")
              ? classes.bottom_line_planned + " " + classes.level_5
              : classes.level_5
          }
        >
          <Title
            className={activeTab.includes("Planned") && classes.active_tab}
          >
            Planned ({grid[0].length})
          </Title>
        </Container>
        <Container
          onClick={handleActiveTab}
          className={
            activeTab.includes("In-Progress")
              ? classes.bottom_line_in_progress + " " + classes.level_5
              : classes.level_5
          }
        >
          <Title
            className={activeTab.includes("In-Progress") && classes.active_tab}
          >
            In-Progress ({grid[1].length})
          </Title>
        </Container>
        <Container
          onClick={handleActiveTab}
          className={
            activeTab.includes("Live")
              ? classes.bottom_line_live + " " + classes.level_5
              : classes.level_5
          }
        >
          <Title className={activeTab.includes("Live") && classes.active_tab}>
            Live ({grid[2].length})
          </Title>
        </Container>
      </Container>
      <Container className={classes.level_3}>
        <Container className={classes.level_4}>
          <Container className={classes.level_6}>
            <Title className={classes.title}>
              {(activeTab.includes("Planned") &&
                `Planned (${grid[0].length})`) ||
                (activeTab.includes("In-Progress") &&
                  `In-Progress (${grid[1].length})`) ||
                (activeTab.includes("Live") && `Live (${grid[2].length})`)}
            </Title>
            <Description>
              {(activeTab.includes("Planned") &&
                `Ideas prioritized for research`) ||
                (activeTab.includes("In-Progress") &&
                  `Currently being developed`) ||
                (activeTab.includes("Live") && `Released features`)}
            </Description>
          </Container>
          {(activeTab.includes("Planned") && grid[0]) ||
            (activeTab.includes("In-Progress") && grid[1]) ||
            (activeTab.includes("Live") && grid[2])}
        </Container>
      </Container>
    </>
  );
};

export default RoadmapMob;
