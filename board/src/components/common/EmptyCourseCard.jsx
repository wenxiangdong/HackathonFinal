import React from "react";

import './../student/StudentCourseCard/StudentCourseCard.css'

/**
 * EmptyCourseCard
 * @create 2019/5/26 16:28
 */
export default class EmptyCourseCard extends React.Component<IProp> {
  render(): React.ReactNode {
    return (
      <div style={{width: "100%", height: "128px", lineHeight: "128px", textAlign: "center", color: "#555555", fontWeight: "bold", fontSize: "22px"}}>
        暂时没有课程
      </div>
    );
  }
}
