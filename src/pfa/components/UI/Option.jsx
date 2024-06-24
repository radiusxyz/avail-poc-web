import { StyledOption } from "./styles/StyledOption";
import Tick from "./Tick";

const Option = (props) => {
  const { setIsShown, setOption, handler } = props;

  // Can this logic be implemented if we declare the function outside of the component's scope?
  const handleOptionClick = (event) => {
    event.preventDefault();
    setOption(event.target.textContent);
    setIsShown(false);
    handler(event.target.textContent);
  };

  return (
    <StyledOption onClick={handleOptionClick}>
      {props.children.label}
      {props.option === props.children.label && <Tick />}
    </StyledOption>
  );
};
export default Option;
