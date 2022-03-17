import React, { createContext, useContext, useState, useEffect } from "react";
import Peer from "peerjs";
const PeerContext = createContext(null);

export const usePeer = () => {
  return useContext(PeerContext);
};

export function PeerProvider({ children }) {
  const [peer, setPeer] = useState(null);

  useEffect(() => {
    const p = new Peer({
      host: "192.168.43.24",
      port: 5000,
      path: "/peerjs",
    });
    setPeer(p);

    return () => {
      p.destroy();
    };
  }, []);

  const value = { peer };

  return <PeerContext.Provider value={value}>{children}</PeerContext.Provider>;
}
