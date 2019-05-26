import type {UserVO} from "../vo/vo";
import {Http, HttpMock} from "./http";

interface ICommonApi {
  // 注册
  // post:
  register(userVO: UserVO): Promise<UserVO>;

  // 登陆
  // post:
  login(userVO: UserVO): Promise<UserVO>;
}

class CommonApi implements ICommonApi {
  // 注册
  // post:
  async register(userVO: UserVO): Promise<UserVO> {
    return Http.post<UserVO>("/register", userVO);
  }

  // 登陆
  // post:
  async login(userVO: UserVO): Promise<UserVO> {
    return Http.post<UserVO>("/login", userVO);
  }
}


class MockCommonApi implements ICommonApi {
  // 注册
  // post:
  register(userVO: UserVO): Promise<UserVO> {
    return HttpMock.success(userVO);
  }

  // 登陆
  // post:
  login(userVO: UserVO): Promise<UserVO> {
    return HttpMock.success(userVO);
  }
}
