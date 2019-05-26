import "./LessonList.css";
import React from "react";
import ListItem from "@material-ui/core/ListItem";
import CodeIcon from "@material-ui/icons/Code";
import FolderIcon from "@material-ui/icons/Folder";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import type {LessonVO} from "../../../vo/vo";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";


function LessonItem(props: { lesson: LessonVO, onSelect: (lesson: LessonVO) => void }) {
  const {lesson, onSelect} = props;
  return (
    <ListItem button onClick={() => onSelect(lesson)}>
      <ListItemIcon>
        <CodeIcon/>
      </ListItemIcon>
      <ListItemText primary={lesson.name} secondary={new Date(lesson.startTime).toLocaleTimeString()}/>
    </ListItem>
  );
}

interface IProp {
  title?: String;
  lessons: LessonVO[];
  onSelectLesson?: (lesson: LessonVO) => void;
}

/**
 * 课列表
 * TODO 正在上课的课程显示
 */
class LessonList extends React.Component<IProp> {
  render(): React.ReactNode {
    const {lessons, onSelectLesson = () => null, title} = this.props;
    const lessonComponents = lessons.map((lesson: LessonVO) =>
      (<LessonItem key={lesson.id} lesson={lesson} onSelect={onSelectLesson}/>)
    );
    return (
      <>
        {
          title
            ? (
              <div className={"LL__title"}>
                <FolderIcon/>
                <Typography variant="h6">
                  {title}
                </Typography>
              </div>
            )
            : null
        }
        <List>
          {lessonComponents}
        </List>
      </>
    );
  }
}

export default LessonList;
