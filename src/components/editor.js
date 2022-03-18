import React from "react";
import { useUser } from "../context/userContext";
import { useQuill } from "../context/quillContext";

export default function Editor({
  createdBy,
  blogTitle,
  blogSubTitle,
  setBlogTitle,
  setBlogSubTitle,
}) {
  const { userData } = useUser();
  const { quillWrapper } = useQuill();

  return (
    <>
      {userData.userId === createdBy ? (
        <div className="space-y-2">
          <textarea
            placeholder="Title"
            className="w-full px-4 bg-white text-3xl outline-none resize-none"
            value={blogTitle || ""}
            onChange={(e) => setBlogTitle(e.target.value)}
          />
          <textarea
            placeholder="Sub Title"
            className="w-full px-4 bg-white text-2xl outline-none resize-none"
            value={blogSubTitle || ""}
            onChange={(e) => setBlogSubTitle(e.target.value)}
          />
        </div>
      ) : (
        <>
          <h1
            className={`mt-4 w-full px-4 text-2xl ${
              blogTitle || "text-gray-500"
            }`}
          >
            {blogTitle ?? "No Title"}
          </h1>
          <h1
            className={`mt-4 w-full px-4 text-2xl ${
              blogSubTitle || "text-gray-500"
            }`}
          >
            {blogSubTitle ?? "No Sub Title"}
          </h1>
        </>
      )}
      <div className="quill-wrapper" ref={quillWrapper}></div>
    </>
  );
}
