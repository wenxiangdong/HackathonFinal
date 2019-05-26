import React from "react";
import type {CourseVO, UserVO} from "../../vo/vo";
import Logger from "../../utils/logger";
import type {IStudentApi} from "../../apis/student-api";

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
    this._studentApi =
  }

  componentDidMount(): void {

  }

  getStudentId = () => {
    return this.props.match.params.id;
  };

  render(): React.ReactNode {
    return (
      <React.Fragment>
        Student Homepage works
      </React.Fragment>
    );
  }
}
