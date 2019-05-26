import type {LessonVO, UserVO} from "../vo/vo";
import {Http, HttpMock} from "./http";
import {UserType} from "../vo/vo";

export interface ICommonApi {
  // 注册
  // post:
  register(userVO: UserVO): Promise<UserVO>;

  // 登陆
  // post:
  login(userVO: UserVO): Promise<UserVO>;

  // 学生根据课程拿所有的课
  // get:
  getLessonsByCourseId(courseId: Number): Promise<LessonVO[]>;
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

  getLessonsByCourseId(courseId: Number): Promise<LessonVO[]> {
    return Http.get("/getLessonsByCourseId", {courseId});
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

  static getLessons(): LessonVO[] {
    let courses: LessonVO[] = new Array(2);
    courses[0] =
      {
        id: -1,
        name: "name1",
        courseId: -1,
        teacherId: -1,
        startTime: Date.now(),
        endTime: 0
      };
    courses[1] = {
      id: -2,
      name: "name2",
      courseId: -1,
      teacherId: -1,
      startTime: Date.now(),
      endTime: Date.now()
    };
    return courses;
  }

  getLessonsByCourseId(courseId: Number): Promise<LessonVO[]> {
    return HttpMock.success(MockCommonApi.getLessons());
  }
}
