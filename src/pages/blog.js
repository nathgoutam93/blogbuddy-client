import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePeer } from "../context/peerContext";
import { useQuill } from "../context/quillContext";
import { useUser } from "../context/userContext";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "../components/header";
import Editor from "../components/editor";
import VideoContainer from "../components/videoContainer";
import GetBlog from "../utils/getBlog";
import UpdateBlog from "../utils/updateBlog";

const SERVER_ENDPOINT = process.env.REACT_APP_SERVER_ENDPOINT;

export default function Blog() {
  const { blogId } = useParams();
  const { userData } = useUser();
  const { getAccessTokenSilently } = useAuth0();
  const { peer } = usePeer();
  const { quill, cursorModule } = useQuill();

  const [blog, setBlog] = useState(null);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogSubTitle, setBlogSubTitle] = useState("");

  const [dataConnections, setDataConnections] = useState({});
  const [mediaConnections, setMediaConnections] = useState({});
  const [localStream, setLocalStream] = useState(null);

  useEffect(() => {
    if (!blogId) return;

    const getBlogData = async () => {
      const token = await getAccessTokenSilently();
      const { errors, data } = await GetBlog(blogId, token);
      if (errors) console.log(errors);
      setBlog(data.blogs_by_pk);
    };

    getBlogData();
  }, [blogId, getAccessTokenSilently]);

  useEffect(() => {
    if (blog == null || quill == null) return;

    setBlogTitle(blog.blog_title);
    setBlogSubTitle(blog.blog_subtitle);
    quill.setContents(JSON.parse(blog.data));
  }, [blog, quill]);

  useEffect(() => {
    if (
      peer == null ||
      quill == null ||
      cursorModule == null ||
      !userData.username
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
  }, [peer, quill, cursorModule, userData.username]);

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
      cursorModule == null ||
      localStream == null ||
      !blogId ||
      !userData.username
    )
      return;
    const handleDataConnect = (peerToConnect) => {
      const conn = peer.connect(peerToConnect, { serialization: "json" });

      conn?.on("open", function () {
        //initiate connection process with sending username
        conn.send({ type: "username", value: userData.username });
      });

      conn?.on("data", (data) => {
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
      conn?.on("close", () => {
        setMediaConnections((previousState) => {
          delete previousState[conn.peer];
          return { ...previousState };
        });
        setDataConnections((previousState) => {
          delete previousState[conn.peer];
          return { ...previousState };
        });
      });

      conn?.on("error", (error) => {
        console.log(error);
      });
    };

    const handleMediaConnect = (peerToConnect) => {
      const call = peer.call(peerToConnect, localStream);

      call?.on("stream", function (stream) {
        setMediaConnections((previousState) => {
          previousState[call.peer] = {
            mediaConnection: call,
            stream,
          };
          return { ...previousState };
        });
      });

      call?.on("error", (error) => {
        console.log(error);
      });
    };

    // fetch all active users working on this Blog Id
    const connectToActiveUsers = async () => {
      const res = await fetch(SERVER_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blogId: blogId,
          userId: peer.id,
          username: userData.username,
        }),
      });
      const result = await res.json();
      Object.entries(result.users).forEach(([key, value]) => {
        if (key === peer.id) return;
        handleDataConnect(value);
        handleMediaConnect(value);
      });
    };

    connectToActiveUsers();
  }, [peer, quill, cursorModule, userData.username, localStream, blogId]);

  useEffect(() => {
    if (quill == null || !Object.keys(dataConnections).length) return;

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
    const getlocalMediaStream = async () => {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(mediaStream);
    };

    getlocalMediaStream();
  }, []);

  const handleSave = async () => {
    const token = await getAccessTokenSilently();
    const { errors, data } = await UpdateBlog(
      blogId,
      blogTitle,
      blogSubTitle,
      JSON.stringify(quill.getContents()),
      token
    );
    if (errors) console.log(errors);
    setBlog((prevState) => {
      return {
        ...prevState,
        data: data.update_blogs_by_pk.data,
        blog_title: data.update_blogs_by_pk.blog_title,
        blog_subtitle: data.update_blogs_by_pk.blog_subtitle,
      };
    });
    setBlogTitle(data.update_blogs_by_pk.blog_title);
    setBlogSubTitle(data.update_blogs_by_pk.blog_subtitle);
  };

  return (
    <div className="p-4 w-full min-h-screen font-nunito bg-gradient-to-tr from-blue-400 to-blue-200">
      <Header
        createdBy={blog?.created_by}
        saveCallback={handleSave}
        dataConnections={dataConnections}
        blogId={blogId}
      />
      <div className="grid grid-cols-4 py-2 gap-2">
        <div className="p-2 bg-gray-100 col-span-4 lg:col-span-3 overflow-hidden rounded-xl">
          <Editor
            createdBy={blog?.created_by}
            blogTitle={blogTitle}
            blogSubTitle={blogSubTitle}
            setBlogTitle={setBlogTitle}
            setBlogSubTitle={setBlogSubTitle}
          />
        </div>
        <div className="flex flex-col items-center col-span-1 space-y-2">
          <VideoContainer
            localStream={localStream}
            dataConnections={dataConnections}
            mediaConnections={mediaConnections}
          />
        </div>
      </div>
    </div>
  );
}
