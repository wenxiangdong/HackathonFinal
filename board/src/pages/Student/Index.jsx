import React from "react";
import type {CourseVO, UserVO} from "../../vo/vo";

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


  componentDidMount(): void {
    super.componentDidMount();
  }

  getStudentId = () => {
    return this.props.match.match.params.id;
  };

  render(): React.ReactNode {
    return <div>Student Homepage works</div>;
  }
}
