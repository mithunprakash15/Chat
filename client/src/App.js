import React from 'react';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatPage from './Components/ChatPage';
import Login from './Components/Login';
import Register from './Components/Register';

function App() {
  

  return (
    <Router>
    <div>
    <Routes>
    <Route path="/" element={<Login />} />
    <Route path='/register' element={<Register />} />
     <Route path ="/chat/:username" element={<ChatPage />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
