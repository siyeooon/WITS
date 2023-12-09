import React from "react";
import { Routes, Route } from "react-router-dom";
import * as router from "./routes";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <>
      <GoogleOAuthProvider clientId="221792790210-kvsrq8ti2al24c0g8oh2e9oldv71f64j.apps.googleusercontent.com">
        <Routes>
          <Route path="/" Component={router.home} />
          <Route path="/ingame" Component={router.game} />
          <Route path="/ranking" Component={router.ranking} />
        </Routes>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
