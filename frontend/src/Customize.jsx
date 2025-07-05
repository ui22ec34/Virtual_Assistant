import React, { useContext } from 'react';
import Card from './components/Card';
import { UserDataContext } from './context/UserContext';
import Navbar from './pages/Navbar';

import r8 from './assets/r8.jpg';
import f4 from './assets/f4.jpg';
import r3 from './assets/r3.jpg';
import f8 from './assets/f8.jpg';
import n1 from './assets/n1.jpg';
import r5 from './assets/r5.jpg';
import image7 from './assets/image7.jpg';

import { useNavigate } from 'react-router-dom';
import { MdKeyboardBackspace } from 'react-icons/md';

function Customize() {
  const {
    serverUrl,
    userData,
    setUserData,
    selectedImage,
    setSelectedImage,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
  } = useContext(UserDataContext);

  const navigate = useNavigate();

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#020236] p-4 flex flex-col justify-center items-center gap-y-6 relative">
      

      <MdKeyboardBackspace
        className="absolute top-[30px] left-[30px] text-white cursor-pointer w-[25px] h-[25px]"
        onClick={() => navigate("/")}
      />

      <h1 className="text-white text-3xl font-bold" style={{ fontFamily: 'Times New Roman' }}>
        Select your Assistant Image
      </h1>

      
      <div className="flex justify-center gap-x-14 flex-wrap">
        <Card image={r5} />
        <Card image={f4} />
        <Card image={r8} />
        <Card image={f8} />
      </div>

      
      <div className="flex justify-center gap-x-14 flex-wrap">
        <Card image={n1} />
        <Card image={r3} />
        <Card image={image7} />
      </div>

     
      {selectedImage && (
        <button
          className="mt-4 px-6 py-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition duration-300 shadow-md hover:shadow-lg"
          onClick={() => navigate("/custom")}
        >
          Next
        </button>
      )}
    </div>
  );
}

export default Customize;
