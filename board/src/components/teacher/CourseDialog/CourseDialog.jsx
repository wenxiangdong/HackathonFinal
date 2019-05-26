import React from "react";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import LessonList from "../../common/LessonList/LessonList";
import type {LessonVO} from "../../../vo/vo";
import {PropTypes} from "@material-ui/core";
import SimpleLoading from "../../common/SimpleLoading";
import Logger from "../../../utils/logger";
import type {ICommonApi} from "../../../apis/common-api";
import {apiHub} from "../../../apis/ApiHub";

import {withSnackbar} from "notistack";
import {withRouter} from "react-router-dom";
import type {HttpResponse} from "../../../apis/http";
import {error} from "../../../utils/snackbar-helper";
import {UserType} from "../../../vo/vo";

interface IProp {
  onClose: () => void,
  title: string,
  courseId: number,
  finished: boolean,
  userType: UserType,
  content: string | null,
}

interface IState {
  open: boolean,
  lessons: LessonVO[]
}

export interface DialogActionConfig {
  onClick: () => void;
  title: string,
  color: PropTypes.Color,
  autoFocus: boolean
}

/**
 * 课程弹窗
 * CourseDialog
 * @create 2019/5/26 22:11
 * TODO 样式美化 不重要
 */
class CourseDialog extends React.Component<IProp, IState> {

  _logger: Logger;
  _commonApi: ICommonApi;

  constructor(props) {
    super(props);
    this._logger = Logger.getLogger("CourseDialog");
    this._commonApi = apiHub.commonApi;
    this.state = {
      open: true
    };
  }

  componentDidMount(): void {
    this.queryLessons();
  }

  queryLessons = () => {
    this._commonApi.getLessonsByCourseId(this.props.courseId)
      .then((lessons) => {
        this.setState({lessons});
      })
      .catch((e:HttpResponse) => {
        this._logger.error(e);
        error(e.message, this);
        this.props.onClose();
      })
  };

  handleClose = () => {
    this.setState({open: false});
    this.props.onClose();
  };

  handleSelectLesson = (lesson:LessonVO) => {
    if (this.props.userType === UserType.STUDENT) {
      if (lesson.endTime) {
        this.props.history.push(`/Student/LessonReview/${lesson.id}`);
      } else {
        this.props.history.push(`/Student/LessonOnGoing/${lesson.id}`);
      }
    } else {
      this.props.history.push(`/Teacher/Lesson/${lesson.id}`);
    }
  };

  render(): React.ReactNode {
    const {title, content, actionConfigs} = this.props;
    const {lessons} = this.state;

    let dialogContentText = (
      content
        ? (
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        )
        : null
    );

    let lessonList = (
      lessons
        ? <LessonList lessons={lessons} onSelectLesson={(lesson) => this.handleSelectLesson(lesson)}/>
        : <SimpleLoading/>
    );

    let dialogActions = (
      actionConfigs
        ? (
          <DialogActions>
            {
              actionConfigs.map((config:DialogActionConfig) => (
                <Button key={config.title} onClick={config.onClick} color={config.color} autoFocus={config.autoFocus}>
                  {config.title}
                </Button>
              ))
            }
          </DialogActions>
        )
        : null
    );

    return (
      <Dialog
        open={this.state.open}
        onClose={() => this.handleClose()}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          {dialogContentText}
          {lessonList}
        </DialogContent>
        {dialogActions}
      </Dialog>
    );
  }
}

export default withRouter(withSnackbar(CourseDialog));
