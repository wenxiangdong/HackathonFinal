import React from "react";

import "./../../CanvasCommon.css"
import Logger from "../../../utils/logger";
import type {LiveLessonData, TeacherNoteItemVO} from "../../../vo/vo";
import {apiHub} from "../../../apis/ApiHub";
import type {IStudentApi} from "../../../apis/student-api";
import WebsocketPublisher from "../../../utils/websocket-publisher";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import Button from "@material-ui/core/Button/Button";

import "./../../../components/common/Dialog.css"
import type {Subscriber} from "../../../utils/websocket-publisher";


interface IState {
  lessonEnded: boolean
}

interface IProp {
}

/**
 * Ongoing
 * @create 2019/5/26 14:21
 */
export default class Ongoing extends React.Component<IProp, IState> implements Subscriber {

  logger = Logger.getLogger("Ongoing");
  lessonId;
  webSocketUrl;
  webSocketPublisher;
  _studentApi: IStudentApi;


  // 这里是指 canvas 在 HTML 中实际的尺寸，会受到 CSS 宽度的限制，但是实际点坐标什么的都以这个为准
  canvasWidth = 3200;
  canvasHeight = 1800;

  teacherNoteVOList: TeacherNoteItemVO[] = [];

  ctx;

  constructor(props) {
    super(props);
    this.lessonId = props.match.params.id;
    this._studentApi = apiHub.studentApi;
    this.state = {
      lessonEnded: false
    }
  }

  render(): React.ReactNode {

    const canvasView = (
      <div className={"canvas-padding"}>
        <div className={'canvas-box'}>
          <canvas id={"canvas"}
                  width={this.canvasWidth + "px"}
                  height={this.canvasHeight + "px"}/>
        </div>
        {/*/!*<button onClick={() => this.click()}>looo</button>*!/*/}
        {/*<button onClick={() => this.changeMode("paint")}>paint</button>*/}
        {/*<button onClick={() => this.changeMode("erase")}>erase</button>*/}
      </div>
    );

    let lessonEndedDialog = this.state.lessonEnded
      ? (
        <Dialog
          open={true}
          onClose={() => this.returnHomePage()}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">警告</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              课程已结束
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.returnHomePage()} color="primary">
              返回主页
            </Button>
            <Button onClick={() => this.jumpToReviewPage()} color="primary" autoFocus>
              继续复习
            </Button>
          </DialogActions>
        </Dialog>
      )
      : null
    ;

    return (
      <div>
        {lessonEndedDialog}
        {canvasView}
      </div>
    );
  }


  returnHomePage = () => {
    this.props.history.goBack();
  };

  jumpToReviewPage = () => {
    this.props.history.goBack();
    this.props.history.push(`/Student/LessonOnGoing/${this.lessonId}`);
  };

  async componentDidMount() {
    try {
      const res = await this._studentApi.joinLesson(this.lessonId);
      this.webSocketUrl = res;
      this.webSocketPublisher = new WebsocketPublisher(this.webSocketUrl);
      this.webSocketPublisher.subscribe(this);
    } catch (e) {
      this.logger.error(e);
    }

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

    this.webSocketPublisher && this.webSocketPublisher.unsubscribe(this);
  }


  // 监听websocket所需的几个方法
  onError = (e) => {
    this.logger.error(e);
  };

  onClose = () => {
    this.webSocketPublisher.unsubscribe(this);
  };

  onNext = (res: LiveLessonData) => {
    this.logger.info(res);
    if (res.operationType === "CREATE") {
      this.teacherNoteVOList.push(res.teacherNoteItem);
      this.reRenderTeacherNoteVOList();
    } else if (res.operationType === "DELETE") {
      this.deleteTeacherNoteItem(res.teacherNoteItem);
      this.reRenderTeacherNoteVOList();
    } else if (res.operationType === "UPDATE") {
      this.updateTeacherNoteItem(res.teacherNoteItem);
      this.reRenderTeacherNoteVOList();
    } else {
      this.endLesson();
    }
  }


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

  endLesson() {
    this.setState({lessonEnded: true});
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
