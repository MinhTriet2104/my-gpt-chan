import showdown from 'showdown';
import showdownHighlight from 'showdown-highlight';
import 'highlight.js/styles/base16/dracula.css';

// Tạo một instance của showdown
const converter = new showdown.Converter({
  extensions: [showdownHighlight({
    // Whether to add the classes to the <pre> tag, default is false
    pre: true,
    // Whether to use hljs' auto language detection, default is true
    auto_detection: true
  })]
});

// Hàm chuyển đổi Markdown sang HTML
export const markdownToHtml = (markdown: string): string => {
  return converter.makeHtml(markdown);
};