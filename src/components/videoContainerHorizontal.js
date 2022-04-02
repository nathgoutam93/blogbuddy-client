import React from "react";
import { usePeer } from "../context/peerContext";
import { useUser } from "../context/userContext";
import Video from "./video";
import PropTypes from "prop-types";

export default function VideoContainerHorizontal({
  localStream,
  mediaConnections,
  dataConnections
}) {
  const { peer } = usePeer();
  const { userData } = useUser();

  return (
    <div className="flex space-x-2 overflow-x-auto p-2">
      {peer != null && localStream != null && (
        <Video
          key={peer.id}
          stream={localStream}
          constraint={{ video: false, audio: false }}
          isLocal={true}
          username={userData?.username || "You"}
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
  );
}

VideoContainerHorizontal.propTypes = {
  localStream: PropTypes.object,
  mediaConnections: PropTypes.object,
  dataConnections: PropTypes.object
};
