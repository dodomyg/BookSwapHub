// App.js
import React, { useContext } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { UserContext } from './context/UserContext';
import Register from './components/pages/Register';
import Login from './components/pages/Login';
import Home from './components/pages/Home';
import About from './components/About/About';
import SinglePage from './components/SinglePage/SinglePage';
import Profile from './components/Profile/Profile';
import Navbar from './components/Navbar/Navbar';
import CreateBook from './components/CreateBook/CreateBook';
import LandingPage from './components/pages/LandingPage';
import Preferences from './components/pages/Preferences';
import CommunityChat from './components/CommunityChat/CommunityChat';
import { IconButton } from '@chakra-ui/react';
import { IoChatboxOutline } from 'react-icons/io5';

const App = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <div>
      <IconButton
        onClick={() => navigate('/community')}
        zIndex={1000}
        position="fixed"
        bottom={6}
        right={6}
        isRound={true}
        variant="solid"
        display={user && !window.location.pathname.split('/').includes('community') ? 'flex' : 'none'}
        alignItems="center"
        justifyContent="center"
        colorScheme="orange"
        aria-label="Community Chat"
        boxSize="70px"
        icon={<IoChatboxOutline size={36} />}
      />
      {user && !window.location.pathname.split('/').includes('community') && <Navbar />}

      <Routes>
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/landing" element={!user ? <LandingPage /> : <Navigate to="/" />} />
        <Route path="/preferences" element={user ? <Preferences /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <Home /> : <Navigate to="/landing" />} />
        <Route path="/create" element={user ? <CreateBook /> : <Navigate to="/" />} />
        <Route path="/community" element={user ? <CommunityChat /> : <Navigate to="/" />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/book/:bookId" element={<SinglePage />} />
      </Routes>
    </div>
  );
};

export default App;
