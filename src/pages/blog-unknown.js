import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePeer } from "../context/peerContext";
import { useQuill } from "../context/quillContext";
import Header from "../components/header";
import Editor from "../components/editor";
import VideoContainer from "../components/videoContainer";
import VideoContainerHorizontal from "../components/videoContainerHorizontal";

const SERVER_ENDPOINT = process.env.REACT_APP_SERVER_ENDPOINT;

export default function BlogUnknown() {
  const { blogId, username } = useParams();
  const { peer } = usePeer();
  const { quill, cursorModule } = useQuill();

  const [blogTitle, setBlogTitle] = useState("");
  const [blogSubTitle, setBlogSubTitle] = useState("");

  const [dataConnections, setDataConnections] = useState({});
  const [mediaConnections, setMediaConnections] = useState({});
  const [localStream, setLocalStream] = useState(null);

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
              dataConnection: conn,
            };
            return { ...previousState };
          });
          // create a new cursor and assign it to remote peer
          const colors = [
            "#4169E1",
            "#7FFFD4",
            "#52595D",
            "#FF7722",
            "#FF2400",
            "#FEA3AA",
            "#4B0082",
          ];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          // const randomColor = Math.floor(Math.random() * 16777215).toString(16);
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
  }, [peer, quill, cursorModule, username]);

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
      !username
    )
      return;
    const handleDataConnect = (peerToConnect) => {
      const conn = peer.connect(peerToConnect, { serialization: "json" });

      conn?.on("open", function () {
        //initiate connection process with sending username
        conn.send({ type: "username", value: username });
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
          const colors = [
            "#4169E1",
            "#7FFFD4",
            "#FAF884",
            "#FF7722",
            "#FF2400",
            "#FEA3AA",
            "#4B0082",
          ];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          // const randomColor = Math.floor(Math.random() * 16777215).toString(16);
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
      const res = await fetch(`${SERVER_ENDPOINT}/saveUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blogId: blogId,
          userId: peer.id,
          username: username,
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
  }, [peer, quill, cursorModule, username, localStream, blogId]);

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
          aspectRatio: { ideal: 1.7777777778 },
        },
        audio: true,
      });
      setLocalStream(mediaStream);
    };

    getlocalMediaStream();
  }, []);

  return (
    <div className="w-full h-screen">
      <Header
        dataConnections={dataConnections}
        blogId={blogId}
        username={username}
      />
      <div className="sticky top-0 lg:hidden">
        <VideoContainerHorizontal
          localStream={localStream}
          dataConnections={dataConnections}
          mediaConnections={mediaConnections}
        />
      </div>
      <div className="grid grid-cols-4 p-2 gap-2">
        <div className="max-h-[calc(100vh-272px)] lg:max-h-[calc(100vh-80px)] p-2 col-span-4 lg:col-span-3 rounded-xl overflow-scroll s_hide">
          <Editor
            blogTitle={blogTitle}
            blogSubTitle={blogSubTitle}
            setBlogTitle={setBlogTitle}
            setBlogSubTitle={setBlogSubTitle}
          />
        </div>
        <div className="max-h-[calc(100vh-80px)] pb-24 hidden lg:flex flex-col items-center col-span-1 overflow-auto space-y-2 s_hide">
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
