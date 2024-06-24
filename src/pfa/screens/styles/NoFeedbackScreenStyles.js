import styled from "styled-components";

export const Title = styled.h1`
  color: #3a4374;
  ${(props) => props.theme.typography.size24}
  margin-top: 53.26px;
  @media (max-width: 600px) {
    ${(props) => props.theme.typography.size18}
  }
`;
export const Details = styled.div`
  color: #647196;
  ${(props) => props.theme.typography.size16};
  margin-top: 16px;
  margin-bottom: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media (max-width: 600px) {
    ${(props) => props.theme.typography.size13regular}
  }
`;
