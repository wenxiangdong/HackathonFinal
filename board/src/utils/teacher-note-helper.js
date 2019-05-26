export const NoteTypes = {
  HANDWRITING: "HANDWRITING",
  PDF: "PDF",
  TEXT: "TEXT"
};
/**
 * 生成格式化的内容
 * @param type NoteTypes中的一个
 * @param params 参数
 */
export const formatContent = (type: String, params: {content: string, page?: number}): string => {
  // 手写 content "handwriting?type=HANDWRITING"
// pdf content "${url}?type=PDF&page=${page}"
// text content "${text}?type=TEXT"
  switch (type) {
    case NoteTypes.HANDWRITING:
      return `${params.content}?type=${NoteTypes.HANDWRITING}`;
    case NoteTypes.PDF:
      return `${params.content}?type=${NoteTypes.PDF}&page=${params.page}`;
    case NoteTypes.TEXT:
      return `${params.content}?type=${NoteTypes.TEXT}`;
    default:
      return params.content;
      break;
  }
};

/**
 * 解析内容
 * @param content
 */
export const parseContent = (content: string): {type: string, content: string, page: number} => {
  let [content, params] = content.split("?");
  let result = {};
  if (params) {
    result = params
      .split("&")
      .map(keyValue => {
        const [key, value] = keyValue.split("=");
        return {[key]: value}
      })
      .reduce((pre, cur) => ({...pre, ...cur}), {});
  }
  result.content = content;
  return result;
};
