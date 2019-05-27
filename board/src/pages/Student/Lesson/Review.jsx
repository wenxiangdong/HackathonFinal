import React from "react";
import "./../../CanvasCommon.css"
import Logger from "../../../utils/logger";
import type {StudentNoteBookVO, TeacherNoteBookVO, TeacherNoteItemVO} from "../../../vo/vo";
import {apiHub} from "../../../apis/ApiHub";
import type {IStudentApi} from "../../../apis/student-api";
import type {ICommonApi} from "../../../apis/common-api";
import Fab from "@material-ui/core/Fab/Fab";
import EditIcon from "@material-ui/icons/Edit";
import NoteBookListDialog from "../../../components/student/NoteBookListDialog/NoteBookListDialog";
import localStorageHelper from "../../../utils/local-storage-helper";
import TextField from "@material-ui/core/TextField";

import LeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import RightIcon from "@material-ui/icons/KeyboardArrowRight";
import {withSnackbar} from "notistack";
import withToolBar from "../../hocs/withToolBar";
import IconButton from "@material-ui/core/IconButton/IconButton";

interface IState {
  lessonEnded: boolean,
  showPickDialog: boolean,
  pages: TeacherNoteItemVO[][],
  pageIndex: number;
  noteBook: StudentNoteBookVO
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
      pages: [],
      noteBook: undefined,
      pageIndex: 0
    }
  }

  render(): React.ReactNode {

    const {pages, pageIndex} = this.state;

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
        onClone={this.logger.info}
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
        <IconButton disabled={pageIndex >= pages.length} onClick={() => this.handleClickSwitchPage(1)}>
          <RightIcon/>
        </IconButton>
      </div>
    );


    return (
      <div>
        {canvasView}
        {fab}
        {this.state.showPickDialog ? dialog : null}
        {pages.length ? pageButtons : null}
      </div>
    );
  }

  componentDidMount() {
    this._commonApi.getTeacherNoteBook(localStorageHelper.getLesson().id).then(
      (res: TeacherNoteBookVO) => {
        let noteItemVOS = res.items;
        let pages = noteItemVOS.reduce((pre: TeacherNoteItemVO[][], cur: TeacherNoteItemVO) => {
          const index = cur.page;
          pre[index] = [...pre[index], cur];
          return pre;
        }, []);
        this.logger.info(pages);
        this.setState({
          pages
        });
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
  }

  openDialog() {
    this.setState({showPickDialog: true});
    this._studentApi.getSharedNoteBook(localStorageHelper.getLesson().id).then(
      (res: StudentNoteBookVO[]) => {
        this.studentNoteBookVOList = res;
      }
    )
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

export default withSnackbar(withToolBar(Review));
