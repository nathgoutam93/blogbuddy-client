import React, { useEffect, useState, useRef } from "react";
import { BsFillMicMuteFill, BsFillMicFill } from "react-icons/bs";
import { FaVideoSlash, FaVideo } from "react-icons/fa";

export default function Video({ stream, constraint, isLocal, username }) {
  const videoRef = useRef(null);

  const [streamConstraint, setStreamConstraint] = useState(constraint);

  const getAudioTrack = (stream) => {
    const audioTrack = stream
      .getTracks()
      .find((track) => track.kind === "audio");
    return audioTrack;
  };

  const getVideoTrack = (stream) => {
    const videoTrack = stream
      .getTracks()
      .find((track) => track.kind === "video");
    return videoTrack;
  };

  const handleVideoToggle = () => {
    setStreamConstraint((constraint) => {
      return { ...constraint, video: !constraint.video };
    });
  };

  const handleAudioToggle = () => {
    setStreamConstraint((constraint) => {
      return { ...constraint, audio: !constraint.audio };
    });
  };

  useEffect(() => {
    if (stream == null || videoRef.current == null) return;
    if (getAudioTrack(stream))
      getAudioTrack(stream).enabled = streamConstraint.audio;
    if (getVideoTrack(stream))
      getVideoTrack(stream).enabled = streamConstraint.video;
    videoRef.current.srcObject = stream;
    videoRef.current.muted = isLocal;
    videoRef.current.play();
  }, [stream, streamConstraint, isLocal]);

  return (
    <div className="relative bg-gray-200 rounded-xl">
      <span className="absolute top-2 right-2 p-2 font-nunito bg-white rounded-lg">
        {username}
      </span>
      <video className="rounded-xl peer" ref={videoRef}></video>
      <div className="absolute left-0 bottom-0 w-full p-5 flex justify-center items-center rounded-xl space-x-2 opacity-0 peer-hover:opacity-100 hover:opacity-100">
        <button
          onClick={handleVideoToggle}
          className="p-2 px-4 flex justify-center items-center bg-white w-full rounded-xl"
        >
          {streamConstraint.video ? (
            <FaVideoSlash size={32} className="text-gray-800" />
          ) : (
            <FaVideo size={32} className="text-gray-800" />
          )}
        </button>
        <button
          onClick={handleAudioToggle}
          className="p-2 px-4 flex justify-center items-center bg-white w-full rounded-xl"
        >
          {streamConstraint.audio ? (
            <BsFillMicMuteFill size={32} className="text-gray-800" />
          ) : (
            <BsFillMicFill size={32} className="text-gray-800" />
          )}
        </button>
      </div>
    </div>
  );
}
