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

import "./../Student/index.css"
import EmptyCourseCard from "../../components/common/EmptyCourseCard";
import CourseDialog from "../../components/common/CourseDialog/CourseDialog";
import {UserType} from "../../vo/vo";
import type {DialogActionConfig} from "../../components/common/CourseDialog/CourseDialog";

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
              : <EmptyCourseCard/>
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
              : <EmptyCourseCard/>
            : <SimpleLoading/>
          }
        </Grid>
      </Container>
    );

    let checkCourse = this.state.checkCourse;
    // let actionConfigs: DialogActionConfig[] = [
    //   {
    //     onClick: () => {
    //
    //     }
    //   }
    // ];
    let checkCourseDialog = (
      checkCourse
        ? (
          <CourseDialog onClose={() => this.setState({checkCourse: null})}
                        title={checkCourse? `课程名称：${checkCourse.name}`: '课程'}
                        courseId={checkCourse.id}
                        userType={UserType.TEACHER}
          />
        )
        : null
    );

    return (
      <Container style={{paddingTop: "20px"}}>
        {unfinishedCourseFragment}
        {finishedCourseFragment}
        {checkCourseDialog}
      </Container>
    );
  }
}
