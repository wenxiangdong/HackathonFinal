import React from "react";
// import type {LessonVO} from "../vo/vo";
import WebsocketPublisher from "../utils/websocket-publisher";
import Logger from "../utils/logger";
import PDFLoader from "../components/teacher/PDFLoader/PDFLoader";
import PDFPreviewer from "../components/teacher/PDFPreviewer/PDFPreviewer";

export default class Dev extends React.Component {
  state = {pdf: {}};
  // lessons: LessonVO[] = [
  //   {
  //     id: 1,
  //     name: "名称",
  //     startTime: new Date().getTime()
  //   },
  //   {
  //     id: 2,
  //     name: "名称",
  //     startTime: new Date().getTime()
  //   },
  //   {
  //     id: 3,
  //     name: "名称",
  //     startTime: new Date().getTime()
  //   },
  // ];
  _logger = Logger.getLogger(Dev.name);

  componentDidMount(): void {
    new WebsocketPublisher("ws://127.0.0.1:4300").subscribe({
      onError: (e) => {this._logger.error(e)}
    });
  }

  handleSelectPDF = (pdf) => {
    this.setState({
      pdf
    });
    this._logger.info(pdf);
    // eslint-disable-next-line no-undef
    const task = pdfjsLib.getDocument(pdf.url);
    task.promise.then(pdf => {
      this._logger.info(pdf);
      pdf.getPage(1)
        .then(page => {
          // you can now use *page* here
          var scale = 1.5;
          var viewport = page.getViewport({ scale: scale, });
          var canvas = document.getElementById("my-canvas");
          this._logger.info(canvas);
          var context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          var renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          page.render(renderContext);
        })
        .catch(e => {
          this._logger.error(e);
        })
    }).catch(e => {
      this._logger.error(e);
    });
  };

  render() {
    return (
      <div>
        <PDFLoader onSelectPDF={this.handleSelectPDF}/>
        <PDFPreviewer src={this.state.pdf.url} onImportPages={this._logger.info}/>
        <canvas id="my-canvas"/>
      </div>
    );
  }
}
