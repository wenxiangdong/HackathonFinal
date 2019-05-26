import React from "react";
import type {CourseVO, UserVO} from "../../vo/vo";
import Logger from "../../utils/logger";
import type {IStudentApi} from "../../apis/student-api";
import {apiHub} from "../../apis/ApiHub";
import TitleBar from "../../components/common/TitleBar";

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

  render(): React.ReactNode {
    let ongoingCourse = this.state.ongoingCourse;
    let unfinishedCourse = this.state.unfinishedCourse;
    let finishedCourse = this.state.finishedCourse;

    let ongoingCourseFragment = (ongoingCourse || ongoingCourse.length == 0)
      ? null
      : (
        <React.Fragment>
          <TitleBar title={"进行中课程"}/>
          {ongoingCourse.map((course) => {

          })}
        </React.Fragment>
      );
    return (
      <React.Fragment>
        {ongoingCourseFragment}
        <TitleBar title={"未结课课程"}/>
        <TitleBar title={"已结课课程"}/>
      </React.Fragment>
    );
  }
}
