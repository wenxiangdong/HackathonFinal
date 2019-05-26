import React from "react";
import Logger from "../../utils/logger";
import type {ITeacherApi} from "../../apis/teacher-api";
import {apiHub} from "../../apis/ApiHub";
import type {CourseVO, LessonVO} from "../../vo/vo";
import Container from "@material-ui/core/Container/Container";
import SimpleTitleBar from "../../components/common/SimpleTitleBar";
import Grid from "@material-ui/core/Grid/Grid";
import StudentCourseCard from "../../components/student/StudentCourseCard/StudentCourseCard";
import SimpleLoading from "../../components/common/SimpleLoading";

import "./../Student/index.css"
import EmptyCourseCard from "../../components/common/EmptyCourseCard";
import CourseDialog from "../../components/teacher/CourseDialog/CourseDialog";
import {UserType} from "../../vo/vo";
import type {DialogActionConfig} from "../../components/student/CourseDialog/CourseDialog";
import type {HttpResponse} from "../../apis/http";
import {error} from "../../utils/snackbar-helper";
import FullScreenLoading from "../../components/common/FullScreenLoading/FullScreenLoading";

interface IState {
  unfinishedCourse: CourseVO[];
  finishedCourse: CourseVO[];
  checkCourse: CourseVO;
  loading: boolean
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
    this.state = {
      loading: false
    };
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

  startLesson = () => {
    const course = this.state.checkCourse;
    if (course) {
      let lesson:LessonVO = {
        id: -1,
        name: '',//TODO
        courseId: course.id,
        teacherId: this.getTeacherId(),
        startTime: Date.now(),
        endTime: 0
      };
      this._teacherApi.createLesson(lesson)
        .then(() => {

        })
        .catch((e:HttpResponse) => {
          this._logger.error(e);
          this.setState({loading: false});
          error(e.message, this);
        })
    } else {
      this._logger.error("startLesson", this.state);
    }
  };

  getTeacherId = () => {
    return this.props.match.params.id;
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
    let actionConfigs: DialogActionConfig[] = [
      {
        onClick: () => this.startLesson(),
        title: "开始上课",
        color: "primary",
        autoFocus: true
      }
    ];
    let checkCourseDialog = (
      checkCourse
        ? (
          <CourseDialog onClose={() => this.setState({checkCourse: null})}
                        title={checkCourse? `课程名称：${checkCourse.name}`: '课程'}
                        courseId={checkCourse.id}
                        actionConfigs={actionConfigs}
                        userType={UserType.TEACHER}
          />
        )
        : null
    );

    return (
      <Container style={{paddingTop: "20px"}}>
        {this.state.loading? <FullScreenLoading/>: null}
        {unfinishedCourseFragment}
        {finishedCourseFragment}
        {checkCourseDialog}
      </Container>
    );
  }
}
