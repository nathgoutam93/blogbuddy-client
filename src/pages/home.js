import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/darkModeContext";
import { useAuth0 } from "@auth0/auth0-react";
import { v4 as uuidV4 } from "uuid";
import { MdUpdate, MdOutlineVoiceChat, MdLightMode } from "react-icons/md";
import { BsArrowUpRightCircle, BsFillMoonStarsFill } from "react-icons/bs";

export default function Home() {
  const { isLoading, loginWithRedirect } = useAuth0();

  const navigator = useNavigate();
  const callbackURL = window.location.origin;

  const { dark, setDark } = useDarkMode();
  const [blogId, setBlogId] = useState("");

  const handleJoinBlog = () => {
    navigator(`/blogs/${blogId}/anonymous`);
  };

  const handleCreateBLog = () => {
    const blogId = uuidV4();
    navigator(`/blogs/${blogId}/anonymous`);
  };

  const handleDark = () => {
    if (dark) {
      window.document.documentElement.classList.remove("dark");
    } else {
      window.document.documentElement.classList.add("dark");
    }
    localStorage.setItem("dark", JSON.stringify(!dark));
    setDark(!dark);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <section className="flex min-h-screen w-full flex-col items-center space-y-6 bg-primary-light dark:bg-primary-dark">
      <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-gray-100 bg-secondary-light p-2 px-4 dark:border-secondary-dark dark:bg-secondary-dark">
        <h1 className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text font-milonga text-2xl font-bold text-transparent">
          BlogBuddy
        </h1>
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() =>
              loginWithRedirect({
                redirectUri: callbackURL
              })
            }
            className="btn-primary"
          >
            Log in
          </button>
          {dark ? (
            <BsFillMoonStarsFill
              size={25}
              className="cursor-pointer text-gray-600"
              onClick={handleDark}
            />
          ) : (
            <MdLightMode
              size={25}
              className="cursor-pointer text-gray-600"
              onClick={handleDark}
            />
          )}
        </div>
      </header>
      <div className="flex flex-col items-center justify-center space-y-6 p-4 py-10">
        <p
          style={{ animationDelay: "200ms" }}
          className="translate-y-full animate-enter-b font-nunito text-2xl text-gray-700 opacity-0 dark:text-gray-200"
        >
          Effective <strong className="text-green-400">Real-time</strong>{" "}
          Co-blogging With{" "}
          <strong className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text font-milonga text-transparent">
            BlogBuddy
          </strong>
        </p>
        <div
          style={{ animationDelay: "300ms" }}
          className="relative flex w-full max-w-xl translate-y-full animate-enter-b space-y-2 rounded-3xl border  border-gray-200 bg-secondary-light p-2 opacity-0 shadow-md dark:border-secondary-dark dark:bg-secondary-dark"
        >
          <input
            type="text"
            onChange={(e) => setBlogId(e.target.value)}
            value={blogId}
            placeholder="Blog ID"
            className="flex-1 rounded-3xl p-2.5 px-4 outline-none dark:bg-secondary-dark dark:text-white"
          />
          <button
            className="btn-primary absolute right-2 top-0"
            disabled={!blogId}
            onClick={handleJoinBlog}
          >
            Join Blog
          </button>
        </div>
        <div className="relative h-full w-full">
          <img src="/img/home.svg" alt="bg" className="" />
        </div>
        <div className="flex flex-col items-center justify-center space-y-2">
          <button className="btn-primary" onClick={handleCreateBLog}>
            Create A Test Blog
          </button>
          <div className="relative flex flex-col items-center justify-center">
            <span className="peer cursor-pointer text-sm text-gray-500 underline">
              what is test blog?
            </span>
            <p className="tooltip pointer-events-none absolute top-full w-80 rounded-xl border border-gray-200 bg-white p-2 text-gray-700 opacity-0 transition-opacity peer-hover:opacity-100">
              Test blogs are not persistent, They are only to test{" "}
              <strong className="font-milonga"> BlogBuddy </strong>
              real-time editor
            </p>
          </div>
        </div>
      </div>
      <section className="flex w-full flex-col items-center justify-center gap-4 p-4 py-10 lg:flex-row">
        <div className="h-52 w-80 cursor-pointer space-y-2 rounded-xl border border-gray-200 bg-primary-light p-4 shadow-sm transition-all hover:scale-105 dark:border-secondary-dark dark:bg-secondary-dark">
          <MdUpdate size={32} className="text-gray-700 dark:text-gray-100" />
          <p className="font-nunito text-xl text-gray-700 dark:text-gray-100">
            Real-time
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-100">
            Real-time changes, caret postition and text selections with
            real-time users presence list
          </p>
        </div>
        <div className="h-52 w-80 cursor-pointer space-y-2 rounded-xl border border-gray-200 bg-primary-light p-4 shadow-sm transition-all hover:scale-105 dark:border-secondary-dark dark:bg-secondary-dark">
          <MdOutlineVoiceChat
            size={32}
            className="text-gray-700 dark:text-gray-100"
          />
          <p className="font-nunito text-xl text-gray-700 dark:text-gray-100">
            Built in Chat
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-100">
            Use built in video and audio call to communicate with your
            co-blogger and share your ideas
          </p>
        </div>
        <div className="h-52 w-80 cursor-pointer space-y-2 rounded-xl border border-gray-200 bg-primary-light p-4 shadow-sm transition-all hover:scale-105 dark:border-secondary-dark dark:bg-secondary-dark">
          <BsArrowUpRightCircle
            size={32}
            className="text-gray-700 dark:text-gray-100"
          />
          <p className="font-nunito text-xl text-gray-700 dark:text-gray-100">
            Publishing
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-100">
            Instantly publish to blogging platforms like hashnode and dev.to
          </p>
        </div>
      </section>
      <footer className="flex w-full justify-between space-x-4 bg-green-600 p-4 py-5">
        <div className="flex flex-col space-y-1">
          <h1 className="font-milonga text-2xl font-bold text-white">
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
