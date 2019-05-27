import React from "react";

import "../../CanvasCommon.css"
import "./Index.css";
import Logger from "../../../utils/logger";
import type {TeacherNoteBookVO, TeacherNoteItemVO} from "../../../vo/vo";
import Drawer from "@material-ui/core/Drawer/Drawer";
import Divider from "@material-ui/core/Divider/Divider";

import ToolIcon from "@material-ui/icons/Build"
import Fab from "@material-ui/core/Fab/Fab";
import PDFLoader from "../../../components/teacher/PDFLoader/PDFLoader";
import PDFPreviewer from "../../../components/teacher/PDFPreviewer/PDFPreviewer";
import Typography from "@material-ui/core/Typography";

import LeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import RightIcon from "@material-ui/icons/KeyboardArrowRight";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import {drawNoteList} from "../../../utils/draw-teacher-note";
import {formatContent, NoteTypes} from "../../../utils/teacher-note-helper";
import {apiHub} from "../../../apis/ApiHub";
import ColorPicker from "../../../components/common/ColorPicker/ColorPicker";
import TextField from "@material-ui/core/TextField";
import {withSnackbar} from "notistack";
import Button from "@material-ui/core/Button";

import localStorageHelper from "./../../../utils/local-storage-helper"
import FullScreenLoading from "../../../components/common/FullScreenLoading/FullScreenLoading";
import type {HttpResponse} from "../../../apis/http";
import {error} from "../../../utils/snackbar-helper";
import withToolBar from "../../hocs/withToolBar";

interface IState {
  // 很重要的参数，一般大于 1 ，是在 canvas 中位置的放缩比例
  actualSettingWidthRate: string,
  // paint or erase
  mode: string,
  open: boolean,
  selectedPdfUrl: string,
  // pdf 那个pdfjsLib的一个api对象
  // pdf.getPage(1).then(function(page) {
  //   // you can now use *page* here
  // });
  pdbjsPDF: any;

  pages: TeacherNoteItemVO[][];
  pageIndex: number;
  selectedColor: string;

  loading: boolean;
}

interface IProp {
  initTeacherNoteItemVOs?: TeacherNoteItemVO[];
  enqueueSnackbar?: () => void;
}

/**
 * Ongoing
 * @create 2019/5/26 14:21
 */
class Index extends React.Component<IProp, IState> {

  _logger = Logger.getLogger(Index.name);

  // 这里是指 canvas 在 HTML 中实际的尺寸，会受到 CSS 宽度的限制，但是实际点坐标什么的都以这个为准
  canvasWidth = 3200;
  canvasHeight = 1800;

  teacherNoteVOList: TeacherNoteItemVO[] = [];

  ctx;

  constructor(props) {
    super(props);
    this.state = {
      actualSettingWidthRate: 1,
      mode: "paint",
      open: false,
      selectedPdfUrl: "",
      pages: [[]],
      pageIndex: 0,
      selectedColor: "#bf291c",
      loading: false
    };

    if (this.props.initTeacherNoteItemVOs) {
      // 偷懒的深拷贝
      this.teacherNoteVOList = JSON.parse(JSON.stringify(this.props.initTeacherNoteItemVOs));
    }
  }

  getBook(): TeacherNoteBookVO {
    try {
      return localStorageHelper.getBook();
    } catch (e) {
      this._logger.error(e);
    }
  }

  getBookId = () => {
    return this.getBook().id;
  };

  getLessonId = () => {
    return this.getBook().lessonId;
  };

  handleSelectColor = (color) => {
    this.setState({
      selectedColor: color
    })
  };

  // 处理PDFPreviewer的导出事件
  handleImportPages = (pdf, indexes: number[]) => {
    this._logger.info(pdf, indexes);
    this.setState({loading: true});
    const {selectedPdfUrl} = this.state;
    // 请求api
    const promises = indexes.map(index => {
      const vo: TeacherNoteItemVO = {
        id: 0,
        page: this.state.pageIndex,
        color: "red",
        content: formatContent(NoteTypes.PDF,{content: selectedPdfUrl, page: index}),
        coordinates: [{x: 0, y: 0}],
        createTime: 123
      };
      this._logger.info("vo", vo);
      return apiHub.teacherApi.sendTeacherNote(this.getBookId(), vo);
    });
    Promise.all(promises)
      .then(vos => {
        this._logger.info("get vos", vos);
        // 插多几页
        let {pages, pageIndex} = this.state;
        pages = [...pages, ...vos.map(vo => [vo])];
        pageIndex = pages.length - 1;
        this.setState({
          pageIndex,
          pages
        }, () => {
          this.reRenderPage(pages[pageIndex]);
        });
      })
      .catch((e) => this.handleError(e));
  };

  handleClickSwitchPage = (offset) => {
    this._logger.info(offset);
    let {pageIndex, pages} = this.state;
    pageIndex += offset;
    if (pageIndex >= pages.length) {
      pages.push([]);
      this.props.enqueueSnackbar("新建页面");
    }
    this.setState({
      pages,
      pageIndex
    }, () => {
      this.reRenderPage(pages[pageIndex]);
    });
  };

  handleChangePageIndex = (e) => {
    let pageIndex = parseInt(e.target.value);
    if (Number.isNaN(pageIndex)) {
      return;
    }
    if (pageIndex < 0) {
      return;
    }
    if (pageIndex >= this.state.pages.length) {
      return;
    }
    this.setState({pageIndex}, () => {
      this.reRenderPage(this.state.pages[pageIndex]);
    });
  };

  shouldComponentUpdate(nextProps: Readonly<IProp>, nextState: Readonly<IState>, nextContext: any): boolean {
    if (nextState.selectedColor !== this.state.selectedColor) {
      this.ctx.strokeStyle = nextState.selectedColor;
    }
    return true;
  }

  handleClickOver = () => {
    this.setState({loading: true});
    apiHub.teacherApi.endLesson(this.getLessonId())
      .then(() => {
        this.props.history.goBack();
      })
      .catch((e) => this.handleError(e));
  };

  handleError = (e: HttpResponse) => {
    this._logger.error(e);
    error(e.message, this);
    this.setState({loading: false});
  };

  render(): React.ReactNode {
    const {mode, open} = this.state;

    const drawer = (
      <Drawer
        variant="temporary"
        anchor="right"
        open={open}
        onClose={this.toggleDrawer()}
      >
        <div style={{width: "500px", padding: "16px"}}>
          <Typography variant="h6" gutterBottom>
            选择颜色
          </Typography>
          <div className={"tool-item-wrapper"}><ColorPicker selectColor={this.state.selectedColor} onColorSelect={this.handleSelectColor}/></div>
          <Divider/>
          <div className={"tool-item-wrapper"}><PDFLoader onSelectPDF={(pdf) => this.setState({selectedPdfUrl: pdf.url})}/></div>
          <div className={"tool-item-wrapper"}><PDFPreviewer src={this.state.selectedPdfUrl} onImportPages={this.handleImportPages}/></div>
          <Divider/>
          <div className={"tool-item-wrapper"}>
            <Button variant="contained" color={"primary"} fullWidth onClick={this.handleClickOver}>下课</Button>
          </div>
        </div>
      </Drawer>
    );

    const canvasView = (
      <div className={"canvas-padding"}>
        <div className={'canvas-box'}>
          <canvas id={"canvas"}
                  onTouchStart={mode === "paint" ? (e) => this.touchDraw(e) : (e) => this.touchErase(e)}
                  onMouseDown={mode === "paint" ? (e) => this.draw(e) : (e) => this.erase(e)}
                  width={this.canvasWidth + "px"}
                  height={this.canvasHeight + "px"}/>
        </div>
        {/*<button onClick={() => this.click()}>looo</button>*/}
        {/*<button onClick={() => this.changeMode("paint")}>paint</button>*/}
        {/*<button onClick={() => this.changeMode("erase")}>erase</button>*/}
      </div>
    );

    const fab = (
      <div className={"fab-box"}>
        <Fab color="primary" aria-label="Add" onClick={() => this.openDrawer()}>
          <ToolIcon/>
        </Fab>
      </div>
    );

    // 切换页面的按钮
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
          {/*{this.state.pageIndex}*/}
        </span>
        <IconButton onClick={() => this.handleClickSwitchPage(1)}>
          {this.state.pageIndex === this.state.pages.length - 1 ? <AddIcon/> : <RightIcon/>}
        </IconButton>
      </div>
    );

    return (
      <div className={"main-box"}>
        {this.state.loading ? <FullScreenLoading/> : null}
        {canvasView}
        {drawer}
        {pageButtons}
        {fab}
      </div>
    );
  }

  openDrawer() {
    this._logger.info(123);
    this.setState({open: true})
  }

  toggleDrawer = () => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    this.setState({open: false});
  };

  componentDidMount() {
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
    })
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

  // 橡皮擦擦除监听
  erase(ev) {
    ev.persist();
    ev.stopPropagation();
    this.ctx.beginPath();
    let {x, y} = this.getLocation(ev);
    this.erasePointNearbyArea(x, y);

    document.onmousemove = (e) => {
      // 在按住的情况下覆盖move方法
      let {x, y} = this.getLocation(e);
      this.erasePointNearbyArea(x, y);
    };

    document.onmouseup = () => {
      // 在按住的情况下覆盖up方法
      document.onmousemove = null;
      document.onmouseup = null;
    };
  }

  // 触摸橡皮撒
  touchErase(ev) {
    ev.persist();
    ev.stopPropagation();
    ev.preventDefault();
    this.ctx.beginPath();
    let {x, y} = this.getTouchLocation(ev);
    this.erasePointNearbyArea(x, y);

    document.ontouchmove = (e) => {
      e.cancelBubble = true;
      e.stopPropagation();
      e.preventDefault();
      ev.defaultPrevented = true;
      let {x, y} = this.getTouchLocation(e);
      this.erasePointNearbyArea(x, y);
    };

    document.ontouchend = () => {
      document.ontouchmove = null;
      document.ontouchend = null;
    }
  }

  // 鼠标绘画
  draw(ev) {
    let newPaint = [];
    ev.persist();
    ev.stopPropagation();
    this.ctx.beginPath();
    let {x, y} = this.getLocation(ev);
    newPaint.push({x, y});
    this.ctx.moveTo(x, y);

    document.onmousemove = (e) => {
      // 在按住的情况下覆盖move方法
      let {x, y} = this.getLocation(e);
      this.ctx.lineTo(x, y);
      newPaint.push({x, y});
      this.ctx.stroke();
    };

    document.onmouseup = () => {
      // 在按住的情况下覆盖up方法
      document.onmousemove = null;
      this.ctx.stroke();
      this.ctx.closePath();
      this.finishDraw(newPaint);
      document.onmouseup = null;
    };
  }

  // 触摸绘画
  touchDraw(ev) {
    ev.persist();
    ev.stopPropagation();
    ev.preventDefault();
    this.ctx.beginPath();
    let {x, y} = this.getTouchLocation(ev);
    this.ctx.moveTo(x, y);

    let newPaint = [];
    newPaint.push({x, y});

    document.ontouchmove = (e) => {
      e.cancelBubble = true;
      e.stopPropagation();
      e.preventDefault();
      ev.defaultPrevented = true;
      let {x, y} = this.getTouchLocation(e);
      newPaint.push({x, y});
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    };

    document.ontouchend = () => {
      document.ontouchmove = null;
      this.ctx.stroke();
      this.ctx.closePath();
      this.finishDraw(newPaint);
      document.ontouchend = null;
    }
  }

  // 结束绘画（添加新内容等等）
  finishDraw(paint) {
    const noteVO = {
      id: 0,
      page: this.state.pageIndex,
      color: "red",
      content: formatContent(NoteTypes.HANDWRITING,{content: ""}),
      coordinates: paint,
      createTime: 123
    };
    apiHub.teacherApi.sendTeacherNote(this.getBookId(), noteVO)
      .then(res => {
        const {pageIndex, pages} = this.state;
        pages[pageIndex].push(res);
      })
      .catch((e) => this.handleError(e));
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

  reRenderPage(voList: TeacherNoteItemVO[]) {
    this.cleanCanvas();
    this._logger.info("更新页面", JSON.stringify(voList));
    drawNoteList(voList, this.ctx);
  }

  // 清空 canvas
  cleanCanvas() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  // 修改画笔的模式
  changeMode(mode) {
    // 确保不会设置成什么奇怪的模式
    if (mode === "paint") {
      this.setState({mode: "paint"})
    } else if (mode === "erase") {
      this.setState({mode: "erase"})
    }
  }

  // 判定一个点附近是否有线条需要删除
  erasePointNearbyArea(x, y) {
    // 循环 voList 检测有没有临近的点，如果有就直接删掉
    for (let i = 0; i < this.teacherNoteVOList.length; i++) {
      let vo = this.teacherNoteVOList[i];
      for (let j = 0; j < vo.coordinates.length; j++) {
        let point = vo.coordinates[j];
        if (this.checkIsNearBy(x, y, point.x, point.y)) {
          vo.coordinates = [];
        }
      }
    }
    this.reRenderTeacherNoteVOList();
  }

  // 对比 (x1, y1) 和 (x2, y2) 点的距离是否比较接近
  checkIsNearBy(x1, y1, x2, y2) {
    const distance = 40;
    const actual = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    // this._logger.info(actual);
    return actual < distance;
  }

  getLocation(ev) {
    const {actualSettingWidthRate} = this.state;
    const canvasElement = document.getElementById("canvas");
    const box = canvasElement.getBoundingClientRect();
    return {
      x: (ev.clientX - box.left) / actualSettingWidthRate,
      y: (ev.clientY - box.top) / actualSettingWidthRate
    };
  }

  getTouchLocation(ev) {
    const {actualSettingWidthRate} = this.state;
    const canvasElement = document.getElementById("canvas");
    const box = canvasElement.getBoundingClientRect();
    return {
      x: (ev.touches[0].clientX - box.left) / actualSettingWidthRate,
      y: (ev.touches[0].clientY - box.top) / actualSettingWidthRate
    };
  }

  onWindowResize = () => {
    const clientWidth = document.getElementById("canvas").clientWidth;
    this.setState({actualSettingWidthRate: clientWidth / this.canvasWidth});
  };

  initCanvas() {
    this.ctx = document.getElementById("canvas").getContext('2d');
    this.ctx.lineWidth = 4;
    this.ctx.strokeStyle = this.state.selectedColor;
    // this.reRenderTeacherNoteVOList();
    this.reRenderPage([]);
  }

  stopScroll(e) {
    if (e._isScroller) return;
    e.preventDefault();
  }
}

export default withSnackbar(withToolBar(Index));
