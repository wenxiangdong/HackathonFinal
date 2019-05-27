import * as React from "react";

import HomeIcon from "@material-ui/icons/Home"
import "./withToolBar.css"
import {Link, withRouter} from "react-router-dom";
import Button from "@material-ui/core/Button";

/**
 * 顶部工具栏
 * @param WrappedComponent
 * TODO 待完成
 */
export default function withToolBar(WrappedComponent) {
  class WithToolBarComponent extends React.Component {
    excludes = ["/Login", "/Register"];
    render() {
      const pathname: string = this.props.history.location.pathname;
      const exclude = this.excludes.some(reg => pathname.includes(reg));
      return (
        <div>
          <div className={"tool-bar"}>
            <div className={"click-able"} onClick={this.handleClick}>
              <div className={'title'}>板书</div>
              {/*<HomeIcon/>*/}
            </div>
           { exclude ? null : <div className={"right"}>
              <Button size="small" variant="outlined">
                <Link to="/Login" className={"link"}>登出</Link>
              </Button>
            </div>}
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
