import { useNavigate } from "react-router-dom";
import classes from "./styles/TopBar.module.css";
import styled from "styled-components";
import Container from "./Container";
import Arrow from "./UI/Arrow";
import Button from "./UI/Button";
import LightBulbIcon from "./UI/LightBulbIcon";
import SelectBox from "./UI/SelectBox";
import { sortOptions } from "../model";

const TotalSuggestions = styled.p`
  ${(props) => props.theme.typography.size18};
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
`;

const TopBar = ({ suggestions, handler }) => {
  const navigate = useNavigate();
  const handleSort = (option) => {
    return [
      ...((option === "Most upvotes" &&
        suggestions.sort((first, second) => second.upvotes - first.upvotes)) ||
        (option === "Least upvotes" &&
          suggestions.sort(
            (first, second) => first.upvotes - second.upvotes
          )) ||
        (option === "Most comments" &&
          suggestions.sort(
            (first, second) =>
              second.comments.quantity - first.comments.quantity
          )) ||
        (option === "Least comments" &&
          suggestions.sort(
            (first, second) =>
              first.comments.quantity - second.comments.quantity
          ))),
    ].map((suggestion) => suggestion.id);
  };

  const handleSetSort = (option) => {
    handler(() => handleSort(option));
  };

  return (
    <Container className={classes.level_0}>
      <Container className={classes.level_1}>
        {window.innerWidth > 600 && (
          <Container className={classes.level_2}>
            <LightBulbIcon />
            <TotalSuggestions>
              {suggestions.length} Suggestions
            </TotalSuggestions>
          </Container>
        )}
        <SelectBox
          options={sortOptions}
          sortButton
          top="50px"
          w="255px"
          handleOption={handleSetSort}
        >
          <Arrow direction="down" paint="#FFFFFF" />
        </SelectBox>
      </Container>
      <Container>
        <Button
          onClick={(event) => {
            event.preventDefault();
            navigate("/create-feedback");
          }}
          kind="default"
          paint="#AD1FEA"
        >
          + Add Feedback
        </Button>
      </Container>
    </Container>
  );
};

export default TopBar;
