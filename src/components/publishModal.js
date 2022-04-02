import React, { useReducer } from "react";
import { SiHashnode, SiDevdotto } from "react-icons/si";
import { useQuill } from "../context/quillContext";
import PostToHashnode from "../utils/postToHashnode";
import PostToDev from "../utils/postToDev";
import PropTypes from "prop-types";
import Toast from "./commons/toast";

const { deltaToMarkdown } = require("quill-delta-to-markdown");

function toastReducer(state, action) {
  switch (action.type) {
    case "field":
      return {
        ...state,
        [action.field]: action.value
      };
    default:
      break;
  }
}

export default function PublishModal({ blogTitle }) {
  const { quill } = useQuill();

  const [state, dispatch] = useReducer(toastReducer, {
    show: false,
    type: "info",
    message: "No message for you"
  });
  const { show, type, message } = state;

  const showToast = (type, message) => {
    dispatch({ type: "field", field: "type", value: type });
    dispatch({ type: "field", field: "message", value: message });
    dispatch({ type: "field", field: "show", value: true });
    setTimeout(() => {
      dispatch({ type: "field", field: "show", value: false });
    }, 3000);
  };

  const publishToHashnode = async () => {
    const token = localStorage.getItem("hashnodeKey");
    if (!token) return showToast("error", "Hashnode Access Key Not Found");
    const markdown = deltaToMarkdown(quill.getContents().ops);
    const input = {
      title: blogTitle,
      markdown: markdown
    };
    const { data, errors } = await PostToHashnode(input, token);
    if (errors) showToast("error", `${errors[0].message}`);
    if (data) showToast("success", `${data.createStory.message}`);
  };

  const publishToDev = async () => {
    const token = localStorage.getItem("devtoKey");
    if (!token) return showToast("error", "Dev.to Access Key Not Found");
    const markdown = deltaToMarkdown(quill.getContents().ops);
    const input = {
      title: blogTitle,
      body_markdown: markdown,
      published: true,
      tags: []
    };
    const res = await PostToDev(input, token);
    if (res) showToast("success", `${res.location}`);
  };

  return (
    <div className="dark:bg-secondary flex w-5/6 max-w-lg flex-col space-y-2 rounded-xl bg-gray-200 p-4 font-nunito">
      <button
        onClick={(e) => {
          e.stopPropagation();
          publishToHashnode();
        }}
        className="flex h-12 w-full items-center justify-center space-x-4 rounded-xl bg-blue-700 p-4 text-white"
      >
        <SiHashnode size={25} />
        <span>Hashnode</span>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          publishToDev();
        }}
        className="flex h-12 w-full items-center justify-center space-x-4 rounded-xl bg-black p-4 text-white"
      >
        <SiDevdotto size={25} />
        <span>Dev.to</span>
      </button>
      <Toast show={show} type={type} message={message} />
    </div>
  );
}

PublishModal.propTypes = {
  blogTitle: PropTypes.string
};
