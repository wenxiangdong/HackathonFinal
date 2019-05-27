import {MockStudentApi, StudentApi} from "./student-api";
import {MockTeacherApi, TeacherApi} from "./teacher-api";
import {CommonApi, MockCommonApi} from "./common-api";
import type {ICommonApi} from "./common-api";
import type {IStudentApi} from "./student-api";
import type {ITeacherApi} from "./teacher-api";

export interface IApiHub {
  commonApi: ICommonApi;
  studentApi: IStudentApi;
  teacherApi: ITeacherApi;
}

class ApiHub implements IApiHub {
  commonApi: ICommonApi;
  studentApi: IStudentApi;
  teacherApi: ITeacherApi;

  constructor () {
    this.commonApi = new CommonApi();
    this.studentApi = new StudentApi();
    this.teacherApi = new TeacherApi();
  }
}

class MockApiHub implements IApiHub {
  commonApi: ICommonApi;
  studentApi: IStudentApi;
  teacherApi: ITeacherApi;

  constructor () {
    this.commonApi = new MockCommonApi();
    this.studentApi = new MockStudentApi();
    this.teacherApi = new MockTeacherApi();
  }
}

const useMock = true;
const apiHub: IApiHub = useMock? new MockApiHub(): new ApiHub();

export {apiHub, useMock};
