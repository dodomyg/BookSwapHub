import { createContext, useEffect, useState } from "react";
import axios from "axios";

// Axios setup
axios.defaults.withCredentials = true;

// Create the context
export const UserContext = createContext();

// Provider component

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Logged in user
  const [fine, setFine] = useState(false); // Fine state (e.g. for overdue books)
  const [chat, setChat] = useState([]); // Chat state (optional if used)

  useEffect(() => {
    getUser(setUser);
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, fine, setFine, chat, setChat }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const getUser = async (setUser) => {
  try {
    const { data } = await axios.get("http://localhost:8080/api/users/jwt");
    setUser(data);
    console.log("User loaded:", data);
  } catch (error) {
    console.error(
      "Failed to fetch user:",
      error?.response?.data?.error || error.message
    );
  }
};
