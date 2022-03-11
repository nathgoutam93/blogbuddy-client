import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import QuillCursors from "quill-cursors";
Quill.register("modules/cursors", QuillCursors);

const QuillContext = createContext(null);

export const useQuill = () => {
  return useContext(QuillContext);
};

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ["bold", "italic"],
  ["blockquote", "code-block", "link"],
  [{ list: "bullet" }, { list: "ordered" }],
  ["image"],
];

export function QuillProvider({ children }) {
  const [quill, setQuill] = useState(null);
  const [cursorModule, setCursorModule] = useState(null);

  useEffect(() => {
    if (quill == null) return;

    const cursors = quill.getModule("cursors");
    setCursorModule(cursors);
  }, [quill]);

  const quillWrapper = useCallback((wrapper) => {
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: TOOLBAR_OPTIONS,
        cursors: {
          hideDelayMs: 5000,
          hideSpeedMs: 100,
          transformOnTextChange: true,
        },
      },
    });
    setQuill(q);
  }, []);

  const value = { quill, quillWrapper, cursorModule };

  return (
    <QuillContext.Provider value={value}>{children}</QuillContext.Provider>
  );
}
