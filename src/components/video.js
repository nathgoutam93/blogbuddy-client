import React, { useEffect, useState, useRef } from "react";
import { BsFillMicMuteFill, BsFillMicFill } from "react-icons/bs";
import { FaVideoSlash, FaVideo } from "react-icons/fa";

export default function Video({
  stream,
  constraint = { video: true, audio: true },
  isLocal,
  username,
}) {
  const videoRef = useRef(null);

  const [videoEnabled, setVideoEnabled] = useState(constraint.video);
  const [audioEnabled, setAudioEnabled] = useState(constraint.audio);

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
    setVideoEnabled((prevState) => !prevState);
  };

  const handleAudioToggle = () => {
    setAudioEnabled((prevState) => !prevState);
  };

  useEffect(() => {
    if (stream == null || videoRef.current == null) return;
    if (getAudioTrack(stream)) getAudioTrack(stream).enabled = audioEnabled;
    if (getVideoTrack(stream)) getVideoTrack(stream).enabled = videoEnabled;
    videoRef.current.srcObject = stream;
    videoRef.current.muted = isLocal;
  }, [stream, videoEnabled, audioEnabled, isLocal]);

  return (
    <div className="relative bg-gray-200 rounded-xl">
      <span className="absolute top-2 right-2 p-2 font-nunito bg-white rounded-lg">
        {username}
      </span>
      <video
        autoPlay
        playsInline
        className="rounded-xl peer"
        ref={videoRef}
      ></video>
      <div className="absolute left-0 bottom-0 w-full p-5 flex justify-center items-center rounded-xl space-x-2 opacity-0 peer-hover:opacity-100 hover:opacity-100">
        <button
          onClick={handleVideoToggle}
          className="p-2 px-4 flex justify-center items-center bg-white w-full rounded-xl"
        >
          {videoEnabled ? (
            <FaVideoSlash size={32} className="text-gray-800" />
          ) : (
            <FaVideo size={32} className="text-gray-800" />
          )}
        </button>
        <button
          onClick={handleAudioToggle}
          className="p-2 px-4 flex justify-center items-center bg-white w-full rounded-xl"
        >
          {audioEnabled ? (
            <BsFillMicMuteFill size={32} className="text-gray-800" />
          ) : (
            <BsFillMicFill size={32} className="text-gray-800" />
          )}
        </button>
      </div>
    </div>
  );
}
