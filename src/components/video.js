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
    <div className="relative flex flex-shrink-0 flex-col rounded-xl bg-gray-200">
      <video
        autoPlay
        playsInline
        className="peer h-40 w-52 rounded-xl object-cover lg:h-60 lg:w-80"
        ref={videoRef}
      ></video>
      {username && (
        <p className="pointer-events-none absolute top-2 right-2 w-40 truncate rounded-lg bg-white p-2 text-center font-nunito opacity-10 transition-opacity hover:opacity-100 peer-hover:opacity-100">
          {username}
        </p>
      )}
      <div className="absolute left-0 bottom-0 flex w-full items-center justify-center space-x-2 rounded-xl p-5 opacity-10 transition-opacity hover:opacity-100 peer-hover:opacity-100">
        <button
          onClick={handleVideoToggle}
          className="flex w-full items-center justify-center rounded-xl bg-white p-2 px-4"
        >
          {videoEnabled ? (
            <FaVideoSlash size={32} className="text-gray-800" />
          ) : (
            <FaVideo size={32} className="text-gray-800" />
          )}
        </button>
        <button
          onClick={handleAudioToggle}
          className="flex w-full items-center justify-center rounded-xl bg-white p-2 px-4"
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
