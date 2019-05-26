import React from "react";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";
import Logger from "../../../utils/logger";

interface IProp {
  onSend: (text: string) => void;
}

class NoteInput extends React.Component<IProp> {
  state = {
    inputText: ""
  };

  _logger = Logger.getLogger(NoteInput.name);

  handleClickSend = (e) => {
    typeof this.props.onSend === "function" && this.props.onSend(this.state.inputText);
  };

  handleKeyUp = (e) => {
    e.persist();
    this._logger.info(e);
    if (e.which === 13 && typeof this.props.onSend === "function") {
      this.props.onSend(this.state.inputText);
      this.setState({
        inputText: ""
      });
    }
  };

  render(): React.ReactNode {
    const {inputText} = this.state;
    return (
      <Input
        fullWidth
        value={inputText}
        onChange={(e) => this.setState({inputText: e.target.value})}
        onKeyUp={this.handleKeyUp}
        style={{
          boxSizing: "border-box",
          padding: "8px"
        }} endAdornment={
        <InputAdornment position={"end"}>
          <IconButton color={"primary"} onClick={this.handleClickSend}>
            <SendIcon/>
          </IconButton>
        </InputAdornment>}/>
    );
  }
}

export default NoteInput;
