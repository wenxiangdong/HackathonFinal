import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";

import "./FullScreenLoading.css"

/**
 * FullScreenLoading
 * @create 2019/5/26 20:43
 */
export default class FullScreenLoading extends React.Component {
  render(): React.ReactNode {
    return (
      <div className={"progress-wrapper"}>
        <CircularProgress size={`60px`}/>
      </div>
    )
  }
}
