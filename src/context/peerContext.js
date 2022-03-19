import React, { createContext, useContext, useState, useEffect } from "react";
import Peer from "peerjs";
const PeerContext = createContext(null);

export const usePeer = () => {
  return useContext(PeerContext);
};

const SERVER_HOST = process.env.REACT_APP_SERVER_HOST;

export function PeerProvider({ children }) {
  const [peer, setPeer] = useState(null);

  useEffect(() => {
    const p = new Peer({
      host: SERVER_HOST,
      path: "/peerjs",
      secure: true,
    });
    setPeer(p);

    return () => {
      p.destroy();
    };
  }, []);

  const value = { peer };

  return <PeerContext.Provider value={value}>{children}</PeerContext.Provider>;
}
