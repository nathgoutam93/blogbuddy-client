import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { usePeer } from "../context/peerContext";
import { useQuill } from "../context/quillContext";
import { useUser } from "../context/userContext";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "../components/header";
import Editor from "../components/editor";
import VideoContainer from "../components/videoContainer";
import VideoContainerHorizontal from "../components/videoContainerHorizontal";
import GetBlog from "../utils/getBlog";
import UpdateBlog from "../utils/updateBlog";
import getActiveUsers from "../utils/getActiveUsers";

const { deltaToMarkdown } = require("quill-delta-to-markdown");

export default function Blog() {
  const { blogId } = useParams();
  const {
    userData: { username }
  } = useUser();
  const { getAccessTokenSilently } = useAuth0();
  const { peer } = usePeer();
  const { quill, cursorModule } = useQuill();

  const [blog, setBlog] = useState(null);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogSubTitle, setBlogSubTitle] = useState("");
  const blogRef = useRef(null);

  const [dataConnections, setDataConnections] = useState({});
  const [mediaConnections, setMediaConnections] = useState({});
  const [localStream, setLocalStream] = useState(null);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (blog == null || quill == null) return;
    setBlogTitle(blog.blog_title);
    setBlogSubTitle(blog.blog_subtitle);
    quill.setContents(JSON.parse(blog.data));
  }, [blog, quill]);

  useEffect(() => {
    blogRef.current = {
      ...blog,
      blog_title: blogTitle,
      blog_subtitle: blogSubTitle
    };
  }, [blog, blogTitle, blogSubTitle]);

  useEffect(() => {
    if (peer == null || quill == null || cursorModule == null || !username)
      return;

    peer.on("connection", (conn) => {
      conn.on("data", (data) => {
        let toggleFlagTimeout = 0;

        const handleNewUser = () => {
          //send username to the peer to complete connection process and add peer to connections
          conn.send({ type: "username", value: username });
          setDataConnections((previousState) => {
            previousState[conn.peer] = {
              username: data.value,
              dataConnection: conn
            };
            return { ...previousState };
          });
          // create a new cursor and assign it to remote peer
          const colors = [
            "#4169E1",
            "#7FFFD4",
            "#FAF884",
            "#FF7722",
            "#FF2400",
            "#FEA3AA",
            "#4B0082"
          ];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          cursorModule.createCursor(conn.peer, data.value, `${randomColor}`);
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

        const handleTitles = () => {
          const titles = JSON.parse(data.value);
          setBlogTitle(titles.blogTitle);
          setBlogSubTitle(titles.blogSubTitle);
        };

        const handleData = () => {
          const value = {
            ...blogRef.current,
            data: JSON.stringify(quill.getContents())
          };
          conn.send({
            type: "data",
            value: JSON.stringify(value)
          });
        };

        switch (data.type) {
          case "delta":
            return handleDelta();
          case "range":
            return handleRange();
          case "titles":
            return handleTitles();
          case "username":
            return handleNewUser();
          case "data":
            return handleData();
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
  }, [peer, quill, cursorModule, username]);

  useEffect(() => {
    if (peer == null || localStream == null) return;

    peer.on("call", function (call) {
      call.answer(localStream);

      call.on("stream", (stream) => {
        setMediaConnections((previousState) => {
          previousState[call.peer] = {
            mediaConnection: call,
            stream
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
      !blogId ||
      !username
    )
      return;

    const handleDataConnections = async () => {
      const activeUsers = await getActiveUsers(blogId, peer.id);

      if (
        Object.values(activeUsers).filter((key) => key != null).length === 1
      ) {
        const token = await getAccessTokenSilently();
        const { errors, data } = await GetBlog(blogId, token);
        if (errors) console.log(errors);
        setBlog(data.blogs_by_pk);
      }

      Object.entries(activeUsers).forEach(([key, value]) => {
        if (key === peer.id) return;
        const conn = peer.connect(value, { serialization: "json" });

        conn?.on("open", function () {
          //initiate connection process with sending username
          conn.send({ type: "username", value: username });
          conn.send({ type: "data" });
        });

        conn?.on("data", (data) => {
          let toggleFlagTimeout = 0;

          // add the peer to connections on connection complete
          const handleNewUser = () => {
            setDataConnections((previousState) => {
              previousState[conn.peer] = {
                username: data.value,
                dataConnection: conn
              };
              return { ...previousState };
            });
            // create a new cursor and assign it to remote peeer
            const colors = [
              "#4169E1",
              "#7FFFD4",
              "#FAF884",
              "#FF7722",
              "#FF2400",
              "#FEA3AA",
              "#4B0082"
            ];
            const randomColor =
              colors[Math.floor(Math.random() * colors.length)];
            cursorModule.createCursor(conn.peer, data.value, `${randomColor}`);
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

          const handleTitles = () => {
            const titles = JSON.parse(data.value);
            setBlogTitle(titles.blogTitle);
            setBlogSubTitle(titles.blogSubTitle);
          };

          const handleData = () => {
            const blogData = JSON.parse(data.value);
            return setBlog((prevState) => prevState ?? blogData);
          };

          switch (data.type) {
            case "delta":
              return handleDelta();
            case "range":
              return handleRange();
            case "titles":
              return handleTitles();
            case "username":
              return handleNewUser();
            case "data":
              return handleData();
            default:
              break;
          }
        });

        // remove the peer from connections if dataConnection got close
        conn?.on("close", () => {
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

        conn?.on("error", (error) => {
          console.log(error);
        });
      });
    };

    handleDataConnections();
  }, [peer, quill, cursorModule, username, blogId, getAccessTokenSilently]);

  useEffect(() => {
    if (peer == null || !blogId || localStream == null) return;

    const handleMediaConnect = async () => {
      const activeUsers = await getActiveUsers(blogId, peer.id);

      Object.entries(activeUsers).forEach(([key, value]) => {
        if (key === peer.id) return;
        const call = peer.call(value, localStream);

        call?.on("stream", function (stream) {
          setMediaConnections((previousState) => {
            previousState[call.peer] = {
              mediaConnection: call,
              stream
            };
            return { ...previousState };
          });
        });

        call?.on("error", (error) => {
          console.log(error);
        });
      });
    };

    handleMediaConnect();
  }, [peer, blogId, localStream]);

  useEffect(() => {
    if (quill == null || !Object.keys(dataConnections).length) return;

    // send text changes to all the connected peers
    const textHandler = (delta, _, source) => {
      if (source !== "user") return;
      Object.values(dataConnections).forEach((value) => {
        value.dataConnection.send({
          type: "delta",
          value: JSON.stringify(delta)
        });
      });
    };

    // send text selection to all the connected peers
    const selectionHandler = (range, _, source) => {
      if (source !== "user") return;
      Object.values(dataConnections).forEach((value) => {
        value.dataConnection.send({
          type: "range",
          value: JSON.stringify(range)
        });
      });
    };

    // listening for quill editor events
    quill.on("editor-change", (eventName, ...args) => {
      if (eventName === "text-change") return textHandler(...args);
      if (eventName === "selection-change") return selectionHandler(...args);
    });

    return () => {
      quill.off("editor-change");
    };
  }, [dataConnections, quill, peer]);

  useEffect(() => {
    const getlocalMediaStream = async () => {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { min: 320, ideal: 640, max: 1280 },
          height: { min: 240, ideal: 400, max: 720 },
          aspectRatio: { ideal: 1.7777777778 }
        },
        audio: true
      });
      setLocalStream(mediaStream);
    };

    getlocalMediaStream();
  }, []);

  const handleTitlesChange = (titles) => {
    Object.values(dataConnections).forEach((value) => {
      value.dataConnection.send({
        type: "titles",
        value: JSON.stringify(titles)
      });
    });
  };

  const handleSave = async () => {
    setSaving(true);
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
        blog_subtitle: data.update_blogs_by_pk.blog_subtitle
      };
    });
    setBlogTitle(data.update_blogs_by_pk.blog_title);
    setBlogSubTitle(data.update_blogs_by_pk.blog_subtitle);
    setSaving(false);
  };

  function download(filename, text) {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  const handleDownload = () => {
    const markdown = deltaToMarkdown(quill.getContents().ops);
    download(`${blogTitle.toLowerCase().replace(/\s/g, "-")}.md`, markdown);
  };

  return (
    <div className="h-screen w-full">
      <Header
        createdBy={blog?.created_by}
        dataConnections={dataConnections}
        blogId={blogId}
        blogTitle={blogTitle}
        username={username}
        loading={saving}
        saveCallback={handleSave}
        handleDownload={handleDownload}
      />
      <div className="sticky top-0 lg:hidden">
        <VideoContainerHorizontal
          localStream={localStream}
          dataConnections={dataConnections}
          mediaConnections={mediaConnections}
        />
      </div>
      <div className="grid grid-cols-4 gap-2 p-2">
        <div className="s_hide col-span-4 max-h-[calc(100vh-272px)] overflow-scroll rounded-xl px-0 py-2 lg:col-span-3 lg:max-h-[calc(100vh-80px)] lg:px-2">
          <Editor
            createdBy={blog?.created_by}
            blogTitle={blogTitle}
            blogSubTitle={blogSubTitle}
            setBlogTitle={setBlogTitle}
            setBlogSubTitle={setBlogSubTitle}
            handleTitlesChange={handleTitlesChange}
          />
        </div>
        <div className="s_hide col-span-1 hidden max-h-[calc(100vh-80px)] flex-col items-center space-y-2 overflow-auto pb-24 lg:flex">
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
