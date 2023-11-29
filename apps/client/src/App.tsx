import React from "react";
import { Routes, Route } from "react-router-dom";
import * as router from "./routes";
import { LoginProvider } from "./context/loginContext";

function App() {
  return (
    <LoginProvider>
      <Routes>
        <Route path="/" Component={router.home} />
        <Route path="/ingame" Component={router.game} />
        <Route path="/ranking" Component={router.totalRanking} />
      </Routes>
    </LoginProvider>
  );
}

export default App;
