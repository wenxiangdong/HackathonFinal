import type {TeacherNoteItemVO} from "../vo/vo";
import {NoteTypes, parseContent} from "./teacher-note-helper";
// 手写 content "handwriting?type=handwriting"
// pdf content "${url}?type=pdf&page=${page}"
// text content "${text}?type=text"
export default function drawTeacherNote(vo: TeacherNoteItemVO, ctx: CanvasRenderingContext2D) {
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
      break;
  }
}
