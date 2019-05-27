import React from "react";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import LessonList from "../../common/LessonList/LessonList";
import type {LessonVO} from "../../../vo/vo";
import SimpleLoading from "../../common/SimpleLoading";
import Logger from "../../../utils/logger";
import type {ICommonApi} from "../../../apis/common-api";
import {apiHub} from "../../../apis/ApiHub";

import {withSnackbar} from "notistack";
import {withRouter} from "react-router-dom";
import type {HttpResponse} from "../../../apis/http";
import {error} from "../../../utils/snackbar-helper";
import {STUDENT_LESSON_ONGOING,STUDENT_LESSON_REVIEW} from "../../../utils/router-helper";
import localStorageHelper from "../../../utils/local-storage-helper";

interface IProp {
  onClose: () => void,
  title: string,
  courseId: number,
  content: string|null,
}

interface IState {
  open: boolean,
  lessons: LessonVO[]
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
    this._commonApi.getLessons(this.props.courseId)
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
    localStorageHelper.setLesson(lesson);
    if (lesson.endTime) {
      this.props.history.push(STUDENT_LESSON_REVIEW);
    } else {
      this.props.history.push(STUDENT_LESSON_ONGOING);
    }
  };

  render(): React.ReactNode {
    const {title, content} = this.props;
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
      </Dialog>
    );
  }
}

export default withRouter(withSnackbar(CourseDialog));
