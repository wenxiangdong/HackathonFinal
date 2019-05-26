import React from "react";
import Logger from "../../utils/logger";
import type {ITeacherApi} from "../../apis/teacher-api";
import {apiHub} from "../../apis/ApiHub";
import type {CourseVO} from "../../vo/vo";
import Container from "@material-ui/core/Container/Container";
import SimpleTitleBar from "../../components/common/SimpleTitleBar";
import Grid from "@material-ui/core/Grid/Grid";
import StudentCourseCard from "../../components/student/StudentCourseCard/StudentCourseCard";
import SimpleLoading from "../../components/common/SimpleLoading";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";


interface IState {
  unfinishedCourse: CourseVO[];
  finishedCourse: CourseVO[];
  checkCourse: CourseVO;
}

/**
 * Teacher Homepage
 * @create 2019/5/26 14:22
 */
export default class Index extends React.Component<any, IState> {

  _logger: Logger;
  _teacherApi: ITeacherApi;

  constructor(props) {
    super(props);
    this._logger = Logger.getLogger("TeacherHomepage");
    this._teacherApi = apiHub.teacherApi;
    this.state = {};
  }

  componentDidMount(): void {
    this._teacherApi.teacherGetRunningCourses()
      .then((courses) => this.setState({unfinishedCourse: courses}))
      .catch()
    ;
    this._teacherApi.teacherGetFinishedCourses()
      .then((courses) => this.setState({finishedCourse: courses}))
      .catch()
    ;
  }

  showCourseHistory = (course) => {
    this.setState({checkCourse:course});
  };

  render(): React.ReactNode {
    let unfinishedCourse = this.state.unfinishedCourse;
    let finishedCourse = this.state.finishedCourse;

    let unfinishedCourseFragment = (
      <Container className={"courses-wrapper"}>
        <SimpleTitleBar title={"进行中课程"}/>
        <Grid container className={"courses-grid"} spacing={2}>
          {unfinishedCourse
            ? unfinishedCourse.length > 0
              ? unfinishedCourse.map((course, idx) => (
                <Grid key={`unfinished-course-${idx}-${course.id}`} item>
                  <StudentCourseCard course={course} ongoing={false} onClick={() => this.showCourseHistory(course)}/>
                </Grid>
              ))
              : null // TODO 空卡片
            : <SimpleLoading/>
          }
        </Grid>
      </Container>
    );

    let finishedCourseFragment = (
      <Container className={"courses-wrapper"}>
        <SimpleTitleBar title={"已结束课程"}/>
        <Grid container className={"courses-grid"} spacing={2}>
          {finishedCourse
            ? finishedCourse.length > 0
              ? finishedCourse.map((course, idx) => (
                <Grid key={`finished-course-${idx}-${course.id}`} item>
                  <StudentCourseCard course={course} ongoing={false} onClick={() => this.showCourseHistory(course)}/>
                </Grid>
              ))
              : null // TODO 空卡片
            : <SimpleLoading/>
          }
        </Grid>
      </Container>
    );

    let checkCourse = this.state.checkCourse;

    let resetCheckCourse = () => this.setState({checkCourse:null});
    let startLesson = () => {
      resetCheckCourse();
      this.props.history.push(`/Teacher/Lesson/${checkCourse.id}`);
    };

    let dialogActions = checkCourse && !checkCourse.finished
      ? (
        <DialogActions>
          <Button onClick={startLesson} color="primary">
            上课
          </Button>
        </DialogActions>
      )
      : null
    ;

    let checkCourseDialog = (
      checkCourse
        ? (
          <Dialog
            open={!!checkCourse}
            onClose={resetCheckCourse}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{checkCourse.name}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">

              </DialogContentText>
            </DialogContent>
            {dialogActions}
          </Dialog>
        )
        : null
    );

    return (
      <Container>
        {unfinishedCourseFragment}
        {finishedCourseFragment}
        {checkCourseDialog}
      </Container>
    );
  }
}
