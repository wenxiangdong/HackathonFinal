import React from "react";
import withToolBar from "./hocs/withToolBar";

import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import Typography from "@material-ui/core/Typography/Typography";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";

import {withSnackbar} from "notistack";

import "./Form.css"
import updateState from "../utils/state-helper";
import Logger from "../utils/logger";
import type {ICommonApi} from "../apis/common-api";
import {apiHub} from "../apis/ApiHub";
import FullScreenLoading from "../components/common/FullScreenLoading/FullScreenLoading";
import type {UserVO} from "../vo/vo";
import {UserType} from "../vo/vo";
import type {HttpResponse} from "../apis/http";
import {error, success} from "../utils/snackbar-helper";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import RadioGroup from "@material-ui/core/RadioGroup/RadioGroup";
import Radio from "@material-ui/core/Radio/Radio";

interface IState {
  name: string;
  username: string;
  password: string;
  confirmPassword: string,
  loading: boolean;
  type: UserType;
}

interface IProp {
  enqueueSnackbar?: () => void;
}

/**
 * Register
 * @create 2019/5/26 14:20
 * TODO 从登陆复制过来的
 */
class Register extends React.Component<IProp, IState> {

  _logger: Logger;
  _commonApi: ICommonApi;

  constructor(props) {
    super(props);
    this._logger = Logger.getLogger("Register");
    this._commonApi = apiHub.commonApi;
    this.state = {
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
      loading: false,
      type: UserType.STUDENT
    }
  };

  register(e: Event) {
    e.preventDefault();
    this.setState({loading: true});
    let user:UserVO = {
      id: -1,
      username: this.state.username,
      password: this.state.password,
      name: this.state.name,
      type: this.state.type
    };

    this._commonApi.register(user)
      .then((user) => {
        if (user.type === UserType.STUDENT || user.type === UserType.TEACHER) {
          let typeText = user.type === UserType.STUDENT? "学生": "教师";
          success(`${typeText} ${user.name} 注册成功`, this);
          this.props.history.push(`/Login`);
        } else {
          this.setState({loading: false});
          error("无法识别的用户类型", this);
        }
      })
      .catch((e:HttpResponse) => {
        this._logger.error(e);
        this.setState({loading: false});
        error(e.message, this);
      })
    ;
  };

  returnToLogin(e: Event) {
    e.preventDefault();
    this.props.history.goBack();
  }

  hasError(): boolean {
    const {name, username, password, confirmPassword} = this.state;
    return !(name && username && password && confirmPassword && password === confirmPassword);
  }

  render(): React.ReactNode {
    const {name, username, password, confirmPassword} = this.state;
    const registerForm = (
      <div className={"main-card"}>
        <CssBaseline/>
        <div>
          <Typography component="h1" variant="h5">
            注册板书
          </Typography>
          <form className={"register-form"} noValidate onSubmit={(e) => this.register(e)}>
            <TextField
              error={!name}
              margin="normal"
              required
              fullWidth
              name="name"
              label="姓名"
              id="name"
              autoFocus
              value={name}
              onChange={(e) => updateState("name", e.target.value, this)}
            />
            <TextField
              error={!username}
              margin="normal"
              required
              fullWidth
              id="username"
              label="账号"
              name="username"
              value={username}
              onChange={(e) => updateState("username", e.target.value, this)}
            />
            <TextField
              error={!password}
              margin="normal"
              required
              fullWidth
              name="password"
              label="密码"
              type="password"
              id="password"
              value={password}
              onChange={(e) => updateState("password", e.target.value, this)}
            />
            <TextField
              error={!(confirmPassword && confirmPassword === password)}
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="确认密码"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => updateState("confirmPassword", e.target.value, this)}
            />
            <RadioGroup
              aria-label="type"
              name="type"
              value={`${this.state.type}`}
              onChange={(e) => updateState("type", e.target.value, this)}
            >
              <FormControlLabel
                value={`${UserType.STUDENT}`}
                control={<Radio color="primary" />}
                label="学生"
              />
              <FormControlLabel
                value={`${UserType.TEACHER}`}
                control={<Radio color="primary" />}
                label="教师"
              />
            </RadioGroup>
            <Button
              disabled={this.hasError()}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              注册
            </Button>
            <Button
              onClick={(e) => this.returnToLogin(e)}
              fullWidth
              variant="contained"
              color="secondary"
            >
              返回
            </Button>
          </form>
        </div>
      </div>

    );

    return (
      <div className={"main-box"}>
        {this.state.loading? <FullScreenLoading/>: null}
        {registerForm}
      </div>
    )
  }
}

export default withSnackbar(withToolBar(Register));
