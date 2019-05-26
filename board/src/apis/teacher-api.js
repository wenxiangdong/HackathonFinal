import type {CourseVO, LessonVO, TeacherNoteBookVO, TeacherNoteItemVO} from "../vo/vo";
import {Http, HttpMock} from "./http";
import {MockStudentApi} from "./student-api";

export interface ITeacherApi {
  // 老师拿未结课课程
  // get
  teacherGetRunningCourses(): Promise<CourseVO[]>;

  // 老师拿结束课程
  // get
  teacherGetFinishedCourses(): Promise<CourseVO[]>;

  // 老师创建课程
  // post
  createCourse(courseVO: CourseVO): Promise<CourseVO>;

  // 老师修改课程
  // post
  updateCourse(courseVO: CourseVO): Promise<CourseVO>;

  // 老师上课
  // 服务端做了两个 初始化
  // post
  createLesson(lessonVO: lessonVO): Promise<TeacherNoteBookVO>;

  // 老师发送板书
  // post
  sendTeacherNote(teacherNote: TeacherNoteItemVO): Promise<TeacherNoteItemVO>;

  // 老师修改板书
  // post
  updateTeacherNote(teacherNoteId: Number): Promise<void>;

  // 老师删除板书
  // post
  deleteTeacherNote(teacherNoteId: Number): Promise<void>;

  // 老师下课
  // post
  endLesson(lessonId: Number): Promise<void>;
}

export class TeacherApi implements ITeacherApi {
  teacherGetRunningCourses(): Promise<CourseVO[]> {
    return Http.get("/teacherGetRunningCourses");
  }

  teacherGetFinishedCourses(): Promise<CourseVO[]> {
    return Http.get("/teacherGetRunningCourses");
  }

  createCourse(courseVO: CourseVO): Promise<CourseVO> {
    return Http.post("/createCourse", {courseVO});
  }

  updateCourse(courseVO: CourseVO): Promise<CourseVO> {
    return Http.post("/updateCourse", {courseVO});
  }

  createLesson(lessonVO: LessonVO): Promise<TeacherNoteBookVO> {
    return Http.post("/createLesson", {lessonVO});
  }

  sendTeacherNote(teacherNote: TeacherNoteItemVO): Promise<TeacherNoteItemVO> {
    return Http.post("/sendTeacherNote", {teacherNote});
  }

  updateTeacherNote(teacherNoteId: Number): Promise<void> {
    return Http.post("/updateTeacherNote", {teacherNoteId});
  }

  deleteTeacherNote(teacherNoteId: Number): Promise<void> {
    return Http.post("/deleteTeacherNote", {teacherNoteId});
  }

  endLesson(lessonId: Number): Promise<void> {
    return Http.post("/endLesson", {lessonId});
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

  }

  updateCourse(courseVO: CourseVO): Promise<CourseVO> {

  }

  createLesson(lessonVO: LessonVO): Promise<TeacherNoteBookVO> {

  }

  sendTeacherNote(teacherNote: TeacherNoteItemVO): Promise<TeacherNoteItemVO> {

  }

  updateTeacherNote(teacherNoteId: Number): Promise<void> {

  }

  deleteTeacherNote(teacherNoteId: Number): Promise<void> {

  }

  endLesson(lessonId: Number): Promise<void> {

  }
}
