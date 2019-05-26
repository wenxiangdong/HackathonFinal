import React from "react";
import withToolBar from "./hocs/withToolBar";
import "./Form.css"
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import Typography from "@material-ui/core/Typography/Typography";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import {Link} from "react-router-dom";
import Logger from "../utils/logger";
import FullScreenLoading from "../components/common/FullScreenLoading/FullScreenLoading";
import type {ICommonApi} from "../apis/common-api";
import {apiHub} from "../apis/ApiHub";

import {withSnackbar} from "notistack";
import {UserType} from "../vo/vo";
import type {HttpResponse} from "../apis/http";
import error from "../utils/snackbar-helper";
import type {UserVO as UserVO} from "../vo/vo";

interface IState {
  username: String;
  password: String;
  loading: boolean;
}

interface IProp {
  enqueueSnackbar?: () => void;
}

/**
 * Login
 * @create 2019/5/26 14:19
 * TODO 逻辑
 */
class Login extends React.Component<IProp, IState> {

  _logger: Logger;
  _commonApi: ICommonApi;

  constructor(props) {
    super(props);
    this._logger = Logger.getLogger("Login");
    this._commonApi = apiHub.commonApi;
    this.state = {
      username: "",
      password: "",
      loading: false
    }
  };

  login(e:Event) {
    e.preventDefault();
    this._logger.info(this.state);
    this.setState({loading: true});
    let user:UserVO = {
      id: -1,
      username: this.state.username,
      password: this.state.password,
      name: '',
      type: -1
    };

    this._commonApi.login(user)
      .then((user) => {
        if (user.type === UserType.STUDENT) {
          this.props.history.push(`/Student/${user.id}`);
        } else if (user.type === UserType.TEACHER) {
          this.props.history.push(`/Teacher/${user.id}`);
        }
      })
      .catch((e:HttpResponse) => {
        this._logger.error(e);
        this.setState({loading: false});
        error(e.message, this);
      })
    ;
  };

  render(): React.ReactNode {
    let updateState = (name, data) => {
      let state = {};
      state[name] = data;
      this.setState(state);
    };

    const loginForm = (
      <div className={"login-card"}>
        <CssBaseline/>
        {this.state.loading? <FullScreenLoading/>: null}
        <div>
          <Typography component="h1" variant="h5">
            登录板书
          </Typography>
          <form className={"login-form"} noValidate onSubmit={(e) => this.login(e)}>
            <TextField
              margin="normal"
              required
              fullWidth
              value={this.state.username}
              onChange={(e) => updateState("username", e.target.value)}
              id="username"
              label="账号"
              name="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              value={this.state.password}
              onChange={(e) => updateState("password", e.target.value)}
              name="password"
              label="密码"
              type="password"
              id="password"
              // autoComplete="current-password"
            />
            {/*<div className={'form-control-label'}>*/}
              {/*<FormControlLabel className={'remember-password'}*/}
                                {/*control={<Checkbox value="remember" color="primary"/>}*/}
                                {/*label="记住密码"*/}
              {/*/>*/}
            {/*</div>*/}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={"login-button"}
            >
              登录
            </Button>
            <Link to={"/Register"}>
              <div className={'to-register'}>还没有账户？点击注册</div>
            </Link>
          </form>
        </div>
      </div>

    );

    return (
      <div className={"main-box"}>
        {loginForm}
      </div>
    )
  }
}

export default withSnackbar(withToolBar(Login));
