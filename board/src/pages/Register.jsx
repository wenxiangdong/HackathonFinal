import React from "react";
import withToolBar from "./hocs/withToolBar";
import "./Form.css"
import TextField from "@material-ui/core/TextField/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import Button from "@material-ui/core/Button/Button";
import Typography from "@material-ui/core/Typography/Typography";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import {Link} from "react-router-dom";

/**
 * Register
 * @create 2019/5/26 14:20
 * TODO 从登陆复制过来的
 */
class Register extends React.Component {
  register(e:Event) {
    e.preventDefault();
    this.props.history.push(`/Student/1`);
  };

  returnToLogin(e:Event) {
    e.preventDefault();
    this.props.history.goBack();
  }

  render(): React.ReactNode {
    const registerForm = (
      <div className={"register-card"}>
        <CssBaseline/>
        <div>
          <Typography component="h1" variant="h5">
            注册板书
          </Typography>
          <form className={"register-form"} noValidate onSubmit={(e) => this.register(e)}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="账号"
              name="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="密码"
              type="password"
              id="password"
              // autoComplete="current-password"
            />
            <div className={'form-control-label'}>
              <FormControlLabel className={'remember-password'}
                                control={<Checkbox value="remember" color="primary"/>}
                                label="记住密码"
              />
            </div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={"register-button"}
            >
              注册
            </Button>
            <Button
              onClick={(e) => this.returnToLogin(e)}
              fullWidth
              variant="contained"
              color="primary"
              className={"return-button"}
            >
              返回
            </Button>
          </form>
        </div>
      </div>

    );

    return (
      <div className={"main-box"}>
        {registerForm}
      </div>
    )
  }
}

export default withToolBar(Register);
