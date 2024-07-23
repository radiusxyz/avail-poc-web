import styled, { css } from "styled-components";
import StyledArrow from "./StyledArrow";

const StyledButton = styled.button`
  border: none;
  border-radius: 10px;
  display: flex;
  white-space: nowrap;
  text-align: center;
  justify-content: ${(props) => (props.jc ? props.jc : "center")};
  align-items: center;
  gap: 15px;
  color: ${(props) =>
    (props.kind === "back" && props.paint === "transparent" && "#ffffff") ||
    "#f2f4fe"};
  padding: ${({ kind, theme }) =>
    kind === "back" ? "0px" : "12.5px 25px 11.5px 24px"};
  background-color: ${({ paint }) => paint};
  ${({ theme }) => theme.typography.size14};
  ${({ kind, paint, theme }) => theme.btns[kind]?.[paint]}
  ${(props) =>
    props.active &&
    css`
    opacity: 0.75;
    ${StyledArrow} {
    transform: rotate("180deg"));
  }};

`};
  @media (max-width: 600px) {
    ${({ theme }) => theme.typography.size13bold};
    padding: 10.5px 17px 10.5px 16px;
    ${(props) =>
      props.kind === "back" &&
      css`
        padding: 0px 0px 3px 0px;
      `}};
  }
`;

export default StyledButton;
