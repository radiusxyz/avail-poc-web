import React from "react";
import styled from "styled-components";

const FlexibleContainer = styled.div`
  display: ${(props) => (props.display ? props.display : "flex")};
`;
const Container = (props) => {
  return (
    <FlexibleContainer className={props.className} display={props.display}>
      {props.children}
    </FlexibleContainer>
  );
};
export default Container;
