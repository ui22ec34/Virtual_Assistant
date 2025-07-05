import React, { createContext, useEffect, useState } from 'react';
import axios from "axios";
import Navbar from '../pages/Navbar';


export const UserDataContext = createContext();

function UserContext({ children }) {
  const serverUrl = "http://localhost:8000";

  const [userData, setUserData] = useState(null);
  const [selectedImage,setSelectedImage] = useState(null);
  const [backendImage,setBackendImage] = useState(null);
  const [frontendImage,setFrontendImage] = useState(null);

  const handleCurrentUser = async ()=>{
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
      setUserData(result.data)
      console.log(result.data)
    } catch (error) {
      console.log(error)
    }
  }


  const getGeminiResponse = async (command)=>{
    try {
      const result = await axios.post(`${serverUrl}/api/user/asktoassistant`,{command},
        {withCredentials:true})
        return result.data
    } catch (error) {
      console.log(error)
    }
  }
  
  useEffect(()=>{
    handleCurrentUser()
  },[])

  const value = {
    serverUrl,
    userData,
    setUserData,
    selectedImage,
    setSelectedImage,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    getGeminiResponse 
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export default UserContext;
