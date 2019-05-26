import React from "react";

export default function updateState(name: string, data:any, component: React.Component) {
  let state = {};
  state[name] = data;
  component.setState(state);
}

