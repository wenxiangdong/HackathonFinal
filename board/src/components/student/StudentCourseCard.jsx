import React from "react";
import type {CourseVO} from "../../vo/vo";

import './StudentCourseCard.css'
import Card from "@material-ui/core/Card/Card";
import ButtonBase from "@material-ui/core/ButtonBase/ButtonBase";

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
      baseClass = "ongoing base-box";
    } else {
      subTitle = "点击查看课程历史";
      if (course.finished) {
        title = "已结束";
        baseClass = "finished base-box";
      } else {
        title = "点击查看课程历史";
        baseClass = "unfinished base-box";
      }
    }

    return (
      <ButtonBase>
        <Card>
          <div className={baseClass} onClick={this.props.onClick}>
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
                  课程名称
                </div>
                <div className={"course-teacher-name"}>
                  主讲：{course.teacherName}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </ButtonBase>
    );
  }
}
