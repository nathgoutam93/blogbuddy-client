import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/userContext";
import { formatDistanceToNow, parseISO } from "date-fns";

export default function Blogs() {
  const { userBlogs } = useUser();

  return (
    <>
      {userBlogs.length ? (
        userBlogs.map((blog) => {
          return (
            <Link
              key={blog.id}
              to={`/blogs/${blog.id}`}
              className="p-4 w-full max-w-2xl flex flex-col font-nunito text-gray-700 bg-white rounded-xl shadow-md"
            >
              <p className="text-xl truncate">
                {blog.blog_title || "No Title"}
              </p>
              <p className="text-xl truncate">
                {blog.blog_subtitle || "No Subtitle"}
              </p>
              <div className="py-2 flex flex-col lg:flex-row justify-between">
                <p className="text-sm">
                  updated{" "}
                  {formatDistanceToNow(parseISO(blog.updated_at), {
                    addSuffix: true
                  })}
                </p>
                <p className="text-sm">
                  created{" "}
                  {formatDistanceToNow(parseISO(blog.created_at), {
                    addSuffix: true
                  })}
                </p>
              </div>
            </Link>
          );
        })
      ) : (
        <p className="px-10 py-20 text-center text-xl font-nunito text-gray-800 bg-white rounded-xl">
          Let's Write A Blog Togather
        </p>
      )}
    </>
  );
}
