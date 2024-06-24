import styled from "styled-components";

export const Header = styled.h3`
  ${(props) => props.theme.typography.size18}
  color: #3A4374;
`;

export const Link = styled.span`
  color: #4661e6;
  color: ${(props) => (props.number === 0 && "#d1d8fa") || "#4661e6"};
  text-decoration: underline;
  ${(props) => props.theme.typography.size13};
  &:hover {
    cursor: pointer;
    color: ${(props) => props.number !== 0 && "#8397f8"};
  }
`;

export const Status = styled.p`
  ${(props) => props.theme.typography.size16}
  color: #647196;
`;

export const Dot = styled.div`
  border-radius: 50%;
  width: 8px;
  height: 8px;
  background-color: ${(props) => props.color};
`;

export const Quantity = styled.span`
  color: #647196;
  display: "inline-block";
  margin-left: auto;
  ${(props) => props.theme.typography.size16bold};
`;
