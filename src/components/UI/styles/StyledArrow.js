import styled from "styled-components";

const StyledArrow = styled.svg`
  display: block;
  fill: none;
  stroke-width: 2;
  color: ${(props) => props.paint};
  width: 11px;
  height: 7px;
  transform: rotate(
    ${(props) =>
      (props.direction === "up" && "0deg") ||
      (props.direction === "right" && "90deg") ||
      (props.direction === "left" && "-90deg") ||
      (props.direction === "down" && "180deg")}
  );
`;

export default StyledArrow;
