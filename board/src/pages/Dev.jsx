import React from "react";
// import type {LessonVO} from "../vo/vo";
import WebsocketPublisher from "../utils/websocket-publisher";
import Logger from "../utils/logger";
// import PDFLoader from "../components/teacher/PDFLoader/PDFLoader";
import NoteInput from "../components/student/NoteInput/NoteInput";
import NoteBookListDialog from "../components/student/NoteBookListDialog/NoteBookListDialog";

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

  dataSet = [
    {
      label: "label",
      data: [
        {
          content: "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
          id: 1,
          teacherNoteItemId: 1
        },
        {
          content: "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
          id: 2,
          teacherNoteItemId: 2
        },
        {
          content: "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
          id: 3,
          teacherNoteItemId: 3
        },
      ]
    },
    {
      label: "label",
      data: [
        {
          content: "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
          id: 1,
          teacherNoteItemId: 1
        },
        {
          content: "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
          id: 2,
          teacherNoteItemId: 2
        },
        {
          content: "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
          id: 3,
          teacherNoteItemId: 3
        },
      ]
    },
    {
      label: "label",
      data: [
        {
          content: "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
          id: 1,
          teacherNoteItemId: 1
        },
        {
          content: "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
          id: 2,
          teacherNoteItemId: 2
        },
        {
          content: "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
          id: 3,
          teacherNoteItemId: 3
        },
      ]
    },
    {
      label: "label",
      data: [
        {
          content: "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
          id: 1,
          teacherNoteItemId: 1
        },
        {
          content: "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
          id: 2,
          teacherNoteItemId: 2
        },
        {
          content: "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
          id: 3,
          teacherNoteItemId: 3
        },
      ]
    },
    {
      label: "label",
      data: [
        {
          content: "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
          id: 1,
          teacherNoteItemId: 1
        },
        {
          content: "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
          id: 2,
          teacherNoteItemId: 2
        },
        {
          content: "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
          id: 3,
          teacherNoteItemId: 3
        },
      ]
    },
  ];

  componentDidMount(): void {
    // new WebsocketPublisher("ws://127.0.0.1:4300").subscribe({
    //   onError: (e) => {
    //     this._logger.error(e)
    //   }
    // });
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
          var viewport = page.getViewport({scale: scale,});
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
      <div style={{width: "400px"}}>
        {/*<StudentNoteList*/}
          {/*footer={<NoteInput onSend={this._logger.info}/>}*/}
          {/*dataSets={this.dataSet}*/}
          {/*onSelect={this._logger.info}*/}
          {/*onDelete={this._logger.info}*/}
          {/*onUpdate={this._logger.info}/>*/}
          <NoteBookListDialog lessonId={"1"} onClone={this._logger.info}/>
      </div>
    );
  }
}
