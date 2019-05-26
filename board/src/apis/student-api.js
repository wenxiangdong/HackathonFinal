import type {CourseVO, StudentNoteBookVO, StudentNoteItemVO} from "../vo/vo";
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
  studentGetOngoingCourses(): Promise<CourseVO[]>;

  // 学生加入课程
  // post:
  joinCourse(courseId: Number): Promise<void>;

  // 学生上课
  // 学生可以接收消息的 websocket 地址
  // post:
  joinLesson(lessonId: Number): Promise<String>;

  // 学生根据lessonId拿自己的笔记
  // get:
  getStudentNoteBook(lessonId: Number): Promise<StudentNoteBookVO>;

  // 学生记笔记
  // post:
  writeStudentNote(bookId:number, studentNoteItem: StudentNoteItemVO): Promise<StudentNoteItemVO>;

  // 学生修改笔记
  // post:
  updateStudentNote(bookId:number, studentNoteItem: StudentNoteItemVO): Promise<StudentNoteItemVO>;

  // 学生删除笔记
  // post:
  deleteStudentNote(bookId:number, studentNoteId:number): Promise<void>;

  // 学生拿这节课所有的分享笔记
  // get:
  getSharedNoteBook(lessonId: Number): Promise<StudentNoteBookVO[]>;

  // 学生clone笔记
  // post:
  cloneNoteBook(bookId:number, cloneNoteBookId:number): Promise<void>;
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

  studentGetOngoingCourses(): Promise<CourseVO[]> {
    return Http.get("/studentGetOngoingCourses");
  }

  joinCourse(courseId: Number): Promise<void> {
    return Http.post("/studentGetOngoingCourses", {courseId});
  }

  joinLesson(lessonId: Number): Promise<String> {
    return Http.post("/joinLesson", {lessonId});
  }

  getStudentNoteBook(lessonId: Number): Promise<StudentNoteBookVO> {
    return Http.get("/getStudentNoteBook", {lessonId});
  }

  writeStudentNote(bookId:number, studentNoteItem: StudentNoteItemVO): Promise<StudentNoteItemVO> {
    return Http.post("/writeStudentNote", {bookId, studentNoteItem});
  }

  updateStudentNote(bookId:number, studentNoteItem: StudentNoteItemVO): Promise<StudentNoteItemVO> {
    return Http.post("/updateStudentNote", {bookId, studentNoteItem});
  }

  // 学生删除笔记
  // post:
  deleteStudentNote(bookId:number, studentNoteId:number): Promise<void> {
    return Http.post("/deleteStudentNote", {bookId, studentNoteId});
  }

  // 学生拿这节课所有的分享笔记
  // get:
  getSharedNoteBook(lessonId: Number): Promise<StudentNoteBookVO[]> {
    return Http.post("/getSharedNoteBook", {lessonId});
  }

  // 学生clone笔记
  // post:
  cloneNoteBook(bookId:number, cloneNoteBookId:number): Promise<void> {
    return Http.post("/cloneNoteBook", {bookId, cloneNoteBookId});
  }
}

export class MockStudentApi implements IStudentApi {
  static createCourses(finished: boolean): CourseVO[] {
    let courses: CourseVO[] = new Array(2)
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
    return HttpMock.success(MockStudentApi.createCourses(false));
  }

  studentGetUnfinishedCourses(): Promise<CourseVO[]> {
    return HttpMock.success(MockStudentApi.createCourses(false));
  }

  studentGetFinishedCourses(): Promise<CourseVO[]> {
    // return HttpMock.success(MockStudentApi.createCourses(true));
    return HttpMock.success([]);
  }

  studentGetOngoingCourses(): Promise<CourseVO[]> {
    return HttpMock.success(MockStudentApi.createCourses(false));
  }

  joinCourse(courseId: Number): Promise<void> {
    return HttpMock.success();
  }

  joinLesson(lessonId: Number): Promise<String> {

  }

  getStudentNoteBook(lessonId: Number): Promise<StudentNoteBookVO> {

  }

  writeStudentNote(bookId:number, studentNoteItem: StudentNoteItemVO): Promise<StudentNoteItemVO> {

  }

  updateStudentNote(bookId:number, studentNoteItem: StudentNoteItemVO): Promise<StudentNoteItemVO> {

  }

  deleteStudentNote(bookId:number, studentNoteId:number): Promise<void> {

  }

  getSharedNoteBook(lessonId: Number): Promise<StudentNoteBookVO[]> {

  }

  cloneNoteBook(bookId:number, cloneNoteBookId:number): Promise<void> {

  }
}
