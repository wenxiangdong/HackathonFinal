import type {LessonVO, TeacherNoteBookVO, TeacherNoteItemVO, UserVO} from "../vo/vo";
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
  getLessons(courseId: Number): Promise<LessonVO[]>;

  // 学生根据lessonId拿老师的板书
  // get:
  getTeacherNoteBook(lessonId: Number): Promise<TeacherNoteBookVO>;

  // 上传文件
  // 文件的完整url
  // post
  uploadFile(file: File): String;
}

export class CommonApi implements ICommonApi {
  async register(userVO: UserVO): Promise<UserVO> {
    return Http.post("/register", userVO);
  }

  async login(userVO: UserVO): Promise<UserVO> {
    return Http.post("/login", userVO);
  }

  getLessons(courseId: Number): Promise<LessonVO[]> {
    return Http.get("/getLessons", {courseId});
  }

  getTeacherNoteBook(lessonId: Number): Promise<TeacherNoteBookVO> {
    return Http.get("/getTeacherNoteBook", {lessonId});
  }

  uploadFile(file: File): Promise<String> {
    return Http.get("/uploadFile", {file});
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

  getLessons(courseId: Number): Promise<LessonVO[]> {
    return HttpMock.success(MockCommonApi.getLessons());
  }

  getTeacherNoteBook(lessonId: Number): Promise<TeacherNoteBookVO> {
    const item: TeacherNoteItemVO = {
      id: 0,
      content: "xxxxxxx?type=TEXT",
      color: "",
      coordinates: []
    };
    const book: TeacherNoteBookVO = {
      id: 0,
      items: [{...item}, {...item}, {...item}]
    };
    return HttpMock.success(book);
  }

  uploadFile(file: File): Promise<String> {

  }
}
