import cuid from "cuid";
import Divider from "./Divider";
import Option from "./Option";
import { StyledContainer } from "./styles/StyledOptionsContainer";

const OptionsContainer = (props) => (
  <StyledContainer top={props.top} w={props.w}>
    {props.options.map((option, index) => (
      <div key={cuid()}>
        <Option
          option={props.option}
          setIsShown={props.setIsShown}
          setOption={props.setOption}
          handler={props.handler}
        >
          {option}
        </Option>
        {index !== props.options.length - 1 && <Divider />}
      </div>
    ))}
  </StyledContainer>
);
export default OptionsContainer;
