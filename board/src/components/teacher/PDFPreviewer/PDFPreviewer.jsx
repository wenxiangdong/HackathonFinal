import "./PDFPreviewer.css";
import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Logger from "../../../utils/logger";
import type {PDFFile} from "../PDFLoader/PDFLoader";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";

interface IProp {
  src: string,
  // 选中了哪些pdf页
  // pdf 那个pdfjsLib的一个api对象
  // pdf.getPage(1).then(function(page) {
  //   // you can now use *page* here
  // });
  // @see https://mozilla.github.io/pdf.js/examples/
  onImportPages: (pdf: any, pageIndexes: Number[]) => void;
}

interface IState {
  pdf: PDFFile,
  pageNums: number
}

class PDFPreviewer extends React.Component<IProp, IState> {
  _logger = Logger.getLogger(PDFPreviewer.name);

  _baseCanvasId = "pdf-canvas";

  _canvasWidth = 800;

  state = {
    pdf: null,
    pageNums: 0
  };

  shouldComponentUpdate(nextProps: Readonly<IProp>, nextState: Readonly<S>, nextContext: any): boolean {
    if (nextProps.src !== this.props.src) {
      // eslint-disable-next-line no-undef
      const task = pdfjsLib.getDocument(nextProps.src);
      task.promise.then(pdf => {
        this._logger.info(pdf);
        this.setState({
          pageNums: pdf.numPages,
          pdf: pdf
        }, () => {
          this.loadPdf(pdf);
        });
      }).catch(e => {
        this._logger.error(e);
      });
    }
    return true;
  }


  loadPdf(pdf) {
    Array(this.state.pageNums)
      .fill("")
      .forEach((_, index) =>
        pdf.getPage(index + 1)
          .then(page => {
            const viewport = page.getViewport({scale: 1,});
            this._logger.info("viewpoint", viewport);
            const scale = this._canvasWidth / viewport.width;
            this._logger.info("scale", scale);
            const scaledViewport = page.getViewport({scale: scale,});
            this._logger.info("viewpoint", scaledViewport);
            const canvas = document.getElementById(this._baseCanvasId + index);
            canvas.width = scaledViewport.width;
            canvas.height = scaledViewport.height;
            this._logger.info(canvas);
            const context = canvas.getContext('2d');
            const renderContext = {
              canvasContext: context,
              viewport: scaledViewport
            };
            page.render(renderContext);
          })
          .catch(e => {
            this._logger.error(e);
          })
      )
  }

  handleSelectPages = (indexes: Number[]) => {
    const pdf = this.state.pdf;
    const {onImportPages = () => null} = this.props;
    if (pdf) {
      onImportPages(pdf, indexes);
    }
  };

  handleClickExportAll = () => {
    let indexes = Array(this.state.pageNums)
      .fill(1)
      .map((_, index) => index + 1);
    this.handleSelectPages(indexes);
  };

  render(): React.ReactNode {
    const {pageNums} = this.state;
    const canvasList = Array(pageNums).fill("").map((_, index) => (
      <div
        onClick={() => this.handleSelectPages([index])}
        className={"PP__canvas-wrapper"}
        key={this._baseCanvasId + index}>
        <canvas className={"PP__canvas"} id={this._baseCanvasId + index} width={this._canvasWidth}/>
        {/*<Button className={"PP__canvas-btn"} onClick={() => this.handleSelectPages([index])}>导入</Button>*/}
      </div>
    ));
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            PDF预览
          </Typography>
          <div className={"PP__list-wrapper"}>
            {pageNums ? canvasList : "暂无预览"}
          </div>
          {pageNums ? <Typography variant="subtitle1" gutterBottom>
            共{pageNums}页
          </Typography> : null}
        </CardContent>
        <CardActions>
          <Button color="primary" onClick={this.handleClickExportAll}>全部导入</Button>
        </CardActions>
      </Card>
    );
  }
}

export default PDFPreviewer;
