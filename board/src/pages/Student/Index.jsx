import React from "react";
import type {CourseVO} from "../../vo/vo";
import Logger from "../../utils/logger";
import type {IStudentApi} from "../../apis/student-api";
import {apiHub} from "../../apis/ApiHub";
import StudentCourseCard from "../../components/student/StudentCourseCard";
import Grid from "@material-ui/core/Grid/Grid";
import SimpleTitleBar from "../../components/common/SimpleTitleBar";
import SimpleLoading from "../../components/common/SimpleLoading";

import SearchIcon from "@material-ui/icons/Search"

import "./index.css"
import Container from "@material-ui/core/Container/Container";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import SearchCourse from "../../components/student/SearchCourse/SearchCourse";
import SimpleLine from "../../components/common/SimpleLine";
import Icon from "@material-ui/core/Icon/Icon";

interface IState {
  ongoingCourse: CourseVO[];
  unfinishedCourse: CourseVO[];
  finishedCourse: CourseVO[];
  checkCourse: CourseVO;
  checkSearchCourse: CourseVO;
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

  joinCourse = (course: CourseVO) => {
    this.props.history.push(`/Student/LessonOnGoing/${course.id}`);
  };

  showCourseHistory = (course) => {
    this.setState({checkCourse: course});
  };

  handleSearchCourseSelected = (course) => {
    this.setState({checkSearchCourse: course});
  };

  render(): React.ReactNode {
    let ongoingCourse = this.state.ongoingCourse;
    let unfinishedCourse = this.state.unfinishedCourse;
    let finishedCourse = this.state.finishedCourse;

    let searchContainer = (
      <Container className={"search-container"}>
        <SearchCourse onSelectCourse={this.handleSearchCourseSelected}/>
      </Container>
    );

    let myCourseFragment = (
      <Container className={"courses-wrapper"}>
        <div className={"my-courses"}>
          <SimpleTitleBar title={"我的课程"}/>
          <span className={"spacer"}/>
          <Button variant="contained" color="primary">
            搜索并创建新课程
            <SearchIcon/>
          </Button>
        </div>
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
                        <StudentCourseCard course={course} ongoing={false}
                                           onClick={() => this.showCourseHistory(course)}/>
                      </Grid>
                    ))
                  }
                </>
              )
            : <SimpleLoading/>
          }
        </Grid>
      </Container>
    );

    let historyCourseFragment = (
      <Container className={"courses-wrapper"}>
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
      </Container>
    );

    let checkSearchCourse = this.state.checkSearchCourse;

    let resetCheckSearchCourse = () => {
      this.setState({
        checkSearchCourse: null
      })
    };

    let checkSearchCourseDialog = (
      <Dialog
        open={checkSearchCourse}
        onClose={resetCheckSearchCourse}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            TODO
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetCheckSearchCourse} color="primary">
            取消
          </Button>
          <Button onClick={resetCheckSearchCourse} color="primary" autoFocus>
            加入
          </Button>
        </DialogActions>
      </Dialog>
    );

    let checkCourse = this.state.checkCourse;

    let resetCheckCourse = () => {
      this.setState({
        checkCourse: null
      })
    };

    let checkCourseDialog = (
      <Dialog
        open={checkCourse}
        onClose={resetCheckCourse}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            TODO
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetCheckCourse} color="primary">
            取消
          </Button>
          <Button onClick={resetCheckCourse} color="primary" autoFocus>
            复习
          </Button>
        </DialogActions>
      </Dialog>
    );

    return (
      <Container>
        {searchContainer}
        {myCourseFragment}
        <SimpleLine marginX={"20px"} marginY={"20px"} height={'1px'}/>
        {historyCourseFragment}
        {checkCourseDialog}
      </Container>

    );
  }
}
