import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

export default function Home() {
  const navigator = useNavigate();
  const [username, setUsername] = useState("");
  const [blogId, setBlogId] = useState("");

  const handleJoinBlog = () => {
    navigator(`/blogs/${blogId}/${username}`);
  };

  const handleCreateBLog = () => {
    const newBlogId = uuidV4();

    //TODO create a new blog document with this newBlogId in database

    navigator(`/blogs/${newBlogId}/${username}`);
  };

  return (
    <div>
      <div>
        <div>
          <input
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            placeholder="username"
          ></input>
          <input
            type="text"
            onChange={(e) => setBlogId(e.target.value)}
            value={blogId}
            placeholder="Blog ID"
          ></input>
          <button disabled={!username || !blogId} onClick={handleJoinBlog}>
            Join A Blog
          </button>
        </div>
        <div>
          <button disabled={!username} onClick={handleCreateBLog}>
            Create A Blog
          </button>
        </div>
      </div>
    </div>
  );
}
