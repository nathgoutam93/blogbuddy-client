import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePeer } from "../context/peerContext";
import { useQuill } from "../context/quillContext";
import { AiOutlineUserAdd, AiOutlineUser } from "react-icons/ai";
import Video from "../components/video";
import { useUser } from "../context/userContext";
import GetBlog from "../utils/getBlog";
import { useAuth0 } from "@auth0/auth0-react";
import UpdateBlog from "../utils/updateBlog";

export default function Blog() {
  const { blogId } = useParams();
  const { userData } = useUser();
  const { getAccessTokenSilently } = useAuth0();
  const { peer } = usePeer();
  const { quill, quillWrapper, cursorModule } = useQuill();

  const [blog, setBlog] = useState(null);
  const [blogTitle, setBlogTitle] = useState("");

  const [dataConnections, setDataConnections] = useState({});
  const [mediaConnections, setMediaConnections] = useState({});
  const [showConnection, setShowConnection] = useState(false);
  const [localStream, setLocalStream] = useState(null);

  useEffect(() => {
    if (!blogId) return;

    getAccessTokenSilently()
      .then((token) => {
        return GetBlog(blogId, token);
      })
      .then(({ data, errors }) => {
        if (errors) console.log(errors);
        setBlog(data.blogs_by_pk);
        setBlogTitle(data.blogs_by_pk.blog_title);
      });
  }, [blogId, getAccessTokenSilently]);

  useEffect(() => {
    if (blog == null || quill == null) return;

    quill.setContents(JSON.parse(blog.data));
  }, [blog, quill]);

  useEffect(() => {
    if (
      peer == null ||
      quill == null ||
      userData == null ||
      cursorModule == null
    )
      return;

    peer.on("connection", (conn) => {
      conn.on("data", (data) => {
        let toggleFlagTimeout = 0;

        const handleNewUser = () => {
          //send username to the peer to complete connection process and add peer to connections
          conn.send({ type: "username", value: userData.username });
          setDataConnections((previousState) => {
            previousState[conn.peer] = {
              username: data.value,
              dataConnection: conn,
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
          cursorModule.toggleFlag(conn.peer, true);
          if (toggleFlagTimeout > 0) clearTimeout(toggleFlagTimeout);
          toggleFlagTimeout = setTimeout(
            () => cursorModule.toggleFlag(conn.peer, false),
            3000
          );
        };

        // replicate remote peer text selection and cursor movement
        const handleRange = () => {
          cursorModule.moveCursor(conn.peer, JSON.parse(data.value));
          cursorModule.toggleFlag(conn.peer, true);
          if (toggleFlagTimeout > 0) clearTimeout(toggleFlagTimeout);
          toggleFlagTimeout = setTimeout(
            () => cursorModule.toggleFlag(conn.peer, false),
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
        setMediaConnections((previousState) => {
          delete previousState[conn.peer];
          return { ...previousState };
        });
        setDataConnections((previousState) => {
          delete previousState[conn.peer];
          return { ...previousState };
        });
      });
    });

    return () => peer.off("connection");
  }, [peer, quill, cursorModule, userData]);

  useEffect(() => {
    if (peer == null || localStream == null) return;

    peer.on("call", function (call) {
      call.answer(localStream);

      call.on("stream", (stream) => {
        setMediaConnections((previousState) => {
          previousState[call.peer] = {
            mediaConnection: call,
            stream,
          };
          return { ...previousState };
        });
      });
    });

    peer.on("error", (error) => {
      console.log(error);
    });

    return () => {
      peer.off("call");
      peer.off("error");
    };
  }, [peer, localStream]);

  useEffect(() => {
    if (
      peer == null ||
      quill == null ||
      userData == null ||
      cursorModule == null ||
      localStream == null ||
      blogId == null
    )
      return;

    const handleConnect = (peerToConnect) => {
      const conn = peer.connect(peerToConnect, { serialization: "json" });
      const call = peer.call(peerToConnect, localStream);

      conn.on("open", function () {
        //initiate connection process with sending username
        conn.send({ type: "username", value: userData.username });
      });

      call.on("stream", function (stream) {
        setMediaConnections((previousState) => {
          previousState[call.peer] = {
            mediaConnection: call,
            stream,
          };
          return { ...previousState };
        });
      });

      conn.on("data", (data) => {
        let toggleFlagTimeout = 0;

        // add the peer to connections on connection complete
        const handleNewUser = () => {
          setDataConnections((previousState) => {
            previousState[conn.peer] = {
              username: data.value,
              dataConnection: conn,
            };
            return { ...previousState };
          });
          // create a new cursor and assign it to remote peeer
          const randomColor = Math.floor(Math.random() * 16777215).toString(16);
          cursorModule.createCursor(conn.peer, data.value, `#${randomColor}`);
        };

        // replicate remote peer text changes
        const handleDelta = () => {
          quill.updateContents(JSON.parse(data.value));
          cursorModule.toggleFlag(conn.peer, true);
          if (toggleFlagTimeout > 0) clearTimeout(toggleFlagTimeout);
          toggleFlagTimeout = setTimeout(
            () => cursorModule.toggleFlag(conn.peer, false),
            3000
          );
        };

        // replicate remote peer text selection and cursor movement
        const handleRange = () => {
          cursorModule.moveCursor(conn.peer, JSON.parse(data.value));
          cursorModule.toggleFlag(conn.peer, true);
          if (toggleFlagTimeout > 0) clearTimeout(toggleFlagTimeout);
          toggleFlagTimeout = setTimeout(
            () => cursorModule.toggleFlag(conn.peer, false),
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

      // remove the peer from connections if dataConnection got close
      conn.on("close", () => {
        setMediaConnections((previousState) => {
          delete previousState[conn.peer];
          return { ...previousState };
        });
        setDataConnections((previousState) => {
          delete previousState[conn.peer];
          return { ...previousState };
        });
      });

      conn.on("error", (error) => {
        console.log(error);
      });

      call.on("error", (error) => {
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
        blogId: blogId,
        userId: peer.id,
        username: userData.username,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        Object.entries(result.users).forEach(([key, value]) => {
          console.log(key, value);
          if (key === peer.id) return;
          handleConnect(value);
        });
      });
  }, [peer, quill, userData, cursorModule, localStream, blogId]);

  useEffect(() => {
    if (Object.keys(dataConnections).length < 0 || quill == null) return;

    // send text changes to all the connected peers
    const textHandler = (delta, _, source) => {
      if (source !== "user") return;
      Object.entries(dataConnections).forEach(([_, value]) => {
        value.dataConnection.send({
          type: "delta",
          value: JSON.stringify(delta),
        });
      });
    };

    // send text selection to all the connected peers
    const selectionHandler = (range, _, source) => {
      if (source !== "user") return;
      Object.entries(dataConnections).forEach(([_, value]) => {
        value.dataConnection.send({
          type: "range",
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
  }, [dataConnections, quill, peer]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(
      (mediaStream) => {
        setLocalStream(mediaStream);
      },
      (err) => console.log(err)
    );
  }, []);

  const handleSave = async () => {
    const token = await getAccessTokenSilently();
    const { data, errors } = await UpdateBlog(
      blogId,
      blogTitle,
      JSON.stringify(quill.getContents()),
      token
    );
    if (errors) console.log(errors);
    setBlog((prevState) => {
      return {
        ...prevState,
        data: data.update_blogs_by_pk.data,
        blog_title: data.update_blogs_by_pk.blog_title,
      };
    });
    setBlogTitle(data.update_blogs_by_pk.blog_title);
  };

  return (
    <div className="p-4 w-full min-h-screen font-nunito bg-gradient-to-tr from-blue-400 to-blue-200">
      <header className="p-2 px-4 flex justify-between items-center bg-white rounded-xl">
        <h1 className="text-2xl font-bold font-milonga text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-teal-900">
          BlogBuddy
        </h1>
        {userData.userId === blog?.created_by ? (
          <input
            value={blogTitle}
            onChange={(e) => setBlogTitle(e.target.value)}
          />
        ) : (
          <h1>{blogTitle}</h1>
        )}
        {userData.userId === blog?.created_by && (
          <button onClick={handleSave}>save Changes</button>
        )}
        <div
          onClick={() => setShowConnection(!showConnection)}
          className="relative p-1 pr-2 flex justify-center items-center bg-teal-400 rounded-full space-x-2 cursor-pointer"
        >
          <AiOutlineUser size={24} className="bg-white rounded-full" />
          <span className="text-white text-lg font-bold">
            {Object.keys(dataConnections).length + 1}
          </span>
          {showConnection && (
            <div className="absolute top-full translate-y-4 left-full -translate-x-full p-2 flex flex-col bg-teal-400 rounded-xl space-y-2 z-50">
              <p
                className="p-2 text-lg text-gray-800 bg-white rounded-xl cursor-pointer"
                key={userData?.username}
              >
                {userData?.username}
              </p>
              {Object.entries(dataConnections).map(([key, value]) => {
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
      <div className="grid grid-cols-4 py-2 gap-2">
        <div
          className="quill-wrapper col-span-4 lg:col-span-3"
          ref={quillWrapper}
        ></div>
        <div className="flex flex-col items-center col-span-1 space-y-2">
          {peer != null && localStream != null && (
            <Video
              key={peer.id}
              stream={localStream}
              constraint={{ video: false, audio: false }}
              isLocal={true}
              username={userData?.username}
            />
          )}
          {Object.entries(mediaConnections).map(([key, value]) => {
            return (
              <Video
                key={key}
                stream={value.stream}
                constraint={{ video: true, audio: true }}
                isLocal={false}
                username={dataConnections[key]?.username}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
