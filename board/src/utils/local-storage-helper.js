import type {LessonVO, TeacherNoteBookVO, UserVO} from "../vo/vo";

class LocalStorageHelper {
  USER = "hackathon.board.user";

  setUser(user: UserVO) {
    localStorage.setItem(this.USER, JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(localStorage.getItem(this.USER))
  }

  BOOK = "hackathon.board.book";

  setBook(book: TeacherNoteBookVO) {
    localStorage.setItem(this.BOOK, JSON.stringify(book));
  }

  getBook() {
    return JSON.parse(localStorage.getItem(this.BOOK))
  }

  LESSON = "hackathon.board.lesson";

  setLesson(lesson: LessonVO) {
    localStorage.setItem(this.LESSON, JSON.stringify(lesson));
  }

  getLesson() {
    return JSON.parse(localStorage.getItem(this.LESSON))
  }
}

const localStorageHelper = new LocalStorageHelper();

export default localStorageHelper;