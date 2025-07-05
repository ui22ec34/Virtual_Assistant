// Navigate.jsx or Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ marginTop: '10px' }}>
      <Link to="/signin" style={{ marginRight: '10px' }}>Sign In</Link>
      <Link to="/signup" style={{ marginRight: '10px' }}>Sign Up</Link>
      <Link to="/customize" style={{ marginRight: '10px' }}>Customize</Link>
      <Link to="/custom" style={{ marginRight: '10px' }}>Custom</Link>
    </nav>
  );
};

export default Navbar;

