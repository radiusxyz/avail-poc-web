import styled, { css } from "styled-components";
import StyledInput from "./StyledInput";
import StyledArrow from "./StyledArrow";

export const SelectBoxContainer = styled.div`
  position: relative;
`;

export const StyledSelectBox = styled(StyledInput)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${(props) =>
    props.sortButton &&
    css`
      width: auto;
      display: inline-flex;
      justify-content: start;
      gap: 5px;
      background-color: transparent;
      color: ${props.isShown ? "#c2c7d9" : "#f2f4fe"};
    `};

  ${StyledArrow} {
    transform: ${(props) =>
      props.isShown ? "rotate(0deg)" : "rotate(180deg)"};
  }
  @media (max-width: 600px) {
    ${(props) => props.theme.typography.size13regular};
  }
`;
