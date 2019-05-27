import React from "react";
import "./../../CanvasCommon.css"

import "./Review.css";
import Logger from "../../../utils/logger";
import type {Point, StudentNoteBookVO, StudentNoteItemVO, TeacherNoteBookVO, TeacherNoteItemVO} from "../../../vo/vo";
import {apiHub} from "../../../apis/ApiHub";
import type {IStudentApi} from "../../../apis/student-api";
import type {ICommonApi} from "../../../apis/common-api";
import Fab from "@material-ui/core/Fab/Fab";
import EditIcon from "@material-ui/icons/Edit";
import NoteBookListDialog from "../../../components/student/NoteBookListDialog/NoteBookListDialog";
import localStorageHelper from "../../../utils/local-storage-helper";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";

import LeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import RightIcon from "@material-ui/icons/KeyboardArrowRight";
import FullScreenLoading from "../../../components/common/FullScreenLoading/FullScreenLoading";
import {withSnackbar} from "notistack";
import withToolBar from "../../hocs/withToolBar";
import Button from "@material-ui/core/Button";
import StudentNoteList from "../../../components/student/StudentNoteList/StudentNoteList";
import {drawNoteList} from "../../../utils/draw-teacher-note";

interface IState {
  lessonEnded: boolean,
  showPickDialog: boolean,
  pages: TeacherNoteItemVO[][],
  pageIndex: number;
  noteBooks: StudentNoteBookVO[],
  hide: boolean
}

interface IProp {
  initTeacherNoteItemVOs?: TeacherNoteItemVO[];
}


/**
 * Review
 * @create 2019/5/26 14:22
 */
class Review extends React.Component<IProp, IState> {

  logger = Logger.getLogger();
  lessonId;
  _studentApi: IStudentApi;
  _commonApi: ICommonApi;

  studentNoteBookVOList: StudentNoteBookVO[];


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
    this.state = {
      lessonEnded: false,
      showPickDialog: false,
      pages: [[]],
      pageIndex: 0,
      hide: false,
      noteBooks: []
    }
  }

  handleCloneBook = (book: StudentNoteBookVO) => {
    this.setState((pre) => ({
      noteBooks: [...pre.noteBooks, book]
    }))
  };

  getDataSet = () => {
    return this.state.noteBooks.map(
      (book: StudentNoteBookVO) => ({
        label: book.studentId,
        data: book.items
      })
    );
  };

  handleClickSwitchPage = (offset) => {
    this.logger.info(offset);
    let {pageIndex, pages} = this.state;
    pageIndex += offset;
    this.setState({
      pages,
      pageIndex
    }, () => {
      this.reRenderTeacherNoteVOList();
    });
  };

  handleSelectNote = (note: StudentNoteItemVO) => {
    const {pages} = this.state;
    for (let page of pages) {
      for (let vo: TeacherNoteItemVO of page) {
        if (vo.id == note.teacherNoteItemId) {
          const pointList = vo.coordinates;
          this.countRect(pointList);
          return;
        }
      }
    }
  };

  countRect(list: Point[]) {

    const expand = 200;

    let [top, right, bottom, left] = [0, 0, 1800, 3200];
    for (let point of list) {
      if (top < point.y) {
        top = point.y
      }
      if (right < point.x) {
        right = point.x;
      }
      if (left > point.x) {
        left = point.x
      }
      if (bottom > point.y) {
        bottom = point.y
      }
    }

    // 用left top width height，然后扩大相应的方框
    let width = right - left + expand;
    let height = top - bottom + expand;
    bottom = bottom - expand / 2;
    left = left - expand / 2;


    // ctx绘制一个半透明的矩形
    // 一段时间后删除重绘
    // 绘制矩形参考：
    this.ctx.fillStyle = 'rgba(255, 235, 59, .5)';
    this.ctx.fillRect(left, bottom, width, height);
    setTimeout (() => {
      this.reRenderTeacherNoteVOList();
    }, 2000)
  }

  render(): React.ReactNode {

    const {pages, pageIndex, hide} = this.state;

    const canvasView = (
      <div className={"canvas-padding"}>
        <div className={'canvas-box'}>
          <canvas id={"canvas"}
                  width={this.canvasWidth + "px"}
                  height={this.canvasHeight + "px"}/>
        </div>
      </div>
    );

    const fab = (
      <div className={"left-fab-box"}>
        <Fab color="primary" aria-label="note" onClick={() => this.openDialog()}>
          <EditIcon/>
        </Fab>
      </div>
    );

    const dialog = (
      <NoteBookListDialog
        lessonId={localStorageHelper.getLesson().lessonId}
        onClose={() => this.setState({showPickDialog: false})}
        onClone={this.handleCloneBook}
      />
    );

    const pageButtons = (
      <div className={"page-button-wrapper"}>
        <IconButton disabled={this.state.pageIndex <= 0} onClick={() => this.handleClickSwitchPage(-1)}>
          <LeftIcon/>
        </IconButton>
        <span>
          <TextField
            type="number"
            style={{width: "40px", textAlign: "center"}}
            value={this.state.pageIndex}
            onChange={this.handleChangePageIndex}/>
        </span>
        <IconButton disabled={pageIndex >= pages.length - 1} onClick={() => this.handleClickSwitchPage(1)}>
          <RightIcon/>
        </IconButton>
      </div>
    );

    const footer = (
      <Button onClick={() => this.setState({showPickDialog: true})}>查看同窗笔记</Button>
    );


    const noteListComponent = (
      <div className={`Ongoing__note-list-wrapper`}>
        <StudentNoteList
          listHeight={"450px"}
          onSelect={this.handleSelectNote}
          dataSets={this.getDataSet()}
          footer={footer}/>
      </div>
    );


    return (
      <div>
        {canvasView}
        {/*{fab}*/}
        {this.state.showPickDialog ? dialog : null}
        {pages.length ? pageButtons : <FullScreenLoading/>}
        {noteListComponent}
      </div>
    );
  }

  componentDidMount() {
    this._commonApi.getTeacherNoteBook(localStorageHelper.getLesson().id).then(
      (res: TeacherNoteBookVO) => {
        let noteItemVOS = res.items;
        this.logger.info(noteItemVOS);
        let pages = noteItemVOS.reduce((pre: TeacherNoteItemVO[][], cur: TeacherNoteItemVO) => {
          const index = cur.page;
          const lstItems = pre[index] || [];
          pre[index] = [...lstItems, cur];
          return pre;
        }, []);
        this.logger.info(pages);
        this.setState({
          pages
        });
        this.reRenderTeacherNoteVOList();
      }
    );

    this._studentApi.getStudentNoteBook(localStorageHelper.getLesson().id).then(
      (res: StudentNoteBookVO) => {
        this.setState({
          noteBooks: [res]
        });
      }
    ).catch(e => {
      this.logger.error(e);
    });

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
  }

  openDialog() {
    this.setState({showPickDialog: true});
    this._studentApi.getSharedNoteBook(localStorageHelper.getLesson().id).then(
      (res: StudentNoteBookVO[]) => {
        this.studentNoteBookVOList = res;
      }
    )
  }


  // 重新渲染列表里的笔画
  reRenderTeacherNoteVOList() {
    this.cleanCanvas();
    const {pages, pageIndex} = this.state;
    pages[pageIndex] && drawNoteList(pages[pageIndex], this.ctx);
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

export default withSnackbar(withToolBar(Review));
