import React from "react";
import type {StudentNoteItemVO} from "../../../vo/vo";
import StudentNoteItem from "./StudentNoteItem";

import MarkFillIcon from "@material-ui/icons/Bookmark";
import MarkIcon from "@material-ui/icons/BookmarkBorder";
import Logger from "../../../utils/logger";
import Typography from "@material-ui/core/Typography";

interface NoteItemVODataSet {
  data: StudentNoteItemVO[];
  // 区别这一份数据的 标签 ， 一般是用户名
  label: string;
}


interface IProp {
  dataSets: NoteItemVODataSet[];
  // 列表高度，默认为500px
  listHeight?: string;
  onUpdate?: (noteVO: StudentNoteItemVO) => void;
  onDelete?: (noteVO: StudentNoteItemVO) => void;
  onSelect?: (noteVO: StudentNoteItemVO) => void;
  footer?: React.ReactNode
}

interface IState {
  hideBooleans: boolean[];
  inputText: string;
}

const colors = [
  "#03A9F4",
  "#4CAF50",
  "#8BC34A",
  "#FFC107",
  "#FF9800",
  "#FF7043",
];

class StudentNoteList extends React.Component<IProp, IState> {

  _logger = Logger.getLogger(StudentNoteList.name);


  constructor(props: IProp) {
    super(props);
    this.state = {
      hideBooleans: Array(props.dataSets.length).fill(false),
      inputText: "",
    }
  }

  shouldComponentUpdate(nextProps: Readonly<IProp>, nextState: IState, nextContext: any): boolean {
    if (this.props.dataSets !== nextProps.dataSets) {
      // 更新隐藏设置
      this._logger.info(nextProps);
      const length = nextProps.dataSets.length;
      if (length) {
        nextState.hideBooleans = Array(length).fill(false);
      }
    }
    return true;
  }

  handleClickMark = (index) => {
    const {hideBooleans} = this.state;
    hideBooleans[index] = !hideBooleans[index];
    this.setState({
      hideBooleans
    });
  };

  render(): React.ReactNode {
    const {dataSets, listHeight = "500px", onUpdate, onDelete, onSelect, footer} = this.props;
    const {hideBooleans} = this.state;
    const noteItems = this.noteItems();

    return (
      <div className={"SNL__list-wrapper"}>
        <div className={"SNL__mark-list"}>
          {hideBooleans.map((hide, index) => (
            <div className={"SNL__mark-item"}
                 key={index}
                 style={{color: colors[index % colors.length]}}
                 onClick={() => this.handleClickMark(index)}>
              {hide ? <MarkIcon/> : <MarkFillIcon/>}
              <Typography variant="body1" gutterBottom>
                {dataSets[index].label}
              </Typography>
            </div>
          ))}
        </div>
        <div className={"SNL__list"} style={{height: listHeight}}>
          {noteItems.map((note, index) => (
            <StudentNoteItem
              onUpdate={onUpdate}
              onDelete={onDelete}
              onClick={onSelect}
              noteVO={note}
              backgroundColor={note.color}
              key={index}/>
            )
          )}
        </div>
        {footer}
      </div>
    );
  }


  noteItems = (): StudentNoteItemVO[] => {
    const {dataSets} = this.props;
    const {hideBooleans} = this.state;
    const list = dataSets.reduce((pre, cur, index) => {
      const color = colors[index % colors.length];
      const hide = hideBooleans[index];
      cur.data.forEach(note => note.color = color);
      return hide ? pre : pre.concat(cur.data);
    }, []);
    this._logger.info(list);
    return this.sortNotes(list);
  };

  sortNotes(list: StudentNoteItemVO[]) {
    list.sort((a, b) =>
      a.teacherNoteItemId - b.teacherNoteItemId
    );
    this._logger.info(list);
    return list;
  }
}

export default StudentNoteList;
