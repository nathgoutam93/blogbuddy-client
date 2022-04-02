import React from "react";
import { useUser } from "../context/userContext";
import { useQuill } from "../context/quillContext";
import PropTypes from "prop-types";

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
          className="mt-4 h-20 w-full resize-none overflow-hidden bg-primary-light px-4 text-3xl outline-none dark:bg-primary-dark dark:text-gray-100"
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
          className="my-4 h-16 w-full resize-none overflow-hidden bg-primary-light px-4 text-2xl outline-none dark:bg-primary-dark dark:text-gray-100"
          readOnly={createdBy !== userData.userId}
          placeholder="Sub Title"
          maxLength={150}
        />
      </div>
      <div className="quill-wrapper" ref={quillWrapper}></div>
    </>
  );
}

Editor.propTypes = {
  createdBy: PropTypes.string,
  blogTitle: PropTypes.string,
  blogSubTitle: PropTypes.string,
  setBlogTitle: PropTypes.func,
  setBlogSubTitle: PropTypes.func,
  handleTitlesChange: PropTypes.func
};
