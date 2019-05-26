export interface UserVO {
  id: Number;
  username: String;
  password: String;
  name: String;	// 真实姓名
  type: Number;	// 0 老师 1 学生
}

export interface CourseVO {
  id: Number;
  name: String;
  username: String;
  finished: Boolean;
  teacherId: Number;
  teacherName: String;
}

export interface LessonVO {
  id: Number;
  name: String;	// 这节课的名字
  courseId: Number;
  teacherId: Number;
  startTime: Number;
  endTime: Number;
}

export interface Point {
  x: Number;
  y: Number;
}

export interface TeacherNoteItemVO {	// 老师的板书节点
  id: Number;
  bookId: Number;
  page: Number;
  color: String;
  content: String;
  coordinates: Point[];
  createTime: Number;
}

export interface TeacherNoteBookVO {	// 老师板书
  id: Number;
  color: String;
  teacherId: Number;
  lessonId: Number;
  items: TeacherNoteItemVO[];
}

export interface StudentNoteItemVO {
  id: Number;
  bookId: Number;
  teacherNoteItemId: Number;
  content: String;
}

export interface StudentNoteBookVO {
  id: Number;
  lessonId: Number;
  studentId: Number;
  items: StudentNoteItemVO[];
}

export interface LiveLessonData {
  operationType: String;	// "CREATE", "DELETE", "UPDATE", "END"（下课）
  teacherNoteItem: TeacherNoteItemVO;
}
