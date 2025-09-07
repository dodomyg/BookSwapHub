import { createContext, useEffect, useState } from "react";
import axios from "axios";


axios.defaults.withCredentials = true;


export const UserContext = createContext();


export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); 

  
  useEffect(() => {
    getUser(setUser);  
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};


export const getUser = async (setUser) => {
  try {
    const { data } = await axios.get("https://bookswaphub-ejar.onrender.com/api/users/jwt");
    setUser(data); 
  } catch (error) {
    console.error("Failed to fetch user:", error?.response?.data?.error || error.message);
    setUser(null); 
  }
};
