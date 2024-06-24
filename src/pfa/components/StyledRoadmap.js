import styled from "styled-components";

export const PageTitle = styled.p`
  color: #ffffff;
  ${(props) => props.theme.typography.size24}
  @media (max-width: 600px) {
    ${(props) => props.theme.typography.size18}
  }
`;

export const Title = styled.p`
  color: #3a4374;
  ${(props) => props.theme.typography.size18}
  @media (max-width: 800px) {
    ${(props) => props.theme.typography.size14}
  }
  @media (max-width: 600px) {
    color: #abb0c7;
    ${(props) => props.theme.typography.size13bold}
    width: 100%;
  }
`;
export const Description = styled.p`
  color: #647196;
  ${(props) => props.theme.typography.size16}
  @media (max-width: 800px) {
    ${(props) => props.theme.typography.size14semi}
  }
`;

export const ButtonTitle = styled.span`
  color: #ffffff;
`;
