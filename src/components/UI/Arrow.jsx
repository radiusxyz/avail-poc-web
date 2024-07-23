import React from "react";
import StyledArrow from "./styles/StyledArrow";

const Arrow = (props) => (
  <StyledArrow viewBox='0 0 11 7' direction={props.direction} className={props.className} paint={props.paint}>
    <path stroke='currentColor' d='M1.33398 6L5.33398 2L9.33398 6' />
  </StyledArrow>
);

export default Arrow;
