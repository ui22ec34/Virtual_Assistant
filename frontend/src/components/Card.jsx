import React, { useContext } from 'react';
import { UserDataContext } from "../context/UserContext";

function Card({ image }) {
  const { serverUrl, userData, setUserData, selectedImage, setSelectedImage } = useContext(UserDataContext);

  return (
    <div
      className={`w-[190px] h-[250px] bg-[#030326] border-2 rounded-2xl cursor-pointer transition-shadow duration-300 overflow-hidden
      ${selectedImage === image ? "border-blue-700 shadow-2xl shadow-blue-700" : null}`}
      onClick={() => setSelectedImage(image)}
    >
      <img src={image} alt="assistant" className="w-full h-full object-cover" />
    </div>
  );
}

export default Card;
