import React from "react";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import LessonList from "../../common/LessonList/LessonList";
import type {LessonVO} from "../../../vo/vo";
import SimpleLoading from "../../common/SimpleLoading";
import Logger from "../../../utils/logger";
import type {ICommonApi} from "../../../apis/common-api";
import {apiHub} from "../../../apis/ApiHub";

import {withSnackbar} from "notistack";
import {withRouter} from "react-router-dom";
import type {HttpResponse} from "../../../apis/http";
import {error, success} from "../../../utils/snackbar-helper";
import TextField from "@material-ui/core/TextField/TextField";
import updateState from "../../../utils/state-helper";
import FullScreenLoading from "../../common/FullScreenLoading/FullScreenLoading";
import type {ITeacherApi} from "../../../apis/teacher-api";

interface IProp {
  onClose: () => void,
  title: string,
  courseId: number,
  finished: boolean,
  onEndCourse: () => void
}

interface IState {
  open: boolean,
  lessons: LessonVO[],
  startLesson: boolean,
  lessonName: string,
  loading: boolean
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
  _teacherApi: ITeacherApi;

  constructor(props) {
    super(props);
    this._logger = Logger.getLogger("CourseDialog");
    this._commonApi = apiHub.commonApi;
    this._teacherApi = apiHub.teacherApi;
    this.state = {
      open: true,
      startLesson: false,
      lessonName: "",
      loading: false
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
    this.props.history.push(`/Teacher/Lesson/${lesson.id}`);
  };

  handleStartLesson = () => {
    this.setState({startLesson: true})
  };

  getTeacherId = () => {
    return this.props.match.params.id;
  };

  startLesson = () => {
    this.setState({loading: true});
    let lesson:LessonVO = {
      id: -1,
      name: this.state.lessonName,
      courseId: this.props.courseId,
      teacherId: this.getTeacherId(),
      startTime: Date.now(),
      endTime: 0
    };
    this._teacherApi.createLesson(lesson)
      .then(() => {
        this.props.history.push(`/Teacher/Lesson/${lesson.id}`);
        success(`课程 ${lesson.name} 已成功开启`, this);
      })
      .catch((e) => {
        this._logger.error(e);
        this.setState({loading: false});
        error(e.message, this);
      })
  };

  render(): React.ReactNode {
    const {title} = this.props;
    const {lessons} = this.state;

    let lessonList = (
      lessons
        ? <LessonList lessons={lessons} onSelectLesson={(lesson) => this.handleSelectLesson(lesson)}/>
        : <SimpleLoading/>
    );

    let dialogActions = (
      this.props.finished
        ? null
        : (
          <DialogActions>
            <Button onClick={this.props.onEndCourse} color="primary">
              结束课程
            </Button>
            <Button onClick={this.handleStartLesson} color="primary">
              开始上课
            </Button>
          </DialogActions>
        )
    );

    let lessonNameDialog = (
      <Dialog open={this.state.startLesson} onClose={() => this.setState({startLesson: false})} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">课程名称</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="lessonName"
            label="课程名称"
            fullWidth
            value={this.state.lessonName}
            onChange={(e) => updateState("lessonName", e.target.value, this)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.startLesson()} color="primary">
            开始上课
          </Button>
        </DialogActions>
      </Dialog>
    );

    return (
      <>
        {this.state.loading? <FullScreenLoading/>: null}
        {lessonNameDialog}
        <Dialog
          open={this.state.open}
          onClose={() => this.handleClose()}
          aria-labelledby="alert-dialog-title"
        >
          <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
          <DialogContent>
            {lessonList}
          </DialogContent>
          {dialogActions}
        </Dialog>
      </>
    );
  }
}

export default withRouter(withSnackbar(CourseDialog));
