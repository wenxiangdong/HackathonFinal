import React from "react";

import Container from "@material-ui/core/Container/Container";
import SearchCourse from "../../../components/student/SearchCourse/SearchCourse";

import "./Search.css"
import type {CourseVO} from "../../../vo/vo";
import FullScreenLoading from "../../../components/common/FullScreenLoading/FullScreenLoading";
import {withSnackbar} from "notistack";
import Logger from "../../../utils/logger";
import type {IStudentApi} from "../../../apis/student-api";
import {apiHub} from "../../../apis/ApiHub";
import type {HttpResponse} from "../../../apis/http";
import {error, success} from "../../../utils/snackbar-helper";

interface IProp {
  enqueueSnackbar?: () => void;
}

interface IState {
  loading: boolean
}

/**
 * Search
 * @create 2019/5/27 4:16
 */
class Search extends React.Component<IProp, IState> {

  _logger: Logger;
  _studentApi: IStudentApi;

  constructor(props) {
    super(props);
    this._logger = Logger.getLogger("StudentHomepage");
    this._studentApi = apiHub.studentApi;
    this.state = {
      loading: false
    };
  }

  handleSearchCourseSelected(course: CourseVO) {
    this.setState({loading: true});
    this._studentApi.joinCourse(course.id)
      .then(() => {
        success(`课程 ${course.name} 已成功加入`, this);
      })
      .catch((e:HttpResponse) => {
        this._logger.error(e);
        error(e.message, this);
      })
      .finally(() => {
        this.setState({loading: false});
      })
    ;
  }

  render(): React.ReactNode {
    return (
      <>
        {this.state.loading? <FullScreenLoading/>: null}
        <Container className={"search-container"} style={{padding: "50px 10vw 50px 10vw"}}>
          <SearchCourse onSelectCourse={(course: CourseVO) => this.handleSearchCourseSelected(course)}/>
        </Container>
      </>
    );
  }
}

export default withSnackbar(Search);
