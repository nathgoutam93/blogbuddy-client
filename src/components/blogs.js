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
              className="flex w-full max-w-2xl flex-col rounded-xl bg-white p-4 font-nunito text-gray-700 shadow-md"
            >
              <p className="truncate text-xl">
                {blog.blog_title || "No Title"}
              </p>
              <p className="truncate text-xl">
                {blog.blog_subtitle || "No Subtitle"}
              </p>
              <div className="flex flex-col justify-between py-2 lg:flex-row">
                {!!blog.updated_at && (
                  <p className="text-sm">
                    updated{" "}
                    {formatDistanceToNow(parseISO(blog.updated_at), {
                      addSuffix: true
                    })}
                  </p>
                )}
                {!!blog.created_at && (
                  <p className="text-sm">
                    created{" "}
                    {formatDistanceToNow(parseISO(blog.created_at), {
                      addSuffix: true
                    })}
                  </p>
                )}
              </div>
            </Link>
          );
        })
      ) : (
        <div className="flex w-full max-w-xl flex-col items-center justify-center overflow-hidden rounded-xl bg-white p-4">
          <p className="z-10 text-center font-nunito text-xl text-gray-800">
            Let&apos;s Write A Story Together
          </p>
          <img
            src="/img/together.jpg"
            alt="bg"
            className="top-0 h-60 rounded-xl"
          />
        </div>
      )}
    </>
  );
}
