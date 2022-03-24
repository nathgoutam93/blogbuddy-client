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
              className="p-4 w-full max-w-2xl flex flex-col text-gray-800 bg-white rounded-xl shadow-md"
            >
              <p className="text-xl truncate">
                {blog.blog_title || "No Title"}
              </p>
              <p className="text-xl truncate">
                {blog.blog_subtitle || "No Subtitle"}
              </p>
              <p className="text-sm">
                {formatDistanceToNow(parseISO(blog.created_at), {
                  addSuffix: true,
                })}
              </p>
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
