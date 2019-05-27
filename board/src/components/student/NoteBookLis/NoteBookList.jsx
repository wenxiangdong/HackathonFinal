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


interface IProp {
  lessonId: number,
  onClone: (book: StudentNoteBookVO) => void;
  enqueueSnackbar?: () => void;
}

interface IState {
  noteBookList: StudentNoteBookVO[]
}
class NoteBookList extends React.Component<IProp, IState> {

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
    }
  }

  render(): React.ReactNode {

    const {noteBookList} = this.state;

    const noteBookComponents = noteBookList && noteBookList.map((book: StudentNoteBookVO, index) => (
      <ListItem key={index} button>
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
      noteBookList ?
        <>
          <Typography variant="h5">同窗笔记</Typography>
          <div style={{maxHeight: "500px", overflowY: "auto"}}>
            <List style={{width: "100%"}}>
              {noteBookComponents}
            </List>
          </div>
        </>
        : <SimpleLoading/>
    );
  }
}

export default withSnackbar(NoteBookList);
