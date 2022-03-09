import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

export default function Home() {
  const navigator = useNavigate();
  const [blogId, setBlogId] = useState("");

  const handleJoinBlog = () => {
    navigator(`/blogs/${blogId}`);
  };

  const handleCreateBLog = () => {
    const newBlogId = uuidV4();

    //TODO create a new blog document with this newBlogId in database

    navigator(`/blogs/${newBlogId}`);
  };

  return (
    <div>
      <div>
        <div>
          <input
            type="text"
            onChange={(e) => setBlogId(e.target.value)}
            value={blogId}
          ></input>
          <button onClick={handleJoinBlog}>Join A Blog</button>
        </div>
        <div>
          <button onClick={handleCreateBLog}>Create A Blog</button>
        </div>
      </div>
    </div>
  );
}
