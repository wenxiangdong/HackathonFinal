import type {UserVO} from "../vo/vo";
import {Http} from "./http";

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
        try {
            const user: UserVO = (await Http.post<UserVO>("/register", userVO)).data;

        } catch (e) {

        }

    }

    // 登陆
    // post:
    login(userVO: UserVO): Promise<UserVO> {

    }
}
