import React from "react";

import "./../../CanvasCommon.css"
import Logger from "../../../utils/logger";
import type {TeacherNoteItemVO} from "../../../vo/vo";
import {Point} from "../../../vo/vo";


interface IState {
  // 很重要的参数，一般大于 1 ，是在 canvas 中位置的放缩比例
  actualSettingWidthRate: string,
  // paint or erase
  mode: string
}

interface IProp {
  initTeacherNoteItemVOs?: TeacherNoteItemVO[];
}

/**
 * Ongoing
 * @create 2019/5/26 14:21
 */
export default class Ongoing extends React.Component<IProp, IState> {

  logger = Logger.getLogger();

  // 这里是指 canvas 在 HTML 中实际的尺寸，会受到 CSS 宽度的限制，但是实际点坐标什么的都以这个为准
  canvasWidth = 3200;
  canvasHeight = 1800;

  teacherNoteVOList: TeacherNoteItemVO[] = [];

  ctx;

  constructor(props) {
    super(props);
    this.state = {
      actualSettingWidthRate: 1,
      mode: "paint"
    };

    if (this.props.initTeacherNoteItemVOs) {
      // 偷懒的深拷贝
      this.teacherNoteVOList = JSON.parse(JSON.stringify(this.props.initTeacherNoteItemVOs));
    }
  }

  render(): React.ReactNode {
    const {mode} = this.state;

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
        <button onClick={() => this.changeMode("paint")}>paint</button>
        <button onClick={() => this.changeMode("erase")}>erase</button>
      </div>
    );

    return (
      <div>
        {canvasView}
      </div>
    );
  }

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

  stopScroll(e) {
    if (e._isScroller) return;
    e.preventDefault();
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


  onWindowResize = () => {
    const clientWidth = document.getElementById("canvas").clientWidth;
    this.setState({actualSettingWidthRate: clientWidth / this.canvasWidth});
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


  initCanvas() {
    this.ctx = document.getElementById("canvas").getContext('2d');
    this.ctx.lineWidth = 4;
    this.ctx.strokeStyle = '#D32F2F'; // todo temp
    this.reRenderTeacherNoteVOList();
  }

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

  finishDraw(paint) {
    this.teacherNoteVOList.push({
      id: 0,
      page: 1,
      color: "red",
      content: "123123",
      coordinates: paint,
      createTime: 123
    })
  }


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

  erasePointNearbyArea(x, y) {
    // 循环 voList 检测有没有临近的点，如果有就直接删掉
    for (let i = 0; i < this.teacherNoteVOList.length; i++) {
      let vo = this.teacherNoteVOList[i];
      // if (!vo) {
      //   this.logger.info(this.teacherNoteVOList);
      // } else {
      for (let j = 0; j < vo.coordinates.length; j++) {
        let point = vo.coordinates[j];
        if (this.checkIsNearBy(x, y, point.x, point.y)) {
          // this.teacherNoteVOList.splice(i, 1);
          vo.coordinates = [];
        }
      }
      // if (i === 0) {
      //   break;
      // }
      // }
    }
    this.reRenderTeacherNoteVOList();
  }

  // 对比 (x1, y1) 和 (x2, y2) 点的距离是否比较接近
  checkIsNearBy(x1, y1, x2, y2) {
    const distance = 40;
    const actual = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    this.logger.info(actual);
    return actual < distance;
  }
}
