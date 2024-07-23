import styled, { css } from "styled-components";
import StyledArrow from "./StyledArrow";
import StyledButton from "./StyledButton";

const StyledPinButton = styled(StyledButton)`
  gap: ${(props) => (props.direction === "horizontal" ? "9.5px" : "8px")};
  flex-direction: ${(props) =>
    props.direction === "horizontal" ? "row" : "column"};
  ${({ theme }) => theme.typography.size13}
  ${({ kind, theme }) => theme.btns[kind]}
  ${(props) =>
    props.filter &&
    css`
      &:hover {
        cursor: pointer;
        background-color: #cfd7ff;
      }
      &:active {
        color: #ffffff;
        background-color: #4661e6;
      }
    `}
  ${(props) =>
    props.selected &&
    css`
      color: #ffffff;
      background-color: #4661e6;
      &:hover {
        cursor: pointer;
        background-color: #4661e6;
      }
    `}
  ${(props) =>
    props.direction === "horizontal" &&
    css`
      padding: 11px 12.5px 10px 16px;
      @media (max-width: 600px) {
        padding: 6px 13px 7px 16px;
        min-width: 0;
        min-height: 0;
      }
    `}
  ${(props) =>
    props.upvoted &&
    css`
      background-color: #4661e6;
      color: #ffffff;
      ${StyledArrow} {
        color: #ffffff;
      }
      &:hover {
        background-color: #4661e6;
      }
      &:hover ${StyledArrow} {
        color: #ffffff;
        background-color: #4661e6;
      }
    `};
  &:active ${StyledArrow} {
    color: #ffffff;
  }
`;

export default StyledPinButton;
