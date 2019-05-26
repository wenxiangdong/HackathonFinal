import type {CourseVO, LessonVO, StudentNoteBookVO, StudentNoteItemVO, TeacherNoteBookVO} from "../vo/vo";
import {Http} from "./http";

export interface IStudentApi {
  // 学生搜索课程
  // get:
  searchCourses(keyword: String, index: Number, offset: Number): Promise<CourseVO[]>;

  // 学生拿自己的未结课的课程
  // get:
  studentGetUnfinishedCourses(): Promise<CourseVO[]>;

  // 学生拿自己的结课的课程
  // get:
  studentGetFinishedCourses(): Promise<CourseVO[]>;

  // 学生拿正在上课的课程
  // get:
  studentGetOnGoingCourses(): Promise<CourseVO[]>;

  // 学生加入课程
  // post:
  joinCourse(courseId: Number): Promise<void>;

  // 学生根据课程拿所有的课
  // get:
  getLessonsByCourseId(courseId: Number): Promise<LessonVO[]>;

  // 学生根据lessonId拿自己的笔记
  // get:
  getStudentNoteBookByLessonId(lessonId: Number): Promise<StudentNoteBookVO>;

  // 学生根据lessonId拿老师的板书
  // get:
  getTeacherNoteBookByLessonId(lessonId: Number): Promise<TeacherNoteBookVO>;

  // 学生上课
  // 学生可以接收消息的 websocket 地址
  // post:
  joinLesson(lessonid: Number): Promise<String>;

  // 学生记笔记
  // post:
  writeStudentNote(studentNoteItem: StudentNoteItemVO): Promise<StudentNoteItemVO>;

  // 学生拿这节课所有的分享笔记
  // get:
  getSharedNoteBook(lessonId: Number): Promise<StudentNoteBookVO[]>;

  // 学生clone笔记
  // post:
  cloneNoteBook(noteBook: StudentNoteBookVO): Promise<void>;
}

export class StudentApi implements IStudentApi {
  searchCourses(keyword: String, index: Number, offset: Number): Promise<CourseVO[]> {

  }

  studentGetUnfinishedCourses(): Promise<CourseVO[]> {

  }

  studentGetFinishedCourses(): Promise<CourseVO[]> {

  }

  studentGetOnGoingCourses(): Promise<CourseVO[]> {

  }

  joinCourse(courseId: Number): Promise<void> {

  }

  getLessonsByCourseId(courseId: Number): Promise<LessonVO[]> {

  }

  getStudentNoteBookByLessonId(lessonId: Number): Promise<StudentNoteBookVO> {

  }

  getTeacherNoteBookByLessonId(lessonId: Number): Promise<TeacherNoteBookVO> {

  }

  joinLesson(lessonid: Number): Promise<String> {

  }

  writeStudentNote(studentNoteItem: StudentNoteItemVO): Promise<StudentNoteItemVO> {

  }

  getSharedNoteBook(lessonId: Number): Promise<StudentNoteBookVO[]> {

  }

  cloneNoteBook(noteBook: StudentNoteBookVO): Promise<void> {

  }
}

export class MockStudentApi implements IStudentApi {
  searchCourses(keyword: String, index: Number, offset: Number): Promise<CourseVO[]> {

  }

  studentGetUnfinishedCourses(): Promise<CourseVO[]> {

  }

  studentGetFinishedCourses(): Promise<CourseVO[]> {

  }

  studentGetOnGoingCourses(): Promise<CourseVO[]> {

  }

  joinCourse(courseId: Number): Promise<void> {

  }

  getLessonsByCourseId(courseId: Number): Promise<LessonVO[]> {

  }

  getStudentNoteBookByLessonId(lessonId: Number): Promise<StudentNoteBookVO> {

  }

  getTeacherNoteBookByLessonId(lessonId: Number): Promise<TeacherNoteBookVO> {

  }

  joinLesson(lessonid: Number): Promise<String> {

  }

  writeStudentNote(studentNoteItem: StudentNoteItemVO): Promise<StudentNoteItemVO> {

  }

  getSharedNoteBook(lessonId: Number): Promise<StudentNoteBookVO[]> {

  }

  cloneNoteBook(noteBook: StudentNoteBookVO): Promise<void> {

  }
}