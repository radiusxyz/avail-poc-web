import styled from "styled-components";

export const AuthorImage = styled.div`
  align-items: start;
`;

export const FullName = styled.span`
  color: #3a4374;
  ${(props) => props.theme.typography.size14}
  @media(max-width: 600px) {
    ${(props) => props.theme.typography.size13bold}
  }
`;

export const Id = styled.span`
  color: #647196;
  ${(props) => props.theme.typography.size14semi}
  @media(max-width: 600px) {
    ${(props) => props.theme.typography.size13regular}
  }
`;

export const ReplyBtn = styled.button`
  background-color: transparent;
  border: none;
  color: #4661e6;
  ${(props) => props.theme.typography.size13}
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const CommentContent = styled.p`
  color: #647196;
  white-space: pre-line;
  ${(props) => props.theme.typography.size15semi};
  @media (max-width: 600px) {
    ${(props) => props.theme.typography.size13regular}
  }
`;
