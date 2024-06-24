import StyledPinButton from "./styles/StyledPinButton";
import StyledButton from "./styles/StyledButton";

function Button(props) {
  return props.kind === "default" ||
    props.kind === "back" ||
    props.kind === "sort" ? (
    <StyledButton
      onClick={props.onClick}
      type={props.type}
      paint={props.paint}
      kind={props.kind}
      jc={props.jc}
      className={props.className}
    >
      {props.children}
    </StyledButton>
  ) : (
    <StyledPinButton
      direction={props.direction}
      onClick={props.onClick}
      kind={props.kind}
      upvoted={props.upvoted}
      filter={props.filter}
      selected={props.selected}
    >
      {props.children}
    </StyledPinButton>
  );
}

export default Button;
