import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../context/userContext";
import Blogs from "../components/blogs";
import CreateNewBlog from "../utils/createNewBlog";

export default function Home() {
  const {
    user,
    isLoading,
    isAuthenticated,
    logout,
    loginWithRedirect,
    getAccessTokenSilently,
  } = useAuth0();
  const { setUserBlogs } = useUser();
  const [blogId, setBlogId] = useState("");

  const navigator = useNavigate();

  const handleJoinBlog = () => {
    if (!isAuthenticated)
      return loginWithRedirect({
        redirectUri: `https://bloggerbuddy.netlify.app//`,
      });

    navigator(`/blogs/${blogId}`);
  };

  const handleCreateBLog = async () => {
    if (!isAuthenticated)
      return loginWithRedirect({
        redirectUri: `https://bloggerbuddy.netlify.app//`,
      });

    const token = await getAccessTokenSilently();
    const { errors, data } = await CreateNewBlog(user.sub, token);
    if (errors) console.log(errors);
    setUserBlogs((prevState) => [...prevState, data.insert_blogs_one]);
    navigator(`/blogs/${data.insert_blogs_one.id}`);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="w-full min-h-screen font-nunito bg-gradient-to-tr from-blue-400 to-blue-200">
      <header className="p-2 flex justify-between items-center">
        <h1 className="text-2xl font-bold font-milonga text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-teal-900">
          BlogBuddy
        </h1>
        <div className="p-2 flex justify-between items-center space-x-2">
          {!isAuthenticated ? (
            <button
              onClick={() =>
                loginWithRedirect({
                  redirectUri: "https://bloggerbuddy.netlify.app/",
                })
              }
              className="p-2 px-4 text-white font-bold bg-gradient-to-r from-teal-400 hover:from-teal-500 to-green-500 hover:to-green-600 rounded-3xl"
            >
              Log in
            </button>
          ) : (
            <button
              onClick={() =>
                logout({ returnTo: "https://bloggerbuddy.netlify.app/" })
              }
              className="p-2 px-4 text-white font-bold bg-gradient-to-r from-teal-400 hover:from-teal-500 to-green-500 hover:to-green-600 rounded-3xl"
            >
              Log out
            </button>
          )}
        </div>
      </header>
      <div className="w-5/6 max-w-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 flex flex-col justify-center space-y-2">
        <div className="relative p-2 flex bg-white  rounded-3xl space-y-2">
          <input
            type="text"
            onChange={(e) => setBlogId(e.target.value)}
            value={blogId}
            placeholder="Blog ID"
            className="flex-1 p-2 px-4 rounded-3xl"
          />
          <button
            className="absolute right-2 top-0 w-max p-2 px-4 text-white bg-gradient-to-r from-teal-400 hover:from-teal-500 to-green-500 hover:to-green-600 rounded-3xl cursor-pointer"
            disabled={!blogId}
            onClick={handleJoinBlog}
          >
            Join Blog
          </button>
        </div>
        {user?.sub ? (
          <div>
            <Blogs userId={user?.sub} />
          </div>
        ) : (
          <p className="px-10 py-20 text-center text-xl font-nunito text-gray-800 bg-white rounded-xl">
            Log in <br></br> To see your Blogs
          </p>
        )}
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
