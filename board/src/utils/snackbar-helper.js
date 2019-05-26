import React from "react";

export function error(msg: string, component: React.Component) {
  if (component.props.enqueueSnackbar) {
    component.props.enqueueSnackbar(msg? msg: "未知错误，请稍后重试", {variant: "error"});
  }
}

export function success(msg: string, component: React.Component) {
  if (component.props.enqueueSnackbar) {
    component.props.enqueueSnackbar(msg? msg: "操作成功", {variant: "success"});
  }
}

