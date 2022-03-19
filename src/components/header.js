import React, { useState } from "react";
import { AiOutlineUserAdd, AiOutlineUser } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useUser } from "../context/userContext";

export default function Header({
  createdBy,
  saveCallback,
  dataConnections,
  blogId,
}) {
  const { userData } = useUser();
  const [showConnection, setShowConnection] = useState(false);

  return (
    <header className="p-4 flex justify-between items-center bg-white border-b border-gray-300 space-x-4">
      <Link
        to={"/"}
        className="flex-1 text-2xl font-bold font-milonga text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-teal-900"
      >
        BlogBuddy
      </Link>
      {userData.userId === createdBy && (
        <button
          className="p-2 px-4 flex justify-center items-center text-blue-600 border border-blue-600 rounded-3xl"
          onClick={saveCallback}
        >
          <span>Save Changes</span>
        </button>
      )}
      <div
        onClick={() => setShowConnection(!showConnection)}
        className="relative p-1 pr-2 flex justify-center items-center bg-blue-400 rounded-full space-x-2 cursor-pointer"
      >
        <AiOutlineUser size={24} className="bg-white rounded-full" />
        <span className="text-white text-lg font-bold">
          {Object.keys(dataConnections).length + 1}
        </span>
        {showConnection && (
          <div className="absolute top-full translate-y-4 left-full -translate-x-full p-2 flex flex-col bg-blue-400 rounded-xl space-y-2 z-50">
            <p
              className="p-2 text-lg text-gray-800 bg-white rounded-xl cursor-pointer"
              key={userData?.username}
            >
              {userData?.username}
            </p>
            {Object.entries(dataConnections).map(([key, value]) => {
              return (
                <p
                  className="p-2 text-lg text-gray-800 bg-white rounded-xl cursor-pointer"
                  key={key}
                >
                  {value.username}
                </p>
              );
            })}
            <AiOutlineUserAdd
              size={32}
              onClick={() => navigator.clipboard.writeText(blogId)}
              className="p-2 bg-white rounded-xl cursor-pointer"
            />
          </div>
        )}
      </div>
    </header>
  );
}