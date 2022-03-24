import Quill from "quill";

const Module = Quill.import("core/module");

export default class MarkdownTools extends Module {
  constructor(quill, options) {
    super(quill, options);

    this.quill = quill;
    this.options = options;

    const container = document.createElement("div");
    quill.container.parentNode.insertBefore(container, quill.container);
    this.container = container;
    this.container.classList.add("ql-toolbar");

    this.handlers = {
      bold: () => {
        let selection = this.quill.getSelection();
        if (selection.length === 0)
          return (() => {
            this.quill.insertText(selection.index, "****");
            this.quill.setSelection(selection.index + 2);
          })();
        var text = this.quill.getText(selection.index, selection.length);
        this.quill.deleteText(selection.index, selection.length);
        this.quill.insertText(selection.index, `**${text}**`);
      },
      italic: () => {
        let selection = this.quill.getSelection();
        if (selection.length === 0)
          return (() => {
            this.quill.insertText(selection.index, "**");
            this.quill.setSelection(selection.index + 1);
          })();
        var text = this.quill.getText(selection.index, selection.length);
        this.quill.deleteText(selection.index, selection.length);
        this.quill.insertText(selection.index, `*${text}*`);
      },
      blockquote: () => {
        let selection = this.quill.getSelection();
        if (selection.length === 0)
          return this.quill.insertText(selection.index, "> ");
        var text = this.quill.getText(selection.index, selection.length);
        this.quill.deleteText(selection.index, selection.length);
        this.quill.insertText(selection.index, `> ${text}`);
      },
      code: () => {
        let selection = this.quill.getSelection();
        if (selection.length === 0)
          return (() => {
            this.quill.insertText(selection.index, "```\n\n```");
            this.quill.setSelection(selection.index + 4);
          })();
        var text = this.quill.getText(selection.index, selection.length);
        this.quill.deleteText(selection.index, selection.length);
        this.quill.insertText(selection.index, "```\n" + text + "\n```");
      },
      link: () => {
        let selection = this.quill.getSelection();
        if (selection.length === 0)
          return (() => {
            this.quill.insertText(selection.index, "[Text](Link)");
            this.quill.setSelection(selection.index + 1, 4);
          })();
        var text = this.quill.getText(selection.index, selection.length);
        this.quill.deleteText(selection.index, selection.length);
        this.quill.insertText(selection.index, `[${text}](Link)`);
        this.quill.setSelection(selection.index + text.length + 3, 4);
      },
      bullet: () => {
        let selection = this.quill.getSelection();
        if (selection.length === 0)
          return this.quill.insertText(selection.index, "- ");
        var text = this.quill.getText(selection.index, selection.length);
        this.quill.deleteText(selection.index, selection.length);
        this.quill.insertText(selection.index, `- ${text}`);
      },
      ordered: () => {
        let selection = this.quill.getSelection();
        if (selection.length === 0)
          return this.quill.insertText(selection.index, "1. ");
        var text = this.quill.getText(selection.index, selection.length);
        this.quill.deleteText(selection.index, selection.length);
        this.quill.insertText(selection.index, `1. ${text}`);
      },
    };
    addButton(this.container, "bold", this.handlers);
    addButton(this.container, "italic", this.handlers);
    addButton(this.container, "blockquote", this.handlers);
    addButton(this.container, "code", this.handlers);
    addButton(this.container, "link", this.handlers);
    this.addBullet();
    this.addOredered();
  }

  addHandler(format, handler) {
    this.handlers[format] = handler;
  }

  addBullet() {
    const input = document.createElement("button");
    input.setAttribute("type", "button");
    input.setAttribute("value", "bullet");
    input.classList.add(`ql-list`);
    input.addEventListener("click", this.handlers["bullet"]);
    this.container.appendChild(input);
  }

  addOredered() {
    const input = document.createElement("button");
    input.setAttribute("type", "button");
    input.setAttribute("value", "ordered");
    input.classList.add(`ql-list`);
    input.addEventListener("click", this.handlers["ordered"]);
    this.container.appendChild(input);
  }
}

function addButton(container, format, handlers) {
  const input = document.createElement("button");
  input.setAttribute("type", "button");
  input.classList.add(`ql-${format}`);
  input.addEventListener("click", handlers[format]);
  container.appendChild(input);
}
