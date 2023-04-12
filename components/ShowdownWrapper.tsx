import showdown from 'showdown';

// Tạo một instance của showdown
const converter = new showdown.Converter();

// Hàm chuyển đổi Markdown sang HTML
export const markdownToHtml = (markdown: string):string => {
  return converter.makeHtml(markdown);
};