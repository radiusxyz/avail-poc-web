import styled from "styled-components";

export const StyledContainer = styled.ul`
  background: #ffffff;
  width: ${(props) => (props.w ? props.w : "100%")};
  border-radius: ${(props) => props.theme["border-radius"]};
  box-shadow: 0px 10px 40px -7px rgba(55, 63, 104, 0.350492);
  margin-top: 16px;
  list-style: none;
  z-index: 9;
  position: absolute;
  top: ${(props) => (props.top && props.top) || "45px"};
  left: 0;
`;
