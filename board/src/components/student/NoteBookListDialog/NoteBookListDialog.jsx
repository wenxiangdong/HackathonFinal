import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import type {StudentNoteBookVO} from "../../../vo/vo";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import CopyIcon from "@material-ui/icons/FileCopyOutlined";
import SimpleLoading from "../../common/SimpleLoading";
import {apiHub} from "../../../apis/ApiHub";
import {error} from "../../../utils/snackbar-helper";
import {withSnackbar} from "notistack";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";

import "./../../common/Dialog.css"

interface IProp {
  lessonId: number,
  onClone: (book: StudentNoteBookVO) => void;
  onClose: () => void;
  enqueueSnackbar?: () => void;
}

interface IState {
  noteBookList: StudentNoteBookVO[];
  open: boolean;
}
class NoteBookListDialog extends React.Component<IProp, IState> {

  constructor(props) {
    super(props);
    this.state = {
      open: true
    }
  }

  state = {
    noteBookList: undefined
  };

  getOutline(book: StudentNoteBookVO): string {
    let items = book.items;
    return items
      .slice(0, 3)
      .reduce((pre, cur) => pre + cur.content + "\n", "");
  }

  componentDidMount(): void {
    this.initNoteBooks();
  }

  async initNoteBooks() {
    try {
      let noteBookVOS = await apiHub.studentApi.getSharedNoteBook(this.props.lessonId);
      this.setState({
        noteBookList: noteBookVOS
      });
    } catch (e) {
      error("获取笔记失败", this);
      this.props.onClose();
    }
  }

  render(): React.ReactNode {
    const {noteBookList} = this.state;

    const noteBookComponents = noteBookList && noteBookList.map((book: StudentNoteBookVO, index) => (
      <ListItem key={index}>
        <ListItemText
          primary={book.id}
          secondary={
            <>
              {book.items.slice(0, 3).map((item, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  style={{
                    whiteSpace: "normal",
                    wordBreak: "break-all",
                    wordWrap: "break-word",
                    paddingRight: "8px"
                  }}
                >{item.content}</Typography>
              ))}
            </>
          }
        />
        <ListItemSecondaryAction>
          <IconButton color={"primary"} onClick={() => this.props.onClone && this.props.onClone(book)}>
            <CopyIcon/>
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    ));

    return (
      <Dialog
        open={this.state.open}
        onClose={() => this.handleClose()}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">共享笔记</DialogTitle>
        <DialogContent>
          {
            noteBookList
              ? (
                (noteBookList.length > 0)
                  ? (
                    <>
                      <div style={{maxHeight: "500px", overflowY: "auto"}}>
                        <List style={{width: "100%"}}>
                          {noteBookComponents}
                        </List>
                      </div>
                    </>
                  )
                  : <Typography variant="subtitle1">暂时没找到分享笔记</Typography>
              )
              : <SimpleLoading/>
          }
        </DialogContent>
      </Dialog>
    );
  }
}

export default withSnackbar(NoteBookListDialog);
