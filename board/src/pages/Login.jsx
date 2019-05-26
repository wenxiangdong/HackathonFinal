import React from "react";
import withToolBar from "./hocs/withToolBar";
import "./Login.css"
import TextField from "@material-ui/core/TextField/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import Button from "@material-ui/core/Button/Button";
import Link from "@material-ui/core/Link/Link";
import Typography from "@material-ui/core/Typography/Typography";

/**
 * Login
 * @create 2019/5/26 14:19
 */

class Login extends React.Component {
  render(): React.ReactNode {
    const loginForm = (
      <div className={"login-card"}>
        <Typography component="h1" variant="h5">
          登录板书
        </Typography>
        <form className={"login-form"} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="账号"
            name="username"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="密码"
            type="password"
            id="password"
            // autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary"/>}
            label="记住密码"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={"login-button"}
          >
            登录
          </Button>
          <Link href="#" variant="body2">
            {"还没有账号？现在注册"}
          </Link>
        </form>
      </div>
    );

    return (
      <div>
        {loginForm}
      </div>
    )
  }
}

export default withToolBar(Login);
