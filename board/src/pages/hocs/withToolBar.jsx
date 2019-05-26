import * as React from "react";

import HomeIcon from "@material-ui/icons/Home"
import "./withToolBar.css"
import {withRouter} from "react-router-dom";

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
      const userType = localStorage.getItem("user-type");
      const userId = localStorage.getItem("user-id");
      if (userType === "student") {
        this.props.history.push(`/Student/${userId}`);
      } else if (userType === "teacher") {
        this.props.history.push(`/Teacher/${userId}`);
      } else {
        this.props.history.push(`/Login`);
      }
    }
  }

  return withRouter(WithToolBarComponent);

}
