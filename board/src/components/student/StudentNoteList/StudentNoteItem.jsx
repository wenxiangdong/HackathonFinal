import "./StudentNoteList.css";
import React from "react";
import type {StudentNoteItemVO} from "../../../vo/vo";
import Logger from "../../../utils/logger";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import ButtonBase from "@material-ui/core/ButtonBase";

interface IProp {
  noteVO: StudentNoteItemVO;
  backgroundColor: string;
  onEdit: (noteVO: StudentNoteItemVO) => void;
  onDelete: (noteVO: StudentNoteItemVO) => void;
  onClick: (noteVO: StudentNoteItemVO) => void;
}
class StudentNoteItem extends React.Component<IProp> {
  _logger = Logger.getLogger(StudentNoteItem.name);
  render(): React.ReactNode {
    const {noteVO, backgroundColor, onClick} = this.props;
    return (
      <ButtonBase style={{padding: "0", margin: "8px auto", width: "100%",  boxSizing: "border-box"}}>
        <div
          onClick={() => onClick && onClick(noteVO)}
          style={{
            backgroundColor: backgroundColor,
            padding: "16px",
            borderRadius: "5px",
            whiteSpace: "normal",
            wordBreak: "break-all",
            wordWrap: "break-word",
            color: "white",
            textAlign: "left",
            boxSizing: "border-box",
            width: "100%"
          }}>
          {noteVO.content}
          <div style={{textAlign: "right", fontSize: "14px", position: "relative", top: "14px"}}>
            {this.props.onEdit ? <IconButton size="small" onClick={(e) => {
              e.cancelBubble = true;
              e.stopPropagation();
              this.props.onEdit(noteVO)}}>
              <EditIcon color={"secondary"}/>
            </IconButton> : null}
            {this.props.onDelete ? <IconButton size="small" onClick={(e) => {
              e.cancelBubble = true;
              e.stopPropagation();
              this.props.onDelete(noteVO);
            }}>
              <DeleteIcon color={"secondary"}/>
            </IconButton> : null}
          </div>
        </div>
      </ButtonBase>
    );
  }
}

export default StudentNoteItem;
