import styled from "styled-components";

export const Wrapper = styled.form`
  max-width: 540px;
  max-height: ${(props) => (props.edit ? "820px" : "657px")};
  padding: 52px 42px 40px 42px;
  background-color: #ffffff;
  position: relative;
  border-radius: 10px;
  @media (max-width: 600px) {
    padding: 44px 24px 24px 24px;
    max-height: none;
  }
`;

export const Icon = styled.div`
  position: absolute;
  top: -28px;
  left: 42px;
  @media (max-width: 600px) {
    transform: scale(0.715);
  }
`;

export const ModalTitle = styled.h2`
  color: #3a4374;
  margin-bottom: 40px;
  @media (max-width: 600px) {
    ${(props) => props.theme.typography.size18};
  }
`;

export const TextareaWrapper = styled.div`
  height: 96px;
`;

export const ButtonWrapper = styled.div`
  margin-right: "auto";
  width: 100%;
`;
