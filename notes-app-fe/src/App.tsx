import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import { NotesProvider } from './context/NotesContext';
import { SocketProvider } from './context/SocketContext';

const App: React.FC = () => {
  return (
    <SocketProvider>
    <NotesProvider>
     <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      
    </Router>
    </NotesProvider>
    </SocketProvider>
   
  );
};

export default App;