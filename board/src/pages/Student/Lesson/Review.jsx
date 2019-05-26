import React from "react";

import "./../../CanvasCommon.css"
import Logger from "../../../utils/logger";
import type {TeacherNoteBookVO, TeacherNoteItemVO} from "../../../vo/vo";
import {apiHub} from "../../../apis/ApiHub";
import type {IStudentApi} from "../../../apis/student-api";
import type {ICommonApi} from "../../../apis/common-api";

interface IState {
  lessonEnded: boolean
}

interface IProp {
  initTeacherNoteItemVOs?: TeacherNoteItemVO[];
}


/**
 * Review
 * @create 2019/5/26 14:22
 */
export default class Review extends React.Component<IProp, IState> {

  logger = Logger.getLogger();
  lessonId;
  _studentApi: IStudentApi;
  _commonApi: ICommonApi;


  // 这里是指 canvas 在 HTML 中实际的尺寸，会受到 CSS 宽度的限制，但是实际点坐标什么的都以这个为准
  canvasWidth = 3200;
  canvasHeight = 1800;

  teacherNoteVOList: TeacherNoteItemVO[] = [];

  ctx;

  constructor(props) {
    super(props);
    this.lessonId = props.match.params.id;
    this._studentApi = apiHub.studentApi;
    this._commonApi = apiHub.commonApi;
  }

  render(): React.ReactNode {

    const canvasView = (
      <div className={"canvas-padding"}>
        <div className={'canvas-box'}>
          <canvas id={"canvas"}
                  width={this.canvasWidth + "px"}
                  height={this.canvasHeight + "px"}/>
        </div>
      </div>
    );

    return (
      <div>
        {canvasView}
      </div>
    );
  }

  componentDidMount() {
    this._commonApi.getTeacherNoteBook(this.lessonId).then(
      (res: TeacherNoteBookVO) => {
        this.teacherNoteVOList = res.items;
        this.reRenderTeacherNoteVOList();
      }
    );
    document.body.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();
    this.initCanvas();
    document.body.addEventListener('touchmove', this.stopScroll, {
      passive: false
    });
  }

  componentWillUnmount() {
    document.body.removeEventListener('resize', this.onWindowResize);
    document.body.removeEventListener('touchmove', this.stopScroll, {
      passive: true
    });

    this.webSocketPublisher.unsubscribe(this.messageHandler);
  }


  // click () {
  //   var de = document.documentElement;
  //   if (de.requestFullscreen) {
  //     de.requestFullscreen();
  //   } else if (de.mozRequestFullScreen) {
  //     de.mozRequestFullScreen();
  //   } else if (de.webkitRequestFullScreen) {
  //     de.webkitRequestFullScreen();
  //   }
  // }

  deleteTeacherNoteItem(vo: TeacherNoteItemVO) {
    for (let i = 0; i < this.teacherNoteVOList.length; i++) {
      if (this.teacherNoteVOList[i].id === vo.id) {
        this.teacherNoteVOList.splice(i, 1);
        break;
      }
    }
  }

  updateTeacherNoteItem(vo: TeacherNoteItemVO) {
    for (let i = 0; i < this.teacherNoteVOList.length; i++) {
      if (this.teacherNoteVOList[i].id === vo.id) {
        this.teacherNoteVOList[i] = vo;
        break;
      }
    }
  }

  // todo
  endLesson() {

  }

  // 重新渲染列表里的笔画
  reRenderTeacherNoteVOList() {
    this.cleanCanvas();

    for (let vo: TeacherNoteItemVO of this.teacherNoteVOList) {
      const coordinates = vo.coordinates;
      if (coordinates.length > 1) {
        this.ctx.beginPath();
        this.ctx.moveTo(coordinates[0].x, coordinates[0].y);
        for (let i = 1; i < coordinates.length; i++) {
          this.ctx.lineTo(coordinates[i].x, coordinates[i].y);
        }
        this.ctx.stroke();
        this.ctx.closePath();
      }
    }
  }

  // 清空 canvas
  cleanCanvas() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  onWindowResize = () => {
    const clientWidth = document.getElementById("canvas").clientWidth;
    this.setState({actualSettingWidthRate: clientWidth / this.canvasWidth});
  };

  initCanvas() {
    this.ctx = document.getElementById("canvas").getContext('2d');
    this.ctx.lineWidth = 4;
    this.ctx.strokeStyle = '#D32F2F'; // todo temp
    this.reRenderTeacherNoteVOList();
  }

  stopScroll(e) {
    if (e._isScroller) return;
    e.preventDefault();
  }
}
