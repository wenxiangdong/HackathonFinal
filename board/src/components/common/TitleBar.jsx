import React from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

interface IProp {
  title: string
}


/**
 * TitleBar
 * @create 2019/5/26 16:11
 */
export default class TitleBar extends React.Component<IProp> {
  render(): React.ReactNode {
    const title = this.props.title;

    return (
      <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

