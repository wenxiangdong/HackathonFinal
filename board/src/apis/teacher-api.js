import type {CourseVO, LessonVO, TeacherNoteBookVO, TeacherNoteItemVO} from "../vo/vo";
import {Http} from "./http";

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

  // 老师删除板书
  // post
  deleteTeacherNote(teacherNoteIds: Number[]): Promise<void>;

  // 老师下课
  // post
  endLesson(lessonId: Number): Promise<void>;
}

export class TeacherApi implements ITeacherApi{
  teacherGetRunningCourses(): Promise<CourseVO[]> {

  }

  teacherGetFinishedCourses(): Promise<CourseVO[]> {

  }

  createCourse(courseVO: CourseVO): Promise<CourseVO> {

  }

  updateCourse(courseVO: CourseVO): Promise<CourseVO> {

  }

  createLesson(lessonVO: lessonVO): Promise<TeacherNoteBookVO> {

  }

  sendTeacherNote(teacherNote: TeacherNoteItemVO): Promise<TeacherNoteItemVO> {

  }

  deleteTeacherNote(teacherNoteIds: Number[]): Promise<void> {

  }

  endLesson(lessonId: Number): Promise<void> {

  }
}

export class MockTeacherApi implements ITeacherApi{
  teacherGetRunningCourses(): Promise<CourseVO[]> {

  }

  teacherGetFinishedCourses(): Promise<CourseVO[]> {

  }

  createCourse(courseVO: CourseVO): Promise<CourseVO> {

  }

  updateCourse(courseVO: CourseVO): Promise<CourseVO> {

  }

  createLesson(lessonVO: lessonVO): Promise<TeacherNoteBookVO> {

  }

  sendTeacherNote(teacherNote: TeacherNoteItemVO): Promise<TeacherNoteItemVO> {

  }

  deleteTeacherNote(teacherNoteIds: Number[]): Promise<void> {

  }

  endLesson(lessonId: Number): Promise<void> {

  }
}