import styled from "styled-components";

export const TopMostContainer = styled.div`
  padding: 24px 32px 32px 34px;
  background-color: #ffffff;
  border-radius: ${(props) => props.theme["border-radius"]};
`;

export const Header = styled.h3`
  color: #3a4374;
  margin-bottom: 24px;
`;

export const CharLeft = styled.span`
  color: #647196;
  ${(props) => props.theme.typography.size15}
  @media(max-width: 600px) {
    ${(props) => props.theme.typography.size13regular}
  }
`;
