import type {CourseVO, LessonVO, StudentNoteBookVO, StudentNoteItemVO, TeacherNoteBookVO} from "../vo/vo";
import {Http, HttpMock} from "./http";

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
    return Http.get("/searchCourses", {keyword, index, offset});
  }

  studentGetUnfinishedCourses(): Promise<CourseVO[]> {
    return Http.get("/studentGetUnfinishedCourses");
  }

  studentGetFinishedCourses(): Promise<CourseVO[]> {
    return Http.get("/studentGetFinishedCourses");
  }

  studentGetOnGoingCourses(): Promise<CourseVO[]> {
    return Http.get("/studentGetOnGoingCourses");
  }

  joinCourse(courseId: Number): Promise<void> {
    return Http.post("/studentGetOnGoingCourses", {courseId});
  }

  getLessonsByCourseId(courseId: Number): Promise<LessonVO[]> {
    return Http.get("/getLessonsByCourseId", {courseId});
  }

  getStudentNoteBookByLessonId(lessonId: Number): Promise<StudentNoteBookVO> {
    return Http.get("/getStudentNoteBookByLessonId", {lessonId});
  }

  getTeacherNoteBookByLessonId(lessonId: Number): Promise<TeacherNoteBookVO> {
    return Http.get("/getTeacherNoteBookByLessonId", {lessonId});
  }

  joinLesson(lessonId: Number): Promise<String> {
    return Http.post("/joinLesson", {lessonId});
  }

  writeStudentNote(studentNoteItem: StudentNoteItemVO): Promise<StudentNoteItemVO> {
    return Http.post("/writeStudentNote", {studentNoteItem});
  }

  getSharedNoteBook(lessonId: Number): Promise<StudentNoteBookVO[]> {
    return Http.get("/getSharedNoteBook", {lessonId});
  }

  cloneNoteBook(noteBook: StudentNoteBookVO): Promise<void> {
    return Http.post("/cloneNoteBook", {noteBook});
  }
}

export class MockStudentApi implements IStudentApi {
  createCourses(finished: boolean): CourseVO[] {
    let courses: CourseVO[] = new Array(10)
      .fill(
        {
          id: -1,
          name: "name",
          username: "name",
          finished,
          teacherId: -1,
          teacherName: "teacherName",
        }
      );
    return courses;
  }

  searchCourses(keyword: String, index: Number, offset: Number): Promise<CourseVO[]> {
    return HttpMock.success(this.createCourses(false));
  }

  studentGetUnfinishedCourses(): Promise<CourseVO[]> {
    return HttpMock.success(this.createCourses(false));
  }

  studentGetFinishedCourses(): Promise<CourseVO[]> {
    return HttpMock.success(this.createCourses(true));
  }

  studentGetOnGoingCourses(): Promise<CourseVO[]> {
    return HttpMock.success(this.createCourses(false));
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
