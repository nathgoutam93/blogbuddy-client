import React, { useState } from "react";
import { AiOutlineUserAdd, AiOutlineUser } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useUser } from "../context/userContext";
import { ImSpinner2 } from "react-icons/im";
import { AiOutlineFileMarkdown } from "react-icons/ai";
import Toast from "./commons/toast";
import PublishModal from "./publishModal";
import PropTypes from "prop-types";

export default function Header({
  createdBy,
  saveCallback,
  handleDownload,
  dataConnections,
  blogId,
  blogTitle,
  username,
  loading
}) {
  const { userData } = useUser();
  const [showConnection, setShowConnection] = useState(false);
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const showToast = () => {
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 3000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(blogId);
    showToast();
  };

  return (
    <>
      <header className="z-50 flex h-16 w-full items-center justify-between space-x-4 border-b border-gray-300 bg-white p-4">
        <Link
          to={"/"}
          className="flex bg-gradient-to-r from-green-400 to-green-600 bg-clip-text font-milonga text-2xl font-bold text-transparent lg:hidden"
        >
          bb
        </Link>
        <Link
          to={"/"}
          className="hidden bg-gradient-to-r from-green-400 to-green-600 bg-clip-text font-milonga text-2xl font-bold text-transparent lg:flex"
        >
          BlogBuddy
        </Link>
        <div className="flex items-center justify-center space-x-2">
          <button
            className="flex items-center justify-center rounded-3xl bg-gray-100 p-1 px-4 text-blue-600"
            onClick={handleDownload}
          >
            <AiOutlineFileMarkdown size={24} />
          </button>
          {!!createdBy && createdBy === userData?.userId && (
            <>
              <button
                className="flex items-center justify-center rounded-3xl bg-gray-100 p-1 px-4 text-blue-600"
                onClick={saveCallback}
              >
                {loading ? (
                  <>
                    <span>Saving</span>
                    <ImSpinner2 className="ml-2 animate-spin" />
                  </>
                ) : (
                  <span>Save</span>
                )}
              </button>
              <button
                className="flex items-center justify-center rounded-3xl border border-blue-600 p-1 px-4 text-blue-600"
                onClick={() => setShowModal(!showModal)}
              >
                Publish
              </button>
            </>
          )}
          <div
            onClick={() => setShowConnection(!showConnection)}
            className="relative flex cursor-pointer items-center justify-center space-x-2 rounded-full bg-green-400 p-1 pr-2"
          >
            <AiOutlineUser size={24} className="rounded-full bg-white" />
            <span className="text-lg font-bold text-white">
              {Object.keys(dataConnections).length + 1}
            </span>
            {showConnection && (
              <div className="absolute top-full left-full z-50 flex translate-y-4 -translate-x-full flex-col space-y-2 rounded-xl bg-green-400 p-2">
                <p
                  className="cursor-pointer rounded-xl bg-white p-2 text-lg text-gray-800"
                  key={username}
                >
                  {username}
                </p>
                {Object.entries(dataConnections).map(([key, value]) => {
                  return (
                    <p
                      className="cursor-pointer rounded-xl bg-white p-2 text-lg text-gray-800"
                      key={key}
                    >
                      {value.username}
                    </p>
                  );
                })}
                <AiOutlineUserAdd
                  size={32}
                  onClick={handleCopy}
                  className="cursor-pointer rounded-xl bg-white p-2"
                />
              </div>
            )}
          </div>
        </div>
      </header>
      <Toast show={show} type="success" message="Copid to clipboard" />
      {showModal && (
        <div
          onClick={() => setShowModal(!showModal)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        >
          <PublishModal blogTitle={blogTitle} />
        </div>
      )}
    </>
  );
}
Header.propTypes = {
  createdBy: PropTypes.string,
  saveCallback: PropTypes.func,
  handleDownload: PropTypes.func,
  dataConnections: PropTypes.object,
  blogId: PropTypes.string,
  blogTitle: PropTypes.string,
  username: PropTypes.string,
  loading: PropTypes.bool
};
