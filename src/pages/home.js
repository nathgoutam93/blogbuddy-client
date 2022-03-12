import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

export default function Home() {
  const navigator = useNavigate();
  const [username, setUsername] = useState("");
  const [blogId, setBlogId] = useState("");

  const handleJoinBlog = () => {
    navigator(`/blogs/${blogId}/${username}`);
  };

  const handleCreateBLog = () => {
    const newBlogId = uuidV4();

    //TODO create a new blog document with this newBlogId in database

    navigator(`/blogs/${newBlogId}/${username}`);
  };

  return (
    <div className="w-full min-h-screen font-nunito bg-gradient-to-tr from-blue-400 to-blue-200">
      <header className="p-2 flex justify-between items-center">
        <h1 className="text-2xl font-bold font-milonga text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-teal-900">
          BlogBuddy
        </h1>
        <div className="p-2 flex justify-between items-center space-x-2">
          <Link
            to={"/"}
            className="p-2 px-4 text-white font-bold bg-gradient-to-r from-teal-400 hover:from-teal-500 to-green-500 hover:to-green-600 rounded-3xl"
          >
            Log in
          </Link>
          <Link
            to={"/"}
            className="p-2 px-4 text-white font-bold bg-gradient-to-r from-teal-400 hover:from-teal-500 to-green-500 hover:to-green-600 rounded-3xl"
          >
            Sign Up
          </Link>
        </div>
      </header>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 flex flex-col lg:flex-row justify-center">
        <div className="p-2 flex flex-col space-y-2">
          <input
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            placeholder="username"
            className="p-2 px-4 rounded-3xl"
          />
          <button
            className="w-max p-2 px-4 text-white bg-gradient-to-r from-teal-400 hover:from-teal-500 to-green-500 hover:to-green-600 rounded-3xl cursor-pointer"
            disabled={!username}
            onClick={handleCreateBLog}
          >
            Create New Blog
          </button>
        </div>
        <span className="p-2 px-10 text-white font-bold">-or-</span>
        <div className="p-2 flex flex-col space-y-2">
          <input
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            placeholder="username"
            className="p-2 px-4 rounded-3xl"
          />
          <input
            type="text"
            onChange={(e) => setBlogId(e.target.value)}
            value={blogId}
            placeholder="Blog ID"
            className="p-2 px-4 rounded-3xl"
          />
          <button
            className="w-max p-2 px-4 text-white bg-gradient-to-r from-teal-400 hover:from-teal-500 to-green-500 hover:to-green-600 rounded-3xl cursor-pointer"
            disabled={!username || !blogId}
            onClick={handleJoinBlog}
          >
            Join Blog
          </button>
        </div>
      </div>
    </div>
  );
}
