import React from "react";
import LessonList from "../components/common/LessonList/LessonList";
import type {LessonVO} from "../vo/vo";
import SearchCourse from "../components/student/SearchCourse/SearchCourse";
import WebsocketPublisher from "../utils/websocket-publisher";
import Logger from "../utils/logger";

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
  _logger = Logger.getLogger(Dev.name);

  componentDidMount(): void {
    new WebsocketPublisher("ws://127.0.0.1:4300").subscribe({
      onError: (e) => {this._logger.error(e)}
    });
  }

  render() {
    return (
      <div>
        <SearchCourse/>
        <LessonList lessons={this.lessons} title={"课程"}/>
      </div>
    );
  }
}
