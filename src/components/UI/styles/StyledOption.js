import styled from "styled-components";

export const StyledOption = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  padding: 12px 24px;
  ${(props) => props.theme.typography.size16};
  color: #647196;
  &:hover {
    color: #ad1fea;
  }
  &:first-child {
    border-radius: 10px 10px 0px 0px;
  }
  &:last-child {
    border-radius: 0px 0px 10px 10px;
  }
  @media (max-width: 600px) {
    ${(props) => props.theme.typography.size13regular};
  }
`;
