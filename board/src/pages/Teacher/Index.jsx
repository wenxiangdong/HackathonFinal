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

import AddIcon from "@material-ui/icons/Add"
import "./../Student/index.css"
import EmptyCourseCard from "../../components/common/EmptyCourseCard";
import CourseDialog from "../../components/teacher/CourseDialog/CourseDialog";
import type {HttpResponse} from "../../apis/http";
import {error, success} from "../../utils/snackbar-helper";
import FullScreenLoading from "../../components/common/FullScreenLoading/FullScreenLoading";
import Button from "@material-ui/core/Button/Button";
import SingleTextFormDialog from "../../components/common/SingleTextFormDialog/SingleTextFormDialog";
import {withSnackbar} from "notistack";
import SimpleLine from "../../components/common/SimpleLine";
import withToolBar from "../hocs/withToolBar";

interface IState {
  unfinishedCourses: CourseVO[];
  finishedCourses: CourseVO[];
  checkCourse: CourseVO;
  addCourse: boolean;
  loading: boolean
}

interface IProp {
  enqueueSnackbar?: () => void;
}

/**
 * Teacher Homepage
 * @create 2019/5/26 14:22
 */
class Index extends React.Component<IProp, IState> {

  _logger: Logger;
  _teacherApi: ITeacherApi;

  constructor(props) {
    super(props);
    this._logger = Logger.getLogger("TeacherHomepage");
    this._teacherApi = apiHub.teacherApi;
    this.state = {
      loading: false,
      addCourse: false
    };
  }

  componentDidMount(): void {
    this._teacherApi.teacherGetRunningCourses()
      .then((courses) => this.setState({unfinishedCourses: courses}))
      .catch(e => this.handleError(e))
    ;
    this._teacherApi.teacherGetFinishedCourses()
      .then((courses) => this.setState({finishedCourses: courses}))
      .catch(e => this.handleError(e))
    ;
  }

  showCourseHistory = (course) => {
    this.setState({checkCourse:course});
  };

  handleEndCourse = () => {
    this.setState({loading: true});

    let course = this.state.checkCourse;
    this._teacherApi.updateCourse({...course, finished: true})
      .then((finishedCourse) => {
        let unfinishedCourses = this.state.unfinishedCourses;
        unfinishedCourses.splice(unfinishedCourses.indexOf(course), 1);
        let finishedCourses = this.state.finishedCourses;
        finishedCourses.unshift(finishedCourse);
        this.setState({checkCourse: null, unfinishedCourses, finishedCourses}, () => {
          success(`课程 ${course.name} 已成功结课`, this);
          this.setState({loading: false});
        });
      })
      .catch(e => this.handleError(e))
    ;
  };

  createCourse = (name) => {
    this.setState({loading: true});

    let course:CourseVO = {
      id: -1,
      name,
      finished: false,
      teacherId: this.getTeacherId(),
      teacherName: ""
    };
    this._teacherApi.createCourse(course)
      .then((course) => {
        this.setState({loading: false, addCourse: false, unfinishedCourses: [course, ...this.state.unfinishedCourses]}, () => {
          success(`课程 ${name} 已成功创建`, this);
        });
      })
      .catch(e => this.handleError(e))
    ;
  };

  getTeacherId = () => {
    return this.props.match.params.id;
  };

  handleError = (e:HttpResponse) => {
    this._logger.error(e);
    error(e.message, this);
    this.setState({loading: false});
  };

  render(): React.ReactNode {
    let unfinishedCourses = this.state.unfinishedCourses;
    let finishedCourses = this.state.finishedCourses;

    let unfinishedCourseFragment = (
      <Container className={"courses-wrapper"}>
        <div className={"my-courses"}>
          <SimpleTitleBar title={"进行中课程"}/>
          <span className={"spacer"}/>
          <Button variant="contained" color="primary" onClick={() => this.setState({addCourse: true})}>
            创建新课程
            <AddIcon/>
          </Button>
        </div>
        <Grid container className={"courses-grid"} spacing={2}>
          {unfinishedCourses
            ? unfinishedCourses.length > 0
              ? unfinishedCourses.map((course, idx) => (
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

    let addCourseDialog = (
      this.state.addCourse
        ? <SingleTextFormDialog title={"课程名称"} label={"课程名称"} onSubmit={(name) => this.createCourse(name)} buttonText={"创建课程"}/>
        : null
    );

    let finishedCourseFragment = (
      <Container className={"courses-wrapper"}>
        <SimpleTitleBar title={"已结束课程"}/>
        <Grid container className={"courses-grid"} spacing={2}>
          {finishedCourses
            ? finishedCourses.length > 0
              ? finishedCourses.map((course, idx) => (
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
                        title={checkCourse? `课程名称：${checkCourse.name}`: '课程'}
                        courseId={checkCourse.id}
                        finished={checkCourse.finished}
                        onEndCourse={() => this.handleEndCourse()}
          />
        )
        : null
    );

    return (
      <Container style={{paddingTop: "20px"}}>
        {this.state.loading? <FullScreenLoading/>: null}
        {unfinishedCourseFragment}
        <SimpleLine marginX={"20px"} marginY={"20px"} height={'1px'}/>
        {finishedCourseFragment}
        {addCourseDialog}
        {checkCourseDialog}
      </Container>
    );
  }
}

export default withSnackbar(withToolBar(Index));
