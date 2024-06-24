import { useState } from "react";
import { SelectBoxContainer, StyledSelectBox } from "./styles/StyledSelectBox";
import OptionsContainer from "./OptionsContainer";

const SelectBox = (props) => {
  const [option, setOption] = useState(props.options[0].label);
  const [isShown, setIsShown] = useState(false);

  const handleSelectBoxClick = () => {
    setIsShown((prevState) => !prevState);
  };

  return (
    <SelectBoxContainer>
      <StyledSelectBox
        as="div"
        onClick={handleSelectBoxClick}
        active={props.active || (!props.sortButton && isShown && true)}
        isShown={isShown}
        kind={props.kind}
        sortButton={props.sortButton}
      >
        {props.sortButton ? "Sort by: " + option : option}
        {props.children}
      </StyledSelectBox>
      {isShown && (
        <OptionsContainer
          w={props.w}
          option={option}
          options={props.options}
          setIsShown={setIsShown}
          setOption={setOption}
          top={props.top}
          handler={props.handleOption}
        />
      )}
    </SelectBoxContainer>
  );
};

export default SelectBox;
