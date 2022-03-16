import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Blogs from "../components/blogs";
import CreateNewBlog from "../utils/createNewBlog";
import { useUser } from "../context/userContext";

export default function Home() {
  const {
    isAuthenticated,
    isLoading,
    user,
    logout,
    loginWithRedirect,
    getAccessTokenSilently,
  } = useAuth0();
  const { setUserBlogs } = useUser();
  const navigator = useNavigate();
  const [blogId, setBlogId] = useState("");

  const handleJoinBlog = () => {
    if (!isAuthenticated)
      return loginWithRedirect({
        redirectUri: `http://localhost:3000/`,
      });

    navigator(`/blogs/${blogId}`);
  };

  const handleCreateBLog = async () => {
    if (!isAuthenticated)
      return loginWithRedirect({
        redirectUri: `http://localhost:3000/`,
      });

    try {
      const token = await getAccessTokenSilently();
      const { data, errors } = await CreateNewBlog(user.sub, token);
      console.log(data, errors);
      setUserBlogs((prevState) => [...prevState, data.insert_blogs_one]);
      // navigator(`/blogs/${newBlogId}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
  }, [isAuthenticated, user]);

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
                loginWithRedirect({ redirectUri: "http://localhost:3000" })
              }
              className="p-2 px-4 text-white font-bold bg-gradient-to-r from-teal-400 hover:from-teal-500 to-green-500 hover:to-green-600 rounded-3xl"
            >
              Log in
            </button>
          ) : (
            <button
              onClick={() => logout({ returnTo: "http://localhost:3000" })}
              className="p-2 px-4 text-white font-bold bg-gradient-to-r from-teal-400 hover:from-teal-500 to-green-500 hover:to-green-600 rounded-3xl"
            >
              Log out
            </button>
          )}
        </div>
      </header>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 flex flex-col justify-center space-y-2">
        <div className="flex space-x-2">
          <button
            className="w-max p-2 px-4 text-white bg-gradient-to-r from-teal-400 hover:from-teal-500 to-green-500 hover:to-green-600 rounded-3xl cursor-pointer"
            onClick={handleCreateBLog}
          >
            Create New Blog
          </button>
          <div className="relative p-2 flex bg-white  rounded-3xl space-y-2">
            <input
              type="text"
              onChange={(e) => setBlogId(e.target.value)}
              value={blogId}
              placeholder="Blog ID"
              className="p-2 px-4 rounded-3xl"
            />
            <button
              className="absolute right-2 top-0 w-max p-2 px-4 text-white bg-gradient-to-r from-teal-400 hover:from-teal-500 to-green-500 hover:to-green-600 rounded-3xl cursor-pointer"
              disabled={!blogId}
              onClick={handleJoinBlog}
            >
              Join Blog
            </button>
          </div>
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
      </div>
    </div>
  );
}
