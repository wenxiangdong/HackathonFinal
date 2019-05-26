import React from "react";
import type {CourseVO} from "../../vo/vo";
import Typography from "@material-ui/core/Typography/Typography";

import './StudentCourseCard.css'

interface IProp {
  course: CourseVO,
  ongoing: boolean,
  onClick: () => void
}

/**
 * StudentCourseCard
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
    } else{
      subTitle = "点击查看课程历史";
      if (course.finished) {
        title = "已结束";
        baseClass = "finished";
      } else {
        title = "目前未在授课";
        baseClass = "unfinished";
      }
    }

    return (
      <div className={baseClass} onClick={this.props.onClick}>
        <div className={"top-div"}>
          <Typography className={"title"}>
            {title}
          </Typography>
          <Typography className={"sub-title"}>
            {subTitle}
          </Typography>
        </div>
        <div className={"bottom-div"}>
          <Typography className={"course-name"}>
            {course.name}
          </Typography>
          <Typography className={"course-teacher-name"}>
            主讲：{course.teacherName}
          </Typography>
        </div>
      </div>
    );
  }
}
