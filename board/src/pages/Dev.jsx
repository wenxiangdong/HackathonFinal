import React from "react";
import LessonList from "../components/common/LessonList/LessonList";
import type {LessonVO} from "../vo/vo";

export default class Dev extends React.Component {
  lessons: LessonVO[] = [
    {
      id: 1,
      name: "名称",
      startTime: new Date().getTime()
    },
    {
      id: 2,
      name: "名称",
      startTime: new Date().getTime()
    },
    {
      id: 3,
      name: "名称",
      startTime: new Date().getTime()
    },
  ];
  render() {
    return (
      <div>
        <LessonList lessons={this.lessons} title={"课程"}/>
      </div>
    );
  }
}
