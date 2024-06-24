import styled, { css } from "styled-components";

const StyledInput = styled.input`
  display: block;
  width: 100%;
  height: 100%;
  padding: ${(props) => !props.sortButton && "13px 22px 13px 24px"};
  border: none;
  ${(props) => props.theme.typography.size15}
  color: #3A4374;
  border-radius: 5px;
  background-color: #f7f8fd;
  outline: none;
  resize: none;
  &:hover {
    cursor: pointer;
  }
  &:focus {
    outline: 1px solid #4661e6;
  }

  ${(props) =>
    (props.error &&
      css`
        &:focus {
          outline: 1px solid #d73737;
        }
        &:active {
          outline: 1px solid #d73737;
        }
        outline: 1px solid #d73737;
      `) ||
    (props.active &&
      css`
        outline: 1px solid #4661e6;
      `)};
  @media (max-width: 600px) {
    ${(props) => props.theme.typography.size13regular}
  }
`;

export default StyledInput;
