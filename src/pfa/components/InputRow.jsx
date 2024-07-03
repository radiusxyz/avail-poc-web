import React from "react";
import styled from "styled-components";

const CustomInputRow = styled.div`
  position: relative;
`;

const InputTitle = styled.h4`
  color: #3a4374;
  margin-bottom: 2px;
  ${(props) => props.theme.typography.size14}
  @media (max-width: 600px) {
    ${(props) => props.theme.typography.size13bold};
  }
`;
const Description = styled.p`
  color: #647196;
  margin-bottom: 16px;
  display: flex;
  white-space: pre;
  justify-content: flex-end;
  ${(props) => props.theme.typography.size14semi}
  @media (max-width: 600px) {
    ${(props) => props.theme.typography.size13regular};
  }
`;

const TitleBalanceWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

function formatBalance(balance) {
  const totalChars = 8; // Total number of characters desired, including the decimal point

  // Calculate the number of characters needed for the integer part
  const integerPartLength = Math.floor(balance).toString().length;

  // Calculate the number of decimal places to fit the totalChars requirement
  const decimalPlaces = totalChars - integerPartLength - 1; // Subtract 1 for the decimal point

  // Ensure decimalPlaces is not negative
  const safeDecimalPlaces = Math.max(decimalPlaces, 0);

  // Format the number with the determined number of decimal places
  let formatted = balance.toFixed(safeDecimalPlaces);

  // Pad the result with spaces if it's shorter than the total number of characters
  if (formatted.length < totalChars) {
    const padding = totalChars - formatted.length;
    formatted = " ".repeat(padding) + formatted;
  }

  return formatted;
}

const InputRow = (props) => (
  <CustomInputRow>
    <TitleBalanceWrapper>
      <InputTitle>{props.title}</InputTitle>
      {props.balance >= 0 && <Description>Balance: {formatBalance(props.balance)}</Description>}
    </TitleBalanceWrapper>
    {props.children}
  </CustomInputRow>
);

export default InputRow;
