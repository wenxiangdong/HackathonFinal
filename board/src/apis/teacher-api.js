import type {CourseVO, LessonVO, TeacherNoteBookVO, TeacherNoteItemVO} from "../vo/vo";
import {Http, HttpMock} from "./http";
import {MockStudentApi} from "./student-api";

export interface ITeacherApi {
  // 老师创建课程
  // post
  createCourse(courseVO: CourseVO): Promise<CourseVO>;

  // 老师修改课程
  // post
  updateCourse(courseVO: CourseVO): Promise<CourseVO>;

  // 老师拿未结课课程
  // get
  teacherGetRunningCourses(): Promise<CourseVO[]>;

  // 老师拿结束课程
  // get
  teacherGetFinishedCourses(): Promise<CourseVO[]>;

  // 老师上课
  // 服务端做了两个 初始化
  // post
  createLesson(lessonVO: LessonVO): Promise<TeacherNoteBookVO>;

  // 老师发送板书
  // post
  sendTeacherNote(bookId: number, teacherNote: TeacherNoteItemVO): Promise<TeacherNoteItemVO>;

  // 老师修改板书
  // post
  updateTeacherNote(bookId: number, teacherNote: TeacherNoteItemVO): Promise<TeacherNoteItemVO>;

  // 老师删除板书
  // post
  deleteTeacherNote(bookId: Number, teacherNoteId: Number): Promise<void>;

  // 老师下课
  // post
  endLesson(lessonId: Number): Promise<void>;
}

export class TeacherApi implements ITeacherApi {
  teacherGetRunningCourses(): Promise<CourseVO[]> {
    return Http.get("/teacherGetRunningCourses");
  }

  teacherGetFinishedCourses(): Promise<CourseVO[]> {
    return Http.get("/teacherGetFinishedCourses");
  }

  createCourse(courseVO: CourseVO): Promise<CourseVO> {
    return Http.post("/createCourse", courseVO);
  }

  updateCourse(courseVO: CourseVO): Promise<CourseVO> {
    return Http.post("/updateCourse", courseVO);
  }

  createLesson(lessonVO: LessonVO): Promise<TeacherNoteBookVO> {
    return Http.post("/createLesson", lessonVO);
  }

  sendTeacherNote(bookId: number, teacherNote: TeacherNoteItemVO): Promise<TeacherNoteItemVO> {
    return Http.post("/sendTeacherNote", teacherNote, {bookId});
  }

  updateTeacherNote(bookId: number, teacherNote: TeacherNoteItemVO): Promise<TeacherNoteItemVO> {
    return Http.post("/updateTeacherNote", teacherNote, {bookId});

  }

  deleteTeacherNote(bookId: Number, teacherNoteId: Number): Promise<void> {
    return Http.post("/deleteTeacherNote", {}, {bookId, teacherNoteId});
  }

  endLesson(lessonId: Number): Promise<void> {
    return Http.post("/endLesson", {}, {lessonId});
  }
}

export class MockTeacherApi implements ITeacherApi {
  teacherGetRunningCourses(): Promise<CourseVO[]> {
    return HttpMock.success(MockStudentApi.createCourses(false));
  }

  teacherGetFinishedCourses(): Promise<CourseVO[]> {
    return HttpMock.success(MockStudentApi.createCourses(true));
  }

  createCourse(courseVO: CourseVO): Promise<CourseVO> {
    return HttpMock.success({});
  }

  updateCourse(courseVO: CourseVO): Promise<CourseVO> {
    return HttpMock.success({finished: true});
  }

  createLesson(lessonVO: LessonVO): Promise<TeacherNoteBookVO> {
    return HttpMock.success({});
  }

  sendTeacherNote(bookId: number, teacherNote: TeacherNoteItemVO): Promise<TeacherNoteItemVO> {
    return HttpMock.success(teacherNote);
  }

  updateTeacherNote(bookId: number, teacherNote: TeacherNoteItemVO): Promise<TeacherNoteItemVO> {
    return HttpMock.success(teacherNote);

  }

  deleteTeacherNote(bookId: Number, teacherNoteId: Number): Promise<void> {
    return HttpMock.success();
  }

  endLesson(lessonId: Number): Promise<void> {
    return HttpMock.success();
  }
}
