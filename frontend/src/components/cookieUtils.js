// Importing js-cookie library for managing cookies
import Cookies from "js-cookie";

// Function to set user-related cookies with a 7-day expiry
const setCookies = (user) => {
  // Setting individual cookies for user details
  Cookies.set("id", user.id, { expires: 7 });
  Cookies.set("username", user.username, { expires: 7 });
  Cookies.set("email", user.email, { expires: 7 });
  Cookies.set("token", user.token, { expires: 7 });
};

// Function to retrieve user details from cookies
const getCookies = () => {
  return {
    username: Cookies.get("username"), // Get the username cookie
    id: Cookies.get("id"), // Get the user ID cookie
    token: Cookies.get("token"), // Get the token cookie
    email: Cookies.get("email"), // Get the email cookie
  };
};

// Function to remove all user-related cookies
const clearCookies = () => {
  // Removing each cookie by name
  Cookies.remove("username");
  Cookies.remove("id");
  Cookies.remove("token");
  Cookies.remove("email");
};

// Exporting functions for use in other parts of the application
export { setCookies, getCookies, clearCookies };
