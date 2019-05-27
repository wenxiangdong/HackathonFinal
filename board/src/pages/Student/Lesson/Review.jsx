import React from "react";
import "./../../CanvasCommon.css"
import Logger from "../../../utils/logger";
import type {StudentNoteBookVO, TeacherNoteBookVO, TeacherNoteItemVO} from "../../../vo/vo";
import {apiHub} from "../../../apis/ApiHub";
import type {IStudentApi} from "../../../apis/student-api";
import type {ICommonApi} from "../../../apis/common-api";
import Fab from "@material-ui/core/Fab/Fab";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import {withSnackbar} from "notistack";
import withToolBar from "../../hocs/withToolBar";

interface IState {
  lessonEnded: boolean,
  showPickDialog: boolean,
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
    this.state = {lessonEnded: false, showPickDialog: false, hide: false}
  }

  render(): React.ReactNode {

    const {showPickDialog} = this.state;

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

    const availableStudentNotebook = this.studentNoteBookVOList
      ? this.studentNoteBookVOList.map(
        (item) => (
          <div onClick={() => this.onSelectNotebookVO(item)}>
            <ListItem key={item.id}>
              <ListItemText
                primary={item.studentId}
                secondary={'todo 可用笔记'}/>
              {/*<ListItemSecondaryAction>*/}
              {/*<IconButton onClick={() => onSelectItem(item)} edge="end" aria-label="Delete">*/}
              {/*<AddIcon />*/}
              {/*</IconButton>*/}
              {/*</ListItemSecondaryAction>*/}
            </ListItem>
          </div>
        ))
      : null;


    const dialog = (
      <Dialog
        open={showPickDialog}
        onClose={() => this.returnHomePage()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">选取作为参照的课堂笔记</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            可用列表
          </DialogContentText>
          {availableStudentNotebook}
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
    );
    return (
      <div>
        {canvasView}
        {fab}
        {dialog}
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
  }

  openDialog() {
    this.setState({showPickDialog: true});
    this._studentApi.getSharedNoteBook(this.lessonId).then(
      (res: StudentNoteBookVO[]) => {
        this.studentNoteBookVOList = res;
      }
    )
  }

  onSelectNotebookVO(vo: StudentNoteBookVO) {
    this.setState({showPickDialog: false})
    // todo 选择了某个学生的笔记
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
