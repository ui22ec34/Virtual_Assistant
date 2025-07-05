import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';


// Pages
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Customize from './Customize.jsx';
import Custom from './pages/Custom.jsx';
import Home from './pages/Home';

// Context
import { UserDataContext } from './context/UserContext';

function App() {
  const { userData, loading } = useContext(UserDataContext); // ← ensure you track loading

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/customize" element={<Customize />} />
      <Route path="/custom" element={<Custom />} />
    </Routes>
  );
}


export default App;
