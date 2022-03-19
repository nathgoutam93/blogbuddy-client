import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/userContext";
import { formatDistanceToNow, parseISO } from "date-fns";

export default function Blogs() {
  const { userBlogs } = useUser();

  return (
    <div className="py-4 bg-bg-gray-200 rounded-xl space-y-2">
      {userBlogs.length ? (
        userBlogs.map((blog) => {
          return (
            <Link
              key={blog.id}
              to={`/blogs/${blog.id}`}
              className="p-2 flex flex-col font-nunito text-gray-800 bg-white rounded-xl"
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
    </div>
  );
}
