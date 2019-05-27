import React from "react";
import type {CourseVO, LessonVO, UserVO} from "../../vo/vo";
import Logger from "../../utils/logger";
import type {IStudentApi} from "../../apis/student-api";
import {apiHub} from "../../apis/ApiHub";
import StudentCourseCard from "../../components/student/StudentCourseCard/StudentCourseCard";
import Grid from "@material-ui/core/Grid/Grid";
import SimpleTitleBar from "../../components/common/SimpleTitleBar/SimpleTitleBar";
import SimpleLoading from "../../components/common/SimpleLoading";

import SearchIcon from "@material-ui/icons/Search"
import Container from "@material-ui/core/Container/Container";
import Button from "@material-ui/core/Button/Button";
import SimpleLine from "../../components/common/SimpleLine";
import CourseDialog from "../../components/student/CourseDialog/CourseDialog";
import EmptyCourseCard from "../../components/common/EmptyCourseCard";

import "./index.css"
import type {HttpResponse} from "../../apis/http";
import {error} from "../../utils/snackbar-helper";
import {withSnackbar} from "notistack";
import withToolBar from "../hocs/withToolBar";
import {STUDENT_LESSON_ONGOING} from "../../utils/router-helper";
import type {ICommonApi} from "../../apis/common-api";
import FullScreenLoading from "../../components/common/FullScreenLoading/FullScreenLoading";
import localStorageHelper from "../../utils/local-storage-helper";

interface IState {
  ongoingCourse: CourseVO[];
  unfinishedCourse: CourseVO[];
  finishedCourse: CourseVO[];
  checkCourse: CourseVO;
  loading: boolean;
}

interface IProp {
  enqueueSnackbar?: () => void;
}

/**
 * Student Homepage
 * @create 2019/5/26 14:21
 */
class Index extends React.Component<IProp, IState> {

  _logger: Logger;
  _studentApi: IStudentApi;
  _commonApi: ICommonApi;

  constructor(props) {
    super(props);
    this._logger = Logger.getLogger("StudentHomepage");
    this._studentApi = apiHub.studentApi;
    this._commonApi = apiHub.commonApi;
    this.state = {
      loading: false
    };
  }

  getUser():UserVO {
    try {
      return localStorageHelper.getUser();
    } catch (e) {
      this._logger.error(e);
    }
  }

  componentDidMount(): void {
    this._studentApi.studentGetOngoingCourses()
      .then((courses) => this.setState({ongoingCourse: courses}))
      .catch(e => this.handleError(e))
    ;
    this._studentApi.studentGetUnfinishedCourses()
      .then((courses) => this.setState({unfinishedCourse: courses}))
      .catch(e => this.handleError(e))
    ;
    this._studentApi.studentGetFinishedCourses()
      .then((courses) => this.setState({finishedCourse: courses}))
      .catch(e => this.handleError(e))
    ;
  }

  joinCourse = (course: CourseVO) => {
    this.setState({loading: true});
    this._commonApi.getLessons(course.id)
      .then((lessons:LessonVO[]) => {
        for (let lesson of lessons) {
          if (lesson.endTime === 0) {
            this.setState({loading: false});
            localStorageHelper.setLesson(lesson);
            this.props.history.push(STUDENT_LESSON_ONGOING);
            return;
          }
        }
        error("该课程已结束，请刷新重试", this);
        this.setState({loading: false});
      })
      .catch(e => this.handleError(e));
  };

  showCourseHistory = (course) => {
    this.setState({checkCourse: course});
  };

  handleError = (e: HttpResponse) => {
    this._logger.error(e);
    error(e.message, this);
    this.setState({loading: false});
  };

  render(): React.ReactNode {
    let ongoingCourse = this.state.ongoingCourse;
    let unfinishedCourse = this.state.unfinishedCourse;
    let finishedCourse = this.state.finishedCourse;

    let myCourseFragment = (
      <Container className={"courses-wrapper"}>
        <div className={"my-courses"}>
          <SimpleTitleBar title={"我的课程"}/>
          <span className={"spacer"}/>
          <div className={"search-button-box"}>
            <Button fullWidth variant="contained" color="primary" onClick={() => {
              this.props.history.push(`/Student/Search/`);
            }}>
              搜索并创建新课程
              <SearchIcon/>
            </Button>
          </div>
        </div>
        <div>
          {ongoingCourse && unfinishedCourse
            ? (ongoingCourse.length === 0 && unfinishedCourse.length === 0)
              ? <EmptyCourseCard/>
              : (
                <>
                  {
                    <div className={'courses-flex-box'}>
                      {
                        ongoingCourse.map((course, idx) => (
                          <StudentCourseCard key={`ongoing-course-${idx}-${course.id}`} course={course} ongoing={true}
                                             onClick={() => this.joinCourse(course)}/>
                        ))
                      }
                    </div>
                  }
                  {
                    <div className={'courses-flex-box'}>
                      {
                        unfinishedCourse.filter((course) => ongoingCourse.map((c) => c.id).indexOf(course.id) < 0).map((course, idx) => (
                          <StudentCourseCard course={course} ongoing={false}
                                             key={`unfinished-course-${idx}-${course.id}`}
                                             onClick={() => this.showCourseHistory(course)}/>
                        ))
                      }
                    </div>

                  }
                </>
              )
            : <SimpleLoading/>
          }
        </div>
      </Container>
    );

    let historyCourseFragment = (
      <Container className={"courses-wrapper"}>
        <SimpleTitleBar title={"历史课程"}/>
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
    let checkCourseDialog = (
      checkCourse
        ? (
          <CourseDialog onClose={() => this.setState({checkCourse: null})}
                        title={checkCourse ? `课程名称：${checkCourse.name}` : '课程'}
                        courseId={checkCourse.id}
                        content={checkCourse ? `主讲：${checkCourse.username}` : null}
          />
        )
        : null
    );

    return (
      <Container style={{paddingTop: "50px"}}>
        {this.state.loading? <FullScreenLoading/>: null}
        {myCourseFragment}
        <SimpleLine marginX={"20px"} marginY={"20px"} height={'1px'}/>
        {historyCourseFragment}
        {checkCourseDialog}
      </Container>
    );
  }
}

export default withSnackbar(withToolBar(Index));
