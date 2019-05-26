import type {UserVO} from "../vo/vo";
import {Http, HttpMock} from "./http";
import {UserType} from "../vo/vo";

export interface ICommonApi {
  // 注册
  // post:
  register(userVO: UserVO): Promise<UserVO>;

  // 登陆
  // post:
  login(userVO: UserVO): Promise<UserVO>;
}

export class CommonApi implements ICommonApi {
  // 注册
  // post:
  async register(userVO: UserVO): Promise<UserVO> {
    return Http.post("/register", userVO);
  }

  // 登陆
  // post:
  async login(userVO: UserVO): Promise<UserVO> {
    return Http.post("/login", userVO);
  }
}


export class MockCommonApi implements ICommonApi {
  // 注册
  // post:
  register(userVO: UserVO): Promise<UserVO> {
    return HttpMock.success(userVO);
  }

  // 登陆
  // post:
  login(userVO: UserVO): Promise<UserVO> {
    userVO.type =
      // UserType.TEACHER
      UserType.STUDENT
    ;
    return HttpMock.success(userVO);
  }
}
