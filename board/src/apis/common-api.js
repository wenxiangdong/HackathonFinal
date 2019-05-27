import type {LessonVO, TeacherNoteBookVO, UserVO} from "../vo/vo";
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
    // const item: TeacherNoteItemVO = {
    //   id: 0,
    //   content: "xxxxxxx?type=TEXT",
    //   color: "",
    //   coordinates: [],
    //   page: Math.round(Math.random())
    // };
    const book: TeacherNoteBookVO = {
      id: 0,
      items: JSON.parse('[{"id":0,"page":0,"color":"red","content":"?type=HANDWRITING","coordinates":[{"x":1235.2941176470588,"y":449.4117512422449},{"x":1235.2941176470588,"y":449.4117512422449},{"x":1267.6470588235293,"y":446.4705747716567},{"x":1302.941176470588,"y":446.4705747716567},{"x":1400,"y":455.2941041834214},{"x":1476.470588235294,"y":469.99998653636254},{"x":1514.705882352941,"y":484.70586888930376},{"x":1588.2352941176468,"y":514.1176335951861},{"x":1664.705882352941,"y":549.4117512422449},{"x":1752.941176470588,"y":814.117633595186},{"x":1729.4117647058822,"y":846.4705747716566},{"x":1691.1764705882351,"y":878.8235159481272},{"x":1558.8235294117646,"y":937.647045359892},{"x":1520.5882352941176,"y":955.2941041834214},{"x":1464.705882352941,"y":967.0588100657743},{"x":1341.1764705882351,"y":987.6470453598919},{"x":1308.8235294117646,"y":987.6470453598919},{"x":1291.1764705882351,"y":987.6470453598919},{"x":1270.5882352941176,"y":984.7058688893037},{"x":1252.941176470588,"y":975.882339477539},{"x":1238.235294117647,"y":972.9411630069508},{"x":1232.3529411764705,"y":961.1764571245978},{"x":1223.5294117647059,"y":943.5293983010685}],"createTime":123}]')
    };
    return HttpMock.success(book);
  }

  uploadFile(file: File): Promise<String> {

  }
}
