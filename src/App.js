import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Blog from "./pages/blog";
import { PeerProvider } from "./context/peerContext";
import { QuillProvider } from "./context/quillContext";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route
        path="/blogs/:blogId/:username"
        element={
          <PeerProvider>
            <QuillProvider>
              <Blog />
            </QuillProvider>
          </PeerProvider>
        }
      ></Route>
    </Routes>
  );
}
