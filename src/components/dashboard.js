import React, { useState } from "react";
import Blogs from "../components/blogs";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import CreateNewBlog from "../utils/createNewBlog";
import { useUser } from "../context/userContext";

export default function DashboardHome() {
  const { user, getAccessTokenSilently } = useAuth0();
  const { setUserBlogs } = useUser();
  const [blogId, setBlogId] = useState("");
  const navigator = useNavigate();

  const handleJoinBlog = () => {
    navigator(`/blogs/${blogId}`);
  };

  const handleCreateBLog = async () => {
    const token = await getAccessTokenSilently();
    const { errors, data } = await CreateNewBlog(user.sub, token);
    if (errors) console.log(errors);
    setUserBlogs((prevState) => [...prevState, data.insert_blogs_one]);
    navigator(`/blogs/${data.insert_blogs_one.id}`);
  };

  return (
    <>
      <div className="w-full h-1/3 p-4 flex flex-col justify-center items-center font-nunito space-y-4">
        <div className="relative w-full max-w-2xl p-2 flex bg-white rounded-3xl space-y-2 shadow-sm">
          <input
            type="text"
            onChange={(e) => setBlogId(e.target.value)}
            value={blogId}
            placeholder="Blog ID"
            className="flex-1 p-2 px-4 rounded-3xl outline-none"
          />
          <button
            className="absolute right-2 top-0 w-max p-2 px-4 text-white bg-gradient-to-r from-teal-400 hover:from-teal-500 to-green-500 hover:to-green-600 rounded-3xl cursor-pointer"
            disabled={!blogId}
            onClick={handleJoinBlog}
          >
            Join Blog
          </button>
        </div>
        <div className="block lg:hidden w-full">
          <button
            className="w-max p-2 px-4 text-white bg-gradient-to-r from-teal-400 hover:from-teal-500 to-green-500 hover:to-green-600 rounded-3xl cursor-pointer"
            onClick={handleCreateBLog}
          >
            Create New Blog
          </button>
        </div>
      </div>
      <p className="m-2 px-4 w-full max-w-2xl text-left text-sm font-nunito text-gray-700">
        recent blogs
      </p>
      <div className="w-full h-full lg:h-80 py-4 flex flex-col items-center space-y-2 overflow-y-scroll s_hide">
        {user?.sub ? (
          <Blogs userId={user?.sub} />
        ) : (
          <div className="p-4 py-20 w-full max-w-2xl flex justify-center items-center bg-white rounded-xl shadow-md">
            <p className="text-center text-xl font-nunito text-gray-800 bg-white rounded-xl">
              Log in <br></br> To see your Blogs
            </p>
          </div>
        )}
      </div>
    </>
  );
}
