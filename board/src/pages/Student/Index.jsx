import React from "react";
import type {CourseVO, UserVO} from "../../vo/vo";
import Logger from "../../utils/logger";
import type {IStudentApi} from "../../apis/student-api";
import {apiHub} from "../../apis/ApiHub";
import StudentCourseCard from "../../components/student/StudentCourseCard";
import Grid from "@material-ui/core/Grid/Grid";
import SimpleTitleBar from "../../components/common/SimpleTitleBar";

interface IState {
  ongoingCourse: CourseVO[];
  unfinishedCourse: CourseVO[];
  finishedCourse: CourseVO[];
  studentVO: UserVO;
}

/**
 * Student Homepage
 * @create 2019/5/26 14:21
 */
export default class Index extends React.Component<any, IState> {

  _logger: Logger;
  _studentApi: IStudentApi;

  constructor(props) {
    super(props);
    this._logger = Logger.getLogger("StudentHomepage");
    this._studentApi = apiHub.studentApi;
    this.state = {};
  }

  componentDidMount(): void {
    this._studentApi.studentGetOnGoingCourses()
      .then((courses) => this.setState({ongoingCourse: courses}))
      .catch()
    ;
    this._studentApi.studentGetUnfinishedCourses()
      .then((courses) => this.setState({unfinishedCourse: courses}))
      .catch()
    ;
    this._studentApi.studentGetFinishedCourses()
      .then((courses) => this.setState({finishedCourse: courses}))
      .catch()
    ;
  }

  getStudentId = () => {
    return this.props.match.params.id;
  };

  handleOngoingCourseClicked = (course) => {

  };

  render(): React.ReactNode {
    let ongoingCourse = this.state.ongoingCourse;
    // let unfinishedCourse = this.state.unfinishedCourse;
    // let finishedCourse = this.state.finishedCourse;

    let myCourseFragment = (
      <div className={"my-course"}>
        <SimpleTitleBar title={"我的课程"}/>
        <Grid container className={"courses-grid"} spacing={2}>
          {ongoingCourse && ongoingCourse.length > 0
            ? ongoingCourse.map((course, idx) => (
              <Grid key={`ongoing-course-${idx}-${course.id}`} item>
                <StudentCourseCard course={course} ongoing={true} onClick={() => this.handleOngoingCourseClicked(course)}/>
              </Grid>
            ))
            : null
          }
        </Grid>
      </div>
    );

    return (
      <React.Fragment>
        {myCourseFragment}
      </React.Fragment>
    );
  }
}
