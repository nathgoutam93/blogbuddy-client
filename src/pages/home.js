import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { v4 as uuidV4 } from "uuid";
import { MdUpdate, MdOutlineVoiceChat } from "react-icons/md";
import { BsArrowUpRightCircle } from "react-icons/bs";

export default function Home() {
  const { isLoading, loginWithRedirect } = useAuth0();

  const navigator = useNavigate();
  const callbackURL = window.location.origin;

  const [blogId, setBlogId] = useState("");

  const handleJoinBlog = () => {
    navigator(`/blogs/${blogId}/anonymous`);
  };

  const handleCreateBLog = () => {
    const blogId = uuidV4();
    navigator(`/blogs/${blogId}/anonymous`);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <section className="w-full min-h-screen flex flex-col items-center bg-gray-50 space-y-6">
      <header className="sticky top-0 w-full p-2 px-4 flex justify-between items-center bg-white border-b border-gray-100 z-50">
        <h1 className="text-2xl font-bold font-milonga text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
          BlogBuddy
        </h1>
        <button
          onClick={() =>
            loginWithRedirect({
              redirectUri: callbackURL
            })
          }
          className="p-2 px-4 text-white font-nunito font-bold bg-gradient-to-r from-teal-500 hover:from-teal-400 to-green-600 hover:to-green-500 rounded-3xl"
        >
          Log in
        </button>
      </header>
      <div className="p-4 py-10 flex flex-col justify-center items-center space-y-6">
        <p className="text-2xl font-nunito text-gray-700">
          Effective <strong className="text-green-400">Real-time</strong>{" "}
          Co-blogging With{" "}
          <strong className="font-milonga text-transparent bg-gradient-to-r from-green-400 to-green-600 bg-clip-text">
            BlogBuddy
          </strong>
        </p>
        <div className="relative w-full max-w-xl p-2 flex bg-white  rounded-3xl space-y-2 shadow-md border border-gray-200">
          <input
            type="text"
            onChange={(e) => setBlogId(e.target.value)}
            value={blogId}
            placeholder="Blog ID"
            className="flex-1 p-2 px-4 outline-none rounded-3xl"
          />
          <button
            className="absolute right-2 top-0 w-max p-2 px-4 text-white font-nunito bg-gradient-to-r from-teal-500 hover:from-teal-400 to-green-600 hover:to-green-500 rounded-3xl cursor-pointer"
            disabled={!blogId}
            onClick={handleJoinBlog}
          >
            Join Blog
          </button>
        </div>
        <div className="relative w-full h-full">
          <img src="/img/home.svg" alt="bg" className="" />
        </div>
        <div className="flex flex-col justify-center items-center space-y-2">
          <button
            className="w-max p-2 px-4 text-white font-nunito bg-gradient-to-r from-teal-500 hover:from-teal-400 to-green-600 hover:to-green-500 rounded-3xl cursor-pointer"
            onClick={handleCreateBLog}
          >
            Create A Test Blog
          </button>
          <div className="relative flex flex-col justify-center items-center">
            <span className="peer text-sm underline text-blue-600 cursor-pointer">
              what is test blog?
            </span>
            <p className="opacity-0 peer-hover:opacity-100 absolute top-full w-80 p-2 text-gray-700 bg-white border border-gray-200 rounded-xl pointer-events-none transition-opacity">
              Test blogs are not persistent, They are only to test{" "}
              <strong className="font-milonga"> BlogBuddy </strong>
              real-time editor
            </p>
          </div>
        </div>
      </div>
      <section className="p-4 py-10 w-full flex flex-col lg:flex-row justify-center items-center gap-4">
        <div className="w-80 h-52 p-4 bg-white space-y-2 rounded-xl border border-gray-200 shadow-sm hover:scale-105 transition-all cursor-pointer">
          <MdUpdate size={32} className="text-gray-700" />
          <p className="font-nunito text-xl text-gray-700">Real-time</p>
          <p className="text-sm text-gray-700">
            Real-time changes, caret postition and text selections with
            real-time users presence list
          </p>
        </div>
        <div className="w-80 h-52 p-4 bg-white space-y-2 rounded-xl border border-gray-200 shadow-sm hover:scale-105 transition-all cursor-pointer">
          <MdOutlineVoiceChat size={32} className="text-gray-700" />
          <p className="font-nunito text-xl text-gray-700">Built in Chat</p>
          <p className="text-sm text-gray-700">
            Use built in video and audio call to communicate with your
            co-blogger and share your ideas
          </p>
        </div>
        <div className="w-80 h-52 p-4 bg-white space-y-2 rounded-xl border border-gray-200 shadow-sm hover:scale-105 transition-all cursor-pointer">
          <BsArrowUpRightCircle size={32} className="text-gray-700" />
          <p className="font-nunito text-xl text-gray-700">Publishing</p>
          <p className="text-sm text-gray-700">
            Instantly publish to blogging platforms like hashnode and dev.to
          </p>
        </div>
      </section>
      <footer className="w-full flex justify-between p-4 py-5 bg-green-700 space-x-4">
        <div className="flex flex-col space-y-1">
          <h1 className="font-milonga font-bold text-2xl text-white">
            BlogBuddy
          </h1>
          <p className="font-nunito text-sm text-white">©2022 Blogbuddy</p>
        </div>
        <div className="flex flex-col space-y-1 text-white">
          Credit
          <a
            href="https://www.freepik.com/vectors/business"
            className="text-xs text-white"
          >
            Bussiness vector created by storyset
          </a>
          <a
            href="https://www.freepik.com/vectors/hand-drawn"
            className="text-xs text-white"
          >
            Hand drawn vector created by pikisuperstar
          </a>
        </div>
      </footer>
    </section>
  );
}
