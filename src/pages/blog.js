import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePeer } from "../context/peerContext";
import { useQuill } from "../context/quillContext";

export default function Blog() {
  const { blogId, username } = useParams();
  const { peer } = usePeer();
  const { quill, quillWrapper, cursorModule } = useQuill();

  const [connections, setConnections] = useState([]);

  useEffect(() => {
    if (peer == null || quill == null || !username || cursorModule == null)
      return;

    peer.on("connection", (conn) => {
      conn.on("data", (data) => {
        const handleNewUser = () => {
          conn.send({ type: "username", value: username });
          setConnections((prev) => [
            ...prev,
            { username: data.value, connection: conn },
          ]);
          const randomColor = Math.floor(Math.random() * 16777215).toString(16);
          cursorModule.createCursor(conn.peer, data.value, `#${randomColor}`);
        };

        switch (data.type) {
          case "username":
            return handleNewUser();
          case "delta":
            const handleDelta = () => {
              quill.updateContents(JSON.parse(data.value));
            };
            return handleDelta();
          case "range":
            const handleRange = () => {
              cursorModule.moveCursor(data.source, JSON.parse(data.value));
            };
            return handleRange();
          default:
            break;
        }
      });
    });

    const handleConnect = (peerToConnect) => {
      const conn = peer.connect(peerToConnect);

      conn.on("open", function () {
        conn.send({ type: "username", value: username });

        conn.on("data", (data) => {
          const handleNewUser = () => {
            setConnections((prev) => [
              ...prev,
              { username: data.value, connection: conn },
            ]);
            const randomColor = Math.floor(Math.random() * 16777215).toString(
              16
            );
            cursorModule.createCursor(conn.peer, data.value, `#${randomColor}`);
          };

          switch (data.type) {
            case "username":
              return handleNewUser();
            case "delta":
              const handleDelta = () => {
                quill.updateContents(JSON.parse(data.value));
              };
              return handleDelta();
            case "range":
              const handleRange = () => {
                cursorModule.moveCursor(data.source, JSON.parse(data.value));
              };
              return handleRange();
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
        username: username,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        result.users.map((user) => {
          if (user.userId === peer.id) return null;
          return handleConnect(user.userId);
        });
      });

    peer.on("error", (error) => {
      console.log(error);
    });
  }, [peer, quill, username, cursorModule]);

  useEffect(() => {
    if (!connections.length || quill == null) return;

    const textHandler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      connections.forEach((connection) => {
        connection.connection.send({
          type: "delta",
          source: peer.id,
          value: JSON.stringify(delta),
        });
      });
    };

    const selectionHandler = (range, oldRange, source) => {
      if (source !== "user") return;
      connections.forEach((connection) => {
        connection.connection.send({
          type: "range",
          source: peer.id,
          value: JSON.stringify(range),
        });
      });
    };

    quill.on("editor-change", (eventName, ...args) => {
      if (eventName === "text-change")
        return textHandler(args[0], args[1], args[2]);
      if (eventName === "selection-change")
        return selectionHandler(args[0], args[1], args[2]);
    });

    return () => {
      quill.off("editor-change");
    };
  }, [connections, quill, peer]);

  return (
    <>
      <p className="blogId">Blog ID: {blogId}</p>
      <div className="wrapper">
        <div className="container" ref={quillWrapper}></div>
        <div className="connections">
          {connections?.map((connection) => {
            return (
              <p
                className="peer-id"
                key={connection.connection.peer}
                id={connection.connection.peer}
              >
                Connected to {connection.username}
              </p>
            );
          })}
        </div>
      </div>
    </>
  );
}
