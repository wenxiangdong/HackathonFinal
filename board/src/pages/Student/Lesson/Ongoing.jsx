import React from "react";

import "./../../CanvasCommon.css"
import "./Ongoing.css";
import Logger from "../../../utils/logger";
import type {LessonVO, TeacherNoteItemVO, LiveLessonData, StudentNoteItemVO} from "../../../vo/vo";
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
import {STUDENT_LESSON_REVIEW} from "../../../utils/router-helper";

import localStorageHelper from "./../../../utils/local-storage-helper"
import StudentNoteList from "../../../components/student/StudentNoteList/StudentNoteList";
import NoteInput from "../../../components/student/NoteInput/NoteInput";
import {drawNoteList} from "../../../utils/draw-teacher-note";
import Fab from "@material-ui/core/Fab";
import Typography from "@material-ui/core/Typography";
import {withSnackbar} from "notistack";
import withToolBar from "../../hocs/withToolBar";
import {error} from "../../../utils/snackbar-helper";

interface IState {
  lessonEnded: boolean;
  pages: TeacherNoteItemVO[][];
  pageIndex: number;
  noteList: StudentNoteItemVO[];
  hide: boolean;
}

interface IProp {
  enqueueSnackbar?: () => void;
}

/**
 * Ongoing
 * @create 2019/5/26 14:21
 */
class Ongoing extends React.Component<IProp, IState> implements Subscriber {

  _logger = Logger.getLogger("Ongoing");
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
    this._studentApi = apiHub.studentApi;
    this.state = {
      lessonEnded: false,
      pages: [[]],
      pageIndex: 0,
      noteList: [],
      hide: false
    }
  }

  getLesson():LessonVO {
    try {
      return localStorageHelper.getLesson();
    } catch (e) {
      this._logger.error(e);
    }
  }

  getDataSet = () => {
    return [{
      label: "我的笔记",
      data: [...this.state.noteList]
    }]
  };

  render(): React.ReactNode {

    const {hide} = this.state;

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

    const footer = (<NoteInput onSend={this.handleInputSend}/>);

    return (
      <div>
        {lessonEndedDialog}
        {canvasView}
        <div className={`Ongoing__note-list-wrapper ${hide? `Ongoing__note-list-wrapper-hide`:``}`}>
          <div className={'hide-area'}  onClick={this.handleNoteClick}>点击此处{hide? "显示": "隐藏"}笔记</div>
          <StudentNoteList
            onSelect={this.handleSelectNote}
            onDelete={this.handleDeleteNote}
            onUpdate={this.handleEditNote}
            dataSets={this.getDataSet()}
            footer={footer}/>
        </div>
        <div style={{position: "fixed", bottom: "8px", margin:"0 auto", width: "100px", left: "0", right: "0", textAlign: "center"}}>
          <Fab size={"small"} disableRipple={true}>
            <Typography variant="button">
              {this.state.pageIndex}
            </Typography>
          </Fab>
        </div>
      </div>
    );
  }

  handleNoteClick = (e) => {
    e.persist();
    e.stopPropagation();
    const {hide} = this.state;
    this.setState({hide: !hide})
  };

  handleDeleteNote = (note: StudentNoteItemVO) => {
    const {noteList} = this.state;
    noteList.splice(
      noteList.findIndex(item => note.id === item.id),
      1
    );
    apiHub.studentApi.deleteStudentNote(localStorageHelper.getBook().id, note.id);
    this.setState({
      noteList
    });
  };

  handleEditNote = (note: StudentNoteItemVO) => {
    const {noteList} = this.state;
    this._logger.info("更新", note);
    noteList.splice(
      noteList.findIndex(item => note.id === item.id),
      1,
      note
    );

    apiHub.studentApi.updateStudentNote(localStorageHelper.getBook().id, note);
    this.setState({
      noteList
    });
  };

  handleSelectNote = (note: StudentNoteItemVO) => {
  //  TODO
  };


  handleInputSend = async (text: string) => {
    this._logger.info(text);
    const vo: StudentNoteItemVO = {
      id: 0,
      content: text,
      teacherNoteItemId: 0,
    };
    apiHub.studentApi.writeStudentNote(localStorageHelper.getBook().id, vo);

    this.setState(pre => ({
      noteList: [...pre.noteList, vo]
    }));
  };


  returnHomePage = () => {
    this.props.history.goBack();
  };

  jumpToReviewPage = () => {
    this.props.history.goBack();
    this.props.history.push(STUDENT_LESSON_REVIEW);
  };

  async componentDidMount() {
    try {
      const res = await this._studentApi.joinLesson(this.getLesson().id);
      this.webSocketUrl = res;
      this.webSocketPublisher = new WebsocketPublisher(this.webSocketUrl);
      this.webSocketPublisher.subscribe(this);
    } catch (e) {
      this._logger.error(e);
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
    this._logger.error(e);
    error(e.message, this);
  };

  onClose = () => {
    this.webSocketPublisher.unsubscribe(this);
  };

  onNext = (res: LiveLessonData) => {
    this._logger.info(res);
    if (res.operationType === "CREATE") {
      this.addTeacherNoteItem(res.teacherNoteItem);
    } else if (res.operationType === "DELETE") {
      this.deleteTeacherNoteItem(res.teacherNoteItem);
    } else if (res.operationType === "UPDATE") {
      this.updateTeacherNoteItem(res.teacherNoteItem);
    } else {
      this.endLesson();
    }
  };

  addTeacherNoteItem(vo: TeacherNoteItemVO) {
    let {pageIndex, pages} = this.state;
    for (let i = pageIndex; i <= vo.page; i++) {
      pages.push([]);
    }
    pageIndex = vo.page;
    pages[pageIndex].push(vo);
    this.setState({
      pageIndex,
      pages
    }, () => {
      this.reRenderTeacherNoteVOList()
    });
  }

  deleteTeacherNoteItem(vo: TeacherNoteItemVO) {
    let {pages} = this.state;
    const page = pages[vo.page];
    if (!page) {
      return;
    }
    page.splice(
      page.findIndex(item => item.id === vo.id),
      1
    );
    pages[vo.page] = page;
    this.setState({
      pages
    }, () => {
      this.reRenderTeacherNoteVOList()
    });
  }

  updateTeacherNoteItem(vo: TeacherNoteItemVO) {
    let {pages} = this.state;
    const page = pages[vo.page];
    page.splice(
      page.findIndex(item => item.id === vo.id),
      1,
      vo
    );
    pages[vo.page] = page;
    this.setState({
      pages
    }, () => {
      this.reRenderTeacherNoteVOList()
    });
  }

  endLesson() {
    this.setState({lessonEnded: true});
  }

  // 重新渲染列表里的笔画
  reRenderTeacherNoteVOList() {
    this.cleanCanvas();
    const {pages, pageIndex} = this.state;
    drawNoteList(pages[pageIndex]);
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

export default withSnackbar(withToolBar(Ongoing));
