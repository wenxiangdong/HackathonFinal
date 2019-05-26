import React from "react";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import TextField from "@material-ui/core/TextField/TextField";
import updateState from "../../../utils/state-helper";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";

import "./../Dialog.css"

interface IProp {
  title: string,
  label: string,
  onSubmit: (string) => void,
  buttonText: string
}

interface IState {
  open: boolean,
  data: string
}

/**
 * SingleTextFormDialog
 * @create 2019/5/27 1:26
 */
export default class SingleTextFormDialog extends React.Component<IProp, IState> {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      data: ""
    };
  }

  render(): React.ReactNode {
    const {title, label, onSubmit, buttonText} = this.props;
    return (
      <Dialog open={this.state.open} onClose={() => this.setState({open: false})} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="text"
            label={label}
            fullWidth
            value={this.state.data}
            onChange={(e) => updateState("data", e.target.value, this)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onSubmit(this.state.data)} color="primary">
            {buttonText}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
