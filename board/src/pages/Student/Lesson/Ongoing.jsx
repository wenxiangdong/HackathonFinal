import React from "react";

import "./../../CanvasCommon.css"
import Logger from "../../../utils/logger";


interface IState {
  // 很重要的参数，一般大于 1 ，是在 canvas 中位置的放缩比例
  actualSettingWidthRate: string
}

/**
 * Ongoing
 * @create 2019/5/26 14:21
 */
export default class Ongoing extends React.Component<any, IState> {

  logger = Logger.getLogger();

  // 这里是指 canvas 在 HTML 中实际的尺寸，会受到 CSS 宽度的限制，但是实际点坐标什么的都以这个为准
  canvasWidth = 3200;
  canvasHeight = 1800;

  ctx;

  constructor(props) {
    super(props);
    this.state = {
      actualSettingWidthRate: 1
    };
  }


  render(): React.ReactNode {
    const canvasView = (
      <div className={"canvas-padding"}>
        <div className={'canvas-box'}>
          <canvas id={"canvas"} onTouchStart={(e) => this.touchDraw(e)} onMouseDown={(e) => this.draw(e)}
                  width={this.canvasWidth + "px"}
                  height={this.canvasHeight + "px"}/>
        </div>
        {/*<button onClick={() => this.click()}>looo</button>*/}
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
    document.body.addEventListener('touchmove', this.stopScroll , {
      passive: false
    });
  }

  componentWillUnmount() {
    document.body.removeEventListener('resize', this.onWindowResize);
    document.body.removeEventListener('touchmove', this.stopScroll ,{
      passive: true
    })
  }

  stopScroll (e) {
    if(e._isScroller) return;
    e.preventDefault();
  }

  click () {
    var de = document.documentElement;
    if (de.requestFullscreen) {
      de.requestFullscreen();
    } else if (de.mozRequestFullScreen) {
      de.mozRequestFullScreen();
    } else if (de.webkitRequestFullScreen) {
      de.webkitRequestFullScreen();
    }
  }


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
  }

  draw(ev) {
    ev.persist();
    ev.stopPropagation();
    this.ctx.beginPath();
    let {x, y} = this.getLocation(ev);
    this.ctx.moveTo(x, y);

    document.onmousemove = (e) => {
      // 在按住的情况下覆盖move方法
      let {x, y} = this.getLocation(e);
      this.logger.info(x, y);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    };

    document.onmouseup = () => {
      // 在按住的情况下覆盖up方法
      document.onmousemove = null;
      this.ctx.stroke();
      this.ctx.closePath();
      document.onmouseup = null;
    };
  }

  touchDraw(ev) {

    var de = document.documentElement;
    if (de.requestFullscreen) {
      de.requestFullscreen();
    } else if (de.mozRequestFullScreen) {
      de.mozRequestFullScreen();
    } else if (de.webkitRequestFullScreen) {
      de.webkitRequestFullScreen();
    }

    this.logger.info(ev);
    ev.persist();
    ev.cancelBubble = true;
    ev.defaultPrevented = true;
    ev.stopPropagation();
    ev.preventDefault();
    this.ctx.beginPath();
    let {x, y} = this.getTouchLocation(ev);
    this.ctx.moveTo(x, y);

    document.ontouchmove = (e) => {
      e.cancelBubble = true;
      e.stopPropagation();
      e.preventDefault();
      ev.defaultPrevented = true;
      let {x, y} = this.getTouchLocation(e);
      this.logger.info(x, y);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    };

    document.ontouchend = () => {
      document.ontouchmove = null;
      this.ctx.stroke();
      this.ctx.closePath();
      document.ontouchend = null;
    }
  }


}
