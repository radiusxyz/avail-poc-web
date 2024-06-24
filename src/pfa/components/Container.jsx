import React from "react";
import styled from "styled-components";

const FlexibleContainer = styled.div`
  display: ${(props) => (props.display ? props.display : "flex")};
`;
const Container = (props) => {
  return <FlexibleContainer {...props}>{props.children}</FlexibleContainer>;
};
export default Container;
