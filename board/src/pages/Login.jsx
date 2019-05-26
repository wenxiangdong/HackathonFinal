import React from "react";
import withToolBar from "./hocs/withToolBar.jsx";

/**
 * Login
 * @create 2019/5/26 14:19
 */

class Login extends React.Component {


  render(): React.ReactNode {
    const loginForm = (
      <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet aspernatur, blanditiis consequuntur, dolorum ea fuga fugiat magnam maiores similique soluta temporibus velit vero. Accusamus in iste officiis optio reiciendis veniam.</div>
    );

    return (
      <div>{loginForm}</div>
    )
  }
}

export default withToolBar(Login);
