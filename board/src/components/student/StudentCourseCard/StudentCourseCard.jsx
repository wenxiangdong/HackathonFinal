import React from "react";
import type {CourseVO} from "../../../vo/vo";

import './StudentCourseCard.css'
import Card from "@material-ui/core/Card/Card";

interface IProp {
  course: CourseVO,
  ongoing: boolean,
  onClick: () => void
}

/**
 * EmptyCourseCard
 * @create 2019/5/26 16:28
 */
export default class StudentCourseCard extends React.Component<IProp> {
  render(): React.ReactNode {
    let title;
    let subTitle;
    let baseClass;
    let course = this.props.course;
    if (this.props.ongoing) {
      title = "正在授课";
      subTitle = "点击进入课程";
      baseClass = "ongoing";
    } else {
      // subTitle = "点击查看课程历史";
      subTitle = "点击查看上课记录";
      if (course.finished) {
        title = "已结课";
        baseClass = "finished";
      } else {
        // title = "点击查看课程历史";
        title = "未结课";
        baseClass = "unfinished";
      }
    }

    return (
      <div className={baseClass + " base-box"} onClick={this.props.onClick}>
        <div className={"top-div"}>
          <div>
            <div className={"title"}>
              {title}
            </div>
            <div className={"sub-title"}>
              {subTitle}
            </div>
          </div>
        </div>
        <div className={"bottom-div"}>
          <div>
            <div className={"course-name"}>
              课程名称: {course.name}
            </div>
            <div className={"course-teacher-name"}>
              主讲：{course.teacherName}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
