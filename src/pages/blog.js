import React, { useCallback, useEffect, useState } from "react";
import Peer from "peerjs";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { v4 as uuidV4 } from "uuid";
import { useParams } from "react-router-dom";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ["bold", "italic"],
  ["blockquote", "code-block", "link"],
  [{ list: "bullet" }, { list: "ordered" }],
  ["image"],
];

export default function Blog() {
  const { blogId } = useParams();

  const [quill, setQuill] = useState(null);
  const [peer, setPeer] = useState(null);
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    const p = new Peer(uuidV4(), {
      host: "192.168.43.24",
      port: 5000,
      path: "/peerjs",
    });
    setPeer(p);

    return () => {
      p.destroy();
    };
  }, []);

  useEffect(() => {
    if (peer == null || quill == null) return;

    peer.on("connection", (conn) => {
      setConnections((prev) => [...prev, conn]);

      conn.on("data", (data) => {
        switch (data.type) {
          case "delta":
            return quill.updateContents(JSON.parse(data.value));
          default:
            break;
        }
      });
    });

    peer.on("error", (error) => {
      console.log(error);
    });

    const handleConnect = (peerToConnect) => {
      if (peer == null) return;

      const conn = peer.connect(peerToConnect);

      conn.on("open", function () {
        setConnections((prev) => [...prev, conn]);

        conn.on("data", (data) => {
          switch (data.type) {
            case "delta":
              return quill.updateContents(JSON.parse(data.value));
            default:
              break;
          }
        });
      });

      conn.on("error", (error) => {
        console.log(error);
      });
    };

    fetch("http://localhost:5000/saveUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: peer.id,
      }),
    })
      .then((res) => res.json())
      .then((result) =>
        result.users.map((user) => {
          if (user === peer.id) return null;
          return handleConnect(user);
        })
      );
  }, [peer, quill]);

  useEffect(() => {
    if (!connections.length || quill == null) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      connections.map((connection) => {
        return connection.send({ type: "delta", value: JSON.stringify(delta) });
      });
    };

    quill.on("text-change", handler);

    return () => {
      quill.off("text-change");
    };
  }, [connections, quill]);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    setQuill(q);
  }, []);

  return (
    <>
      <p className="blogId">Blog ID: {blogId}</p>
      <div className="wrapper">
        <div className="container" ref={wrapperRef}></div>
        <div className="connections">
          {connections?.map((connection) => {
            return (
              <p className="peer-id" key={connection.peer} id={connection.peer}>
                Connected to {connection.peer}
              </p>
            );
          })}
        </div>
      </div>
    </>
  );
}
