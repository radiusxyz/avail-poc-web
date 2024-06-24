import styled from "styled-components";

export const CommentsWrapper = styled.div`
  padding: 24px 32px;
  border-radius: ${(props) => props.theme["border-radius"]};
  background-color: #ffffff;
`;

export const VerticalLine = styled.div`
  position: absolute;
  top: 63px;
  left: 20px;
  border-left: 1px solid #647196;
  width: 1px;
  opacity: 10%;
  height: calc(100% - 170px);
`;

export const CommentQuantity = styled.h3`
  margin-left: 2px;
  margin-bottom: 28px;
  color: #3a4374;
  ${(props) => props.theme.typography.size18};
`;
