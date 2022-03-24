import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { v4 as uuidV4 } from "uuid";

export default function Home() {
  const { isLoading, loginWithRedirect } = useAuth0();

  const navigator = useNavigate();
  const callbackURL = window.location.origin;

  const [blogId, setBlogId] = useState("");

  const handleJoinBlog = () => {
    navigator(`/blogs/${blogId}/google`);
  };

  const handleCreateBLog = () => {
    const blogId = uuidV4();
    navigator(`/blogs/${blogId}/blogger`);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="w-full min-h-screen font-nunito bg-white">
      <header className="p-2 flex justify-between items-center">
        <h1 className="text-2xl font-bold font-milonga text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-teal-900">
          BlogBuddy
        </h1>
        <button
          onClick={() =>
            loginWithRedirect({
              redirectUri: callbackURL,
            })
          }
          className="p-2 px-4 text-white font-bold bg-gradient-to-r from-teal-400 hover:from-teal-500 to-green-500 hover:to-green-600 rounded-3xl"
        >
          Log in
        </button>
      </header>
      <div className="w-5/6 max-w-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 flex flex-col justify-center space-y-2">
        <div className="relative p-2 flex bg-white  rounded-3xl space-y-2 shadow-md border border-gray-200">
          <input
            type="text"
            onChange={(e) => setBlogId(e.target.value)}
            value={blogId}
            placeholder="Blog ID"
            className="flex-1 p-2 px-4 outline-none rounded-3xl"
          />
          <button
            className="absolute right-2 top-0 w-max p-2 px-4 text-white bg-gradient-to-r from-teal-400 hover:from-teal-500 to-green-500 hover:to-green-600 rounded-3xl cursor-pointer"
            disabled={!blogId}
            onClick={handleJoinBlog}
          >
            Join Blog
          </button>
        </div>
        <button
          className="w-max p-2 px-4 text-white bg-gradient-to-r from-teal-400 hover:from-teal-500 to-green-500 hover:to-green-600 rounded-3xl cursor-pointer"
          onClick={handleCreateBLog}
        >
          Create New Blog
        </button>
      </div>
    </div>
  );
}
