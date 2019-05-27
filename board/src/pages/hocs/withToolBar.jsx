import * as React from "react";

import HomeIcon from "@material-ui/icons/Home"
import "./withToolBar.css"
import {withRouter} from "react-router-dom";
import localStorageHelper from "../../utils/local-storage-helper";
import {LOGIN, STUDENT_HOME_PAGE, TEACHER_HOME_PAGE} from "../../utils/router-helper";
import type {UserVO} from "../../vo/vo";
import {UserType} from "../../vo/vo";

/**
 * 顶部工具栏
 * @param WrappedComponent
 * TODO 待完成
 */
export default function withToolBar(WrappedComponent) {
  class WithToolBarComponent extends React.Component {
    render() {
      return (
        <div>
          <div className={"tool-bar"}>
            <div className={"click-able"} onClick={this.handleClick}>
              <div className={'title'}>板书</div>
              {/*<HomeIcon/>*/}
            </div>
          </div>
          <div className={"stub"}/>
          <WrappedComponent {...this.props} />
        </div>
      );
    }

    handleClick = () => {
      const user:UserVO = localStorageHelper.getUser();
      if (user) {
        if (user.type === UserType.TEACHER) {
          this.props.history.push(TEACHER_HOME_PAGE);
          return;
        } else if (user.type === UserType.STUDENT) {
          this.props.history.push(STUDENT_HOME_PAGE);
          return;
        }
      }
      this.props.history.push(LOGIN);
    }
  }

  return withRouter(WithToolBarComponent);

}
