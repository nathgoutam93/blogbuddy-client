import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePeer } from "../context/peerContext";
import { useQuill } from "../context/quillContext";
import { AiOutlineUserAdd, AiOutlineUser } from "react-icons/ai";

export default function Blog() {
  const { blogId, username } = useParams();
  const { peer } = usePeer();
  const { quill, quillWrapper, cursorModule } = useQuill();

  const [connections, setConnections] = useState({});
  const [showConnection, setShowConnection] = useState(false);

  useEffect(() => {
    if (peer == null || quill == null || !username || cursorModule == null)
      return;

    peer.on("connection", (conn) => {
      conn.on("data", (data) => {
        let toggleFlagTimeout = 0;

        const handleNewUser = () => {
          // close this connection if we already have a dataConnection with the peer
          if (Object.keys(connections).includes(conn.peer)) conn.close();
          //send username to the peer to complete connection process
          conn.send({ type: "username", value: username });
          //add the remote peer to the connections
          setConnections((previousState) => {
            previousState[conn.peer] = {
              username: data.value,
              connection: conn,
            };
            return { ...previousState };
          });
          // create a new cursor and assign it to remote peer
          const randomColor = Math.floor(Math.random() * 16777215).toString(16);
          cursorModule.createCursor(conn.peer, data.value, `#${randomColor}`);
        };

        // replicate remote peer text changes
        const handleDelta = () => {
          quill.updateContents(JSON.parse(data.value));
          cursorModule.toggleFlag(data.source, true);
          if (toggleFlagTimeout > 0) clearTimeout(toggleFlagTimeout);
          toggleFlagTimeout = setTimeout(
            () => cursorModule.toggleFlag(data.source, false),
            3000
          );
        };

        // replicate remote peer text selection and cursor movement
        const handleRange = () => {
          cursorModule.moveCursor(data.source, JSON.parse(data.value));
          cursorModule.toggleFlag(data.source, true);
          if (toggleFlagTimeout > 0) clearTimeout(toggleFlagTimeout);
          toggleFlagTimeout = setTimeout(
            () => cursorModule.toggleFlag(data.source, false),
            3000
          );
        };

        switch (data.type) {
          case "username":
            return handleNewUser();
          case "delta":
            return handleDelta();
          case "range":
            return handleRange();
          default:
            break;
        }
      });

      //on dataConnection close remove the user from connection and the cursor associated with the peer
      conn.on("close", () => {
        cursorModule.removeCursor(conn.peer);
        setConnections((previousState) => {
          delete previousState[conn.peer];
          return { ...previousState };
        });
      });
    });

    peer.on("error", (error) => {
      console.log(error);
    });

    return () => peer.off("connection");
  }, [peer, quill, cursorModule, username]);

  useEffect(() => {
    if (peer == null || quill == null || !username || cursorModule == null)
      return;

    const handleConnect = (peerToConnect) => {
      const conn = peer.connect(peerToConnect);

      conn.on("open", function () {
        //initiate connection process with sending username
        conn.send({ type: "username", value: username });

        conn.on("data", (data) => {
          let toggleFlagTimeout = 0;

          // add the peer to connections on connection complete
          const handleNewUser = () => {
            setConnections((previousState) => {
              previousState[conn.peer] = {
                username: data.value,
                connection: conn,
              };
              return { ...previousState };
            });
            // create a new cursor and assign it to remote peeer
            const randomColor = Math.floor(Math.random() * 16777215).toString(
              16
            );
            cursorModule.createCursor(conn.peer, data.value, `#${randomColor}`);
          };

          // replicate remote peer text changes
          const handleDelta = () => {
            quill.updateContents(JSON.parse(data.value));
            cursorModule.toggleFlag(data.source, true);
            if (toggleFlagTimeout > 0) clearTimeout(toggleFlagTimeout);
            toggleFlagTimeout = setTimeout(
              () => cursorModule.toggleFlag(data.source, false),
              3000
            );
          };

          // replicate remote peer text selection and cursor movement
          const handleRange = () => {
            cursorModule.moveCursor(data.source, JSON.parse(data.value));
            cursorModule.toggleFlag(data.source, true);
            if (toggleFlagTimeout > 0) clearTimeout(toggleFlagTimeout);
            toggleFlagTimeout = setTimeout(
              () => cursorModule.toggleFlag(data.source, false),
              3000
            );
          };

          switch (data.type) {
            case "username":
              return handleNewUser();
            case "delta":
              return handleDelta();
            case "range":
              return handleRange();
            default:
              break;
          }
        });
      });

      // remove the peer from connections if dataConnection got close
      conn.on("close", () => {
        setConnections((previousState) => {
          delete previousState[conn.peer];
          return { ...previousState };
        });
      });

      conn.on("error", (error) => {
        console.log(error);
      });
    };

    // fetch all active users working on this Blog Id
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
        Object.entries(result.users).forEach(([key, value]) => {
          if (key === peer.id) return;
          if (Object.keys(connections).includes(key)) return;
          handleConnect(value.userId);
        });
      });
  }, [peer, quill, username, cursorModule]);

  useEffect(() => {
    if (Object.keys(connections).length < 0 || quill == null) return;

    // send text changes to all the connected peers
    const textHandler = (delta, _, source) => {
      if (source !== "user") return;
      Object.entries(connections).map(([key, value]) => {
        return value.connection.send({
          type: "delta",
          source: peer.id,
          value: JSON.stringify(delta),
        });
      });
    };

    // send text selection to all the connected peers
    const selectionHandler = (range, _, source) => {
      if (source !== "user") return;
      Object.entries(connections).map(([_, value]) => {
        return value.connection.send({
          type: "range",
          source: peer.id,
          value: JSON.stringify(range),
        });
      });
    };

    // listening for quill editor events
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
    <div className="p-4 w-full min-h-screen grid grid-cols-4 font-nunito bg-gradient-to-tr from-blue-400 to-blue-200">
      <div className="wrapper col-span-4 lg:col-span-3 space-y-2">
        <header className="p-2 px-4 flex justify-between items-center bg-white rounded-xl">
          <h1 className="text-2xl font-bold font-milonga text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-teal-900">
            BlogBuddy
          </h1>
          <div
            onClick={() => setShowConnection(!showConnection)}
            className="relative p-1 pr-2 flex justify-center items-center bg-teal-400 rounded-full space-x-2 cursor-pointer"
          >
            <AiOutlineUser size={24} className="bg-white rounded-full" />
            <span className="text-white text-lg font-bold">
              {Object.keys(connections).length + 1}
            </span>
            {showConnection && (
              <div className="absolute top-full translate-y-4 left-full -translate-x-full p-2 flex flex-col bg-teal-400 rounded-xl space-y-2 z-50">
                <p
                  className="p-2 text-lg text-gray-800 bg-white rounded-xl cursor-pointer"
                  key={username}
                >
                  {username}
                </p>
                {Object.entries(connections).map(([key, value]) => {
                  return (
                    <p
                      className="p-2 text-lg text-gray-800 bg-white rounded-xl cursor-pointer"
                      key={key}
                    >
                      {value.username}
                    </p>
                  );
                })}
                <AiOutlineUserAdd
                  size={32}
                  onClick={() => navigator.clipboard.writeText(blogId)}
                  className="p-2 bg-white rounded-xl cursor-pointer"
                />
              </div>
            )}
          </div>
        </header>
        <div className="quill-wrapper" ref={quillWrapper}></div>
      </div>
      <div className="col-span-1"></div>
    </div>
  );
}
