import cuid from "cuid";
import React from "react";
import classes from "./styles/Suggestions.module.css";
import Container from "../components/Container";
import SuggestionCard from "../components/SuggestionCard";
import StyledLink from "../components/UI/styles/StyledLink";

const Suggestions = ({ suggestions, handler }) => {
  return (
    <Container className={classes.level_0}>
      {suggestions.map((suggestion) => (
        <StyledLink key={cuid()} to={`/suggestions/${suggestion.id}`}>
          <SuggestionCard suggestion={suggestion} handler={handler} />
        </StyledLink>
      ))}
    </Container>
  );
};

export default Suggestions;
