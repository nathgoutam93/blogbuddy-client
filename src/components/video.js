import React, { useEffect, useState, useRef } from "react";
import { BsFillMicMuteFill, BsFillMicFill } from "react-icons/bs";
import { FaVideoSlash, FaVideo } from "react-icons/fa";
import PropTypes from "prop-types";

export default function Video({
  stream,
  constraint = { video: true, audio: true },
  isLocal,
  username
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
    <div className="relative flex flex-col flex-shrink-0 bg-gray-200 rounded-xl">
      <video
        autoPlay
        playsInline
        className="w-52 lg:w-80 h-40 lg:h-60 object-cover rounded-xl peer"
        ref={videoRef}
      ></video>
      {username && (
        <p className="absolute top-2 w-40 right-2 p-2 text-center font-nunito truncate bg-white rounded-lg opacity-10 peer-hover:opacity-100 hover:opacity-100 transition-opacity pointer-events-none">
          {username}
        </p>
      )}
      <div className="absolute left-0 bottom-0 w-full p-5 flex justify-center items-center rounded-xl space-x-2 opacity-10 peer-hover:opacity-100 hover:opacity-100 transition-opacity">
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

Video.propTypes = {
  stream: PropTypes.object,
  constraint: PropTypes.object,
  isLocal: PropTypes.bool,
  username: PropTypes.string
};
