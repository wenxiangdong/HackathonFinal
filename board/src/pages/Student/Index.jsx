import React from "react";
import type {CourseVO, UserVO} from "../../vo/vo";
import Logger from "../../utils/logger";
import type {IStudentApi} from "../../apis/student-api";
import {apiHub} from "../../apis/ApiHub";
import StudentCourseCard from "../../components/Student/StudentCourseCard";
import Grid from "@material-ui/core/Grid/Grid";
import SimpleTitleBar from "../../components/common/SimpleTitleBar";
import SearchCourse from "../../components/student/SearchCourse";
import SimpleLoading from "../../components/common/SimpleLoading";

interface IState {
  ongoingCourse: CourseVO[];
  loadingOngoing: boolean;
  unfinishedCourse: CourseVO[];
  loadingUnfinished: boolean;
  finishedCourse: CourseVO[];
  loadingFinished: boolean;

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
    this.state = {
      loadingOngoing: true,
      loadingUnfinished: true,
      loadingFinished: true
    };
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

  joinCourse = (course) => {
  //  TODO
  };

  showCourseHistory = (course) => {
    //  TODO
  };

  handleSearchCourseSelected = (course) => {
    //  TODO
  };

  render(): React.ReactNode {
    let ongoingCourse = this.state.ongoingCourse;
    let unfinishedCourse = this.state.unfinishedCourse;
    let finishedCourse = this.state.finishedCourse;

    let myCourseFragment = (
      <div className={"my-course"}>
        <SimpleTitleBar title={"我的课程"}/>
        <Grid container className={"courses-grid"} spacing={2}>
          {ongoingCourse && unfinishedCourse
            ? (ongoingCourse.length === 0 && unfinishedCourse === 0)
              ? null // TODO 空卡片
              : (
                <>
                  {
                    ongoingCourse.map((course, idx) => (
                      <Grid key={`ongoing-course-${idx}-${course.id}`} item>
                        <StudentCourseCard course={course} ongoing={true} onClick={() => this.joinCourse(course)}/>
                      </Grid>
                    ))
                  }
                  {
                    unfinishedCourse.map((course, idx) => (
                      <Grid key={`unfinished-course-${idx}-${course.id}`} item>
                        <StudentCourseCard course={course} ongoing={false} onClick={() => this.showCourseHistory(course)}/>
                      </Grid>
                    ))
                  }
                </>
              )
            : <SimpleLoading/>
          }
        </Grid>
      </div>
    );

    let historyCourseFragment = (
      <div className={"my-course"}>
        <SimpleTitleBar title={"历史课程"}/>
        <Grid container className={"courses-grid"} spacing={2}>
          {finishedCourse && finishedCourse.length > 0
            ? finishedCourse.map((course, idx) => (
              <Grid key={`finished-course-${idx}-${course.id}`} item>
                <StudentCourseCard course={course} ongoing={false} onClick={() => this.showCourseHistory(course)}/>
              </Grid>
            ))
            : (
              this.state.loadingFinished
                ? <SimpleLoading/>
                : null // TODO 空卡片
            )
          }
        </Grid>
      </div>
    );

    return (
      <React.Fragment>
        <SearchCourse onSelectCourse={this.handleSearchCourseSelected}/>
        {myCourseFragment}
        {historyCourseFragment}
      </React.Fragment>
    );
  }
}
