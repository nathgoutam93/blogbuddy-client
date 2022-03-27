import React from "react";
import { useUser } from "../context/userContext";
import { useQuill } from "../context/quillContext";

export default function Editor({
  createdBy,
  blogTitle,
  blogSubTitle,
  setBlogTitle,
  setBlogSubTitle,
  handleTitlesChange
}) {
  const { userData } = useUser();
  const { quillWrapper } = useQuill();

  return (
    <>
      <div>
        <textarea
          value={blogTitle || ""}
          onChange={(e) => {
            setBlogTitle(e.target.value);
            handleTitlesChange({ blogTitle: e.target.value, blogSubTitle });
            e.target.style.height = "inherit";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          className="w-full h-20 mt-4 px-4 bg-white text-3xl outline-none overflow-hidden resize-none"
          readOnly={createdBy !== userData.userId}
          placeholder="Title"
          maxLength={150}
        />
        <textarea
          value={blogSubTitle || ""}
          onChange={(e) => {
            setBlogSubTitle(e.target.value);
            handleTitlesChange({ blogTitle, blogSubTitle: e.target.value });
            e.target.style.height = "inherit";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          className="w-full h-16 my-4 px-4 bg-white text-2xl outline-none overflow-hidden resize-none"
          readOnly={createdBy !== userData.userId}
          placeholder="Sub Title"
          maxLength={150}
        />
      </div>
      <div className="quill-wrapper" ref={quillWrapper}></div>
    </>
  );
}
