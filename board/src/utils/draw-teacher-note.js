import type {TeacherNoteItemVO} from "../vo/vo";
import {NoteTypes, parseContent} from "./teacher-note-helper";
import Logger from "./logger";
// 手写 content "handwriting?type=handwriting"
// pdf content "${url}?type=pdf&page=${page}"
// text content "${text}?type=text"
const logger = Logger.getLogger("draw-teacher-note");

export async function drawNoteList(voList: TeacherNoteItemVO[], ctx: CanvasRenderingContext2D) {
  let list = [...voList];
  const pdfItems = list.splice(
    list.findIndex(item => parseContent(item.content).type === NoteTypes.PDF),
    1
  );
  logger.info(pdfItems, list);
  for (let vo of pdfItems) {
    await drawTeacherNote(vo, ctx);
  }
  if (pdfItems.length) {
    setTimeout(() => {
      list.forEach(vo => drawTeacherNote(vo, ctx));
    }, 1000);
  } else {
    list.forEach(vo => drawTeacherNote(vo, ctx));
  }

}

export async function drawTeacherNote(vo: TeacherNoteItemVO, ctx: CanvasRenderingContext2D) {
  let result = parseContent(vo.content);
  switch (result.type) {
    case NoteTypes.TEXT:
      break;
    case NoteTypes.HANDWRITING:
      const coordinates = vo.coordinates;
      ctx.beginPath();
      ctx.moveTo(coordinates[0].x, coordinates[0].y);
      for (let i = 1; i < coordinates.length; i++) {
        ctx.lineTo(coordinates[i].x, coordinates[i].y);
      }
      ctx.stroke();
      ctx.closePath();
      break;
    case NoteTypes.PDF:
      // eslint-disable-next-line no-undef
      const task = pdfjsLib.getDocument(result.content);
      try {
        const pdf = await task.promise;
        const page = await pdf.getPage(parseInt(result.page))
        let viewport = page.getViewport({scale: 1,});
        const rate = viewport.width / viewport.height;
        let scale = 1;
        if (rate > 16 / 9) {
          scale = 3200 / viewport.width;
        } else {
          scale = 1800 / viewport.height;
        }
        viewport = page.getViewport({scale: scale});
        const renderContext = {
          canvasContext: ctx,
          viewport: viewport
        };
        page.render(renderContext);
      } catch (e) {
        console.error(e);
      }
      break;
    default:
      console.error("mode default");
  }
}
