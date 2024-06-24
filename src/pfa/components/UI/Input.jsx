import styled from "styled-components";
import StyledInput from "./styles/StyledInput";

const StyledSpan = styled.span`
  display: inline-block;
  color: #d73737;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  position: absolute;
  bottom: -26px;
`;

function Input(props) {
  return (
    <>
      <StyledInput
        onBlur={props.onBlur}
        onChange={props.onChange}
        as={props.as}
        active={props.active}
        error={props.error}
        defaultValue={props.defaultValue}
      />
      {props.error && <StyledSpan>Can't be empty</StyledSpan>}
    </>
  );
}

export default Input;
