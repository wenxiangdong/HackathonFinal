import React from "react";

import "./../../CanvasCommon.css"
import "./Index.css";
import Logger from "../../../utils/logger";
import type {TeacherNoteItemVO} from "../../../vo/vo";
import {Point} from "../../../vo/vo";
import Drawer from "@material-ui/core/Drawer/Drawer";
import Divider from "@material-ui/core/Divider/Divider";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";

import InboxIcon from "@material-ui/icons/Inbox"
import Fab from "@material-ui/core/Fab/Fab";
import PDFLoader from "../../../components/teacher/PDFLoader/PDFLoader";
import PDFPreviewer from "../../../components/teacher/PDFPreviewer/PDFPreviewer";
import Typography from "@material-ui/core/Typography";

import LeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import RightIcon from "@material-ui/icons/KeyboardArrowRight";
import IconButton from "@material-ui/core/IconButton";
import {drawNoteList} from "../../../utils/draw-teacher-note";
import {formatContent, NoteTypes} from "../../../utils/teacher-note-helper";
import {apiHub} from "../../../apis/ApiHub";

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
}

interface IProp {
  initTeacherNoteItemVOs?: TeacherNoteItemVO[];
}

/**
 * Ongoing
 * @create 2019/5/26 14:21
 */
export default class Index extends React.Component<IProp, IState> {

  logger = Logger.getLogger(Index.name);

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
      pageIndex: 0
    };

    if (this.props.initTeacherNoteItemVOs) {
      // 偷懒的深拷贝
      this.teacherNoteVOList = JSON.parse(JSON.stringify(this.props.initTeacherNoteItemVOs));
    }
  }

  // 处理PDFPreviewer的导出事件
  handleImportPages = (pdf, indexes: number[]) => {
    this.logger.info(pdf, indexes);
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
      this.logger.info("vo", vo);
      return apiHub.teacherApi.sendTeacherNote(vo);
    });
    Promise.all(promises)
      .then(vos => {
        this.logger.info("get vos", vos);
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
      .catch(e => {
        this.logger.error(e);
      })
  };

  handleClickSwitchPage = (offset) => {
    this.logger.info(offset);
    let {pageIndex, pages} = this.state;
    pageIndex += offset;
    if (pageIndex >= pages.length) {
      pages.push([]);
    }
    this.setState({
      pages,
      pageIndex
    }, () => {
      this.reRenderPage(pages[pageIndex]);
    });
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
          <Typography variant="h5" gutterBottom>
            工具栏
          </Typography>
          <Divider/>
          <div className={"tool-item-wrapper"}><PDFLoader onSelectPDF={(pdf) => this.setState({selectedPdfUrl: pdf.url})}/></div>
          <div className={"tool-item-wrapper"}><PDFPreviewer src={this.state.selectedPdfUrl} onImportPages={this.handleImportPages}/></div>
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
          <InboxIcon/>
        </Fab>
      </div>
    );

    // 切换页面的按钮
    const pageButtons = (
      <div className={"page-button-wrapper"}>
        <IconButton disabled={this.state.pageIndex <= 0} onClick={() => this.handleClickSwitchPage(-1)}>
          <LeftIcon/>
        </IconButton>
        <IconButton onClick={() => this.handleClickSwitchPage(1)}>
          <RightIcon/>
        </IconButton>
      </div>
    );

    return (
      <div className={"main-box"}>
        {canvasView}
        {drawer}
        {pageButtons}
        {fab}
      </div>
    );
  }

  openDrawer() {
    this.logger.info(123);
    this.setState({open: true})
  }

  toggleDrawer = () => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    this.setState({open: false});
  };

  componentDidMount() {
    document.body.addEventListener('resize', this.onWindowResize)
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
    // todo
    const noteVO = {
      id: 0,
      page: this.state.pageIndex,
      color: "red",
      content: formatContent(NoteTypes.HANDWRITING,{content: ""}),
      coordinates: paint,
      createTime: 123
    };
    apiHub.teacherApi.sendTeacherNote(noteVO)
      .then(res => {
        const {pageIndex, pages} = this.state;
        pages[pageIndex].push(res);
      })
      .catch();
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
    this.logger.info("更新页面", voList);
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
    // this.logger.info(actual);
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
    this.ctx.strokeStyle = '#D32F2F'; // todo temp
    // this.reRenderTeacherNoteVOList();
    this.reRenderPage([]);
  }

  stopScroll(e) {
    if (e._isScroller) return;
    e.preventDefault();
  }
}
