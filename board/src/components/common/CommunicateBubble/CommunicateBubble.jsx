import * as React from "react";
import "./CommunicateBubble.css"

interface IProp {
  content: string
}

export default class CommunicateBubble extends React.Component<IProp> {
  render(): React.ReactNode {
    const {content} = this.props;

    return (
      <div className={"animation-outside-box"}>
        <div className={"animation-item"}>{content}</div>
      </div>
    )
  }
}
