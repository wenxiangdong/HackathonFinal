import * as React from "react";

interface IProp {
  marginY: string,
  marginX: string,
  height: string
}

export default class SimpleLine extends React.Component<IProp> {
  render(): React.ReactNode {

    const {marginX, marginY, height} = this.props;
    return (
      <div style={{
        maxWidth: "1139px",
        margin: marginY + " " + marginX,
        borderTop: height + ' #cccccc solid'
      }}/>
    );
  }
}
