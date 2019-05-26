import React from "react";
import "./SimpleTitleBar.css"

interface IProp {
  title: string
}


/**
 * SimpleTitleBar
 * @create 2019/5/26 16:11
 */
export default class SimpleTitleBar extends React.Component<IProp> {
  render(): React.ReactNode {
    const title = this.props.title;

    return (
      <div className={"title-bar"}>
        <div className={"title"}>
          {title}
        </div>
        <div className={'bottom-line'}/>
      </div>
    );
  }
}

