import React from 'react';
import { Routes, Route } from 'react-router-dom';
import * as router from './routes';

function App() {
  return (
    <Routes>
      <Route path="/" Component={router.home}/>
      <Route path="/ingame" Component={router.game}/>
      <Route path="/ranking" Component={router.totalRanking}/>
    </Routes>
  );
}

export default App;
