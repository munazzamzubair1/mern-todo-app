import { createContext, useState, useEffect } from "react";
import {
  getCookies,
  setCookies,
  clearCookies,
} from "../components/cookieUtils";

// Create the AuthContext to provide user state and authentication functions
const AuthContext = createContext();

// AuthProvider component to manage user state and authentication actions
const AuthProvider = ({ children }) => {
  // State to store user data (username, email, id, token)
  const [user, setUser] = useState({
    username: "",
    id: "",
    email: "",
    token: "",
  });

  // Check if user details are available in cookies on initial load
  useEffect(() => {
    const { username, email, id, token } = getCookies(); // Retrieve user data from cookies
    if (username) {
      // If user is found in cookies, set the user state
      setUser({ username, email, id, token });
    }
  }, []); // Empty dependency array means this runs only once on mount

  // Function to log in the user and save their details in both state and cookies
  const loginUser = (data) => {
    const { username, email, id, token } = data;
    if (username) {
      setUser({ username, email, id, token }); // Set user state
      setCookies({ username, email, id, token }); // Save user data to cookies
    }
  };

  // Function to log out the user and clear their data from state and cookies
  const logoutUser = () => {
    setUser({ username: "", email: "", id: "", token: "" }); // Clear user state
    clearCookies(); // Remove user data from cookies
  };

  // Function to delete the user (same as logout in this case)
  const deleteUser = () => {
    setUser({ username: "", email: "", id: "", token: "" }); // Clear user state
    clearCookies(); // Clear cookies as well
  };

  // Provide the user state and authentication functions to the rest of the app
  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, deleteUser }}>
      {children} {/* Render child components */}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext }; // Export the AuthProvider and AuthContext
