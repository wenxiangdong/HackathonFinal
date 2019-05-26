import React from "react";

interface IProp {
  name: String;
}

export default class HelloWorld extends React.Component<IProp> {
  render(): React.ReactNode {
    return <div>{this.props.name}</div>;
  }
}
