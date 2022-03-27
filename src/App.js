import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Blog from "./pages/blog";
import { PeerProvider } from "./context/peerContext";
import { QuillProvider } from "./context/quillContext";
import DashboardHome from "./components/dashboard";
import RequiredAuth from "./helpers/requiredAuth";
import Home from "./pages/home";
import IsLoggedIn from "./helpers/isLoggedIn";
import BlogUnknown from "./pages/blog-unknown";
import Profile from "./components/profile";

export default function App() {
  return (
    <Routes>
      <Route element={<IsLoggedIn pathToRedirect={"/dashboard"} />}>
        <Route index element={<Home />} />
        <Route
          path="/blogs/:blogId/anonymous"
          element={
            <PeerProvider>
              <QuillProvider>
                <BlogUnknown />
              </QuillProvider>
            </PeerProvider>
          }
        />
      </Route>
      <Route element={<RequiredAuth />}>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="home" element={<DashboardHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<h1>Settings</h1>} />
        </Route>
        <Route
          path="/blogs/:blogId"
          element={
            <PeerProvider>
              <QuillProvider>
                <Blog />
              </QuillProvider>
            </PeerProvider>
          }
        ></Route>
      </Route>
      <Route path="*" element={<h1>404 not found</h1>} />
    </Routes>
  );
}
