import * as React from "react";

import "./withToolBar.css"
import {Link, withRouter} from "react-router-dom";
import Button from "@material-ui/core/Button";
import localStorageHelper from "../../utils/local-storage-helper";
import {
  LOGIN,
  STUDENT_HOME_PAGE,
  STUDENT_LESSON_ONGOING,
  STUDENT_LESSON_REVIEW,
  TEACHER_HOME_PAGE, TEACHER_LESSON
} from "../../utils/router-helper";
import {LOGIN, STUDENT_HOME_PAGE, TEACHER_HOME_PAGE} from "../../utils/router-helper";
import type {UserVO} from "../../vo/vo";

/**
 * 顶部工具栏
 * @param WrappedComponent
 * TODO 待完成
 */
export default function withToolBar(WrappedComponent) {
  class WithToolBarComponent extends React.Component {
    excludes = [STUDENT_HOME_PAGE, STUDENT_LESSON_REVIEW, STUDENT_LESSON_ONGOING, TEACHER_HOME_PAGE, TEACHER_LESSON];
    render() {
      const pathname: string = this.props.history.location.pathname;
      const exclude = !this.excludes.some(reg => pathname.includes(reg));
      return (
        <div>
          <div className={"tool-bar"}>
            <div className={"click-able"} onClick={() => this.handleClick(pathname)}>
              <div className={'tool-bar-title'} style={{fontSize: '24px', fontWeight: 'bold'}}>板书</div>
            </div>
           { exclude ? null : <div className={"right"}>
              <Button size="small" variant="outlined" color={"secondary"}>
                <Link to="/Login" className={"link"}><span style={{color: "white"}}>登出</span></Link>
              </Button>
            </div>}
          </div>
          <div className={"stub"}/>
          <WrappedComponent {...this.props} />
        </div>
      );
    }

    handleClick = (pathname) => {
      const user:UserVO = localStorageHelper.getUser();
      if (user) {
        //TODO
        if (user.type === 0) {
          (pathname !== TEACHER_HOME_PAGE) && this.props.history.push(TEACHER_HOME_PAGE);
          return;
        } else if (user.type === 1) {
          (pathname !== STUDENT_HOME_PAGE) && this.props.history.push(STUDENT_HOME_PAGE);
          return;
        }
      }
      this.props.history.push(LOGIN);
    }
  }

  return withRouter(WithToolBarComponent);
}
