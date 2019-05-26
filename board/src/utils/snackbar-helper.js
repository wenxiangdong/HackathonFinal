import React from "react";

export default function error(msg: string, component: React.Component) {
  if (component.props.enqueueSnackbar) {
    component.props.enqueueSnackbar(msg? msg: "未知错误，请稍后重试", {variant: "error"});
  }
}

