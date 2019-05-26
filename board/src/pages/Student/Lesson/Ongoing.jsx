import React from "react";

import "./../../CanvasCommon.css"
import Logger from "../../../utils/logger";


interface IState {
  actualSettingWidthRate: string
}

/**
 * Ongoing
 * @create 2019/5/26 14:21
 */
export default class Ongoing extends React.Component<any, IState> {

  logger = Logger.getLogger();
  canvasWidth = 1600;
  canvasHeight = 900;

  ctx;

  constructor(props) {
    super(props);
    this.state = {
      actualSettingWidthRate: 1
    };
  }


  render(): React.ReactNode {
    // 这里是指 canvas 在 HTML 中实际的尺寸，会受到 CSS 宽度的限制，但是实际点坐标什么的都以这个为准


    // 很重要的参数，一般大于 1 ，是在 canvas 中位置的放缩比例



    const canvasView = (
      <div className={"canvas-padding"}>
        <div className={'canvas-box'}>
          <canvas id={"canvas"} onMouseDown={(e) => this.draw(e)} width={this.canvasWidth + "px"}
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
    window.addEventListener('resize', this.onWindowResize.bind(this))
    this.onWindowResize();
    this.initCanvas();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize.bind(this))
  }


  onWindowResize () {
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

  initCanvas () {
    this.ctx = document.getElementById("canvas").getContext('2d');
    this.ctx.lineWidth = 4;
    this.ctx.strokeStyle = '#D32F2F'; // todo temp

    this.ctx.beginPath();
    this.ctx.moveTo(75, 50);
    this.ctx.lineTo(100, 75);
    this.ctx.lineTo(100, 25);
    this.ctx.stroke();
  }

  draw(ev) {
    ev.persist();
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

}
