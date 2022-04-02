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
      <div className="flex h-1/3 w-full flex-col items-center justify-center space-y-4 p-4 font-nunito">
        <div className="relative flex w-full max-w-2xl space-y-2 rounded-3xl bg-secondary-light p-2 shadow-sm dark:bg-secondary-dark">
          <input
            type="text"
            onChange={(e) => setBlogId(e.target.value)}
            value={blogId}
            placeholder="Blog ID"
            className="flex-1 rounded-3xl p-2.5 px-4 outline-none dark:bg-secondary-dark dark:text-gray-100"
          />
          <button
            className="btn-primary absolute right-2 top-0 w-max cursor-pointer rounded-3xl"
            disabled={!blogId}
            onClick={handleJoinBlog}
          >
            Join Blog
          </button>
        </div>
        <div className="block w-full lg:hidden">
          <button
            className="btn-primary w-max cursor-pointer rounded-3xl"
            onClick={handleCreateBLog}
          >
            Create New Blog
          </button>
        </div>
      </div>
      <p className="m-2 w-full max-w-2xl px-4 text-left font-nunito text-sm text-gray-700 dark:text-gray-400">
        recent blogs
      </p>
      <div className="s_hide flex h-full w-full flex-col items-center space-y-2 overflow-y-scroll py-4 lg:h-80">
        {user?.sub ? (
          <Blogs userId={user?.sub} />
        ) : (
          <div className="flex w-full max-w-2xl items-center justify-center rounded-xl bg-white p-4 py-20 shadow-md">
            <p className="rounded-xl bg-white text-center font-nunito text-xl text-gray-800">
              Log in <br></br> To see your Blogs
            </p>
          </div>
        )}
      </div>
    </>
  );
}
