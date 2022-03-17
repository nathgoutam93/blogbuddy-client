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
        <div className="mt-4 space-y-2">
          <textarea
            placeholder="Title"
            className="w-full px-4 bg-gray-100 text-2xl"
            value={blogTitle || ""}
            onChange={(e) => setBlogTitle(e.target.value)}
          />
          <textarea
            placeholder="Sub Title"
            className="w-full px-4 bg-gray-100 text-2xl"
            value={blogSubTitle || ""}
            onChange={(e) => setBlogSubTitle(e.target.value)}
          />
        </div>
      ) : (
        <>
          <h1 className="mt-4 w-full px-4 text-2xl">
            {blogTitle ?? "No Title"}
          </h1>
          <h1 className="mt-4 w-full px-4 text-2xl">
            {blogSubTitle ?? "No Sub Title"}
          </h1>
        </>
      )}
      <div className="quill-wrapper" ref={quillWrapper}></div>
    </>
  );
}
