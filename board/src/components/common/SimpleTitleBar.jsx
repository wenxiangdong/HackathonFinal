import React from "react";
import Typography from '@material-ui/core/Typography';

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
      <div className={"title-wrapper"}>
        <Typography className={"title"}>
          {title}
        </Typography>
      </div>
    );
  }
}

