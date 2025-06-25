import React, { useContext } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";
import Home from "./components/pages/Home";
import About from "./components/About/About";
import SinglePage from "./components/SinglePage/SinglePage";
import { UserContext } from "./context/UserContext";
import Profile from "./components/Profile/Profile";
import Navbar from "./components/Navbar/Navbar";
import CreateBook from "./components/CreateBook/CreateBook";
import LandingPage from "./components/pages/LandingPage";
import Preferences from "./components/pages/Preferences";

const App = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <div>
      {user && <Navbar />}
      <Routes>
        <Route path="*" element={<Navigate to="/" />} />
        <Route
          path="/landing"
          element={!user ? <LandingPage /> : <Navigate to="/" />}
        />
        <Route
          path="/preferences"
          element={user ? <Preferences /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to={"/"} />}
        />
        <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/landing" />}
        />
        <Route
          path="/create"
          element={user ? <CreateBook /> : <Navigate to="/" />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/book/:bookId" element={<SinglePage />} />
      </Routes>
    </div>
  );
};

export default App;
