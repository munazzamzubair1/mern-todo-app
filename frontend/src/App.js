// Import necessary modules and components
import { AuthProvider, AuthContext } from "./context/ContextApi"; // Import AuthProvider and context for user auth
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"; // Import React Router components
import "./App.css"; // Import App's CSS
import { useContext } from "react"; // Import useContext to access global state
import Navbar from "./components/Navbar"; // Import Navbar
import Home from "./pages/Home"; // Import Home page
import Tasks from "./pages/Tasks"; // Import Tasks page
import NoPage from "./pages/NoPage"; // Import NoPage for unknown routes
import Profile from "./pages/Profile"; // Import Profile page
import Login from "./pages/Login"; // Import Login page
import Signup from "./pages/Signup"; // Import Signup page
import AddTask from "./pages/AddTask"; // Import AddTask page
import UpdateTask from "./pages/UpdateTask"; // Import UpdateTask page
import UdpateProfile from "./pages/UdpateProfile"; // Import UpdateProfile page
import Footer from "./components/Footer"; // Import Footer component
import SingleTask from "./pages/SingleTask"; // Import SingleTask page

// Main App Component wrapped with AuthProvider to provide context to all children
function App() {
  return (
    <div
      className="App"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <AuthProvider>
        {" "}
        {/* Provide authentication context to the app */}
        <MainApp />
      </AuthProvider>
    </div>
  );
}

// MainApp Component with routing logic
function MainApp() {
  const { user } = useContext(AuthContext); // Access user authentication state from context

  return (
    <Router>
      <Navbar /> {/* Render Navbar */}
      <Routes>
        {/* Home Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        {/* Authentication Routes */}
        {/* If user is not logged in, show Login and Signup, otherwise redirect to Tasks */}
        {!user.username ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Navigate to="/tasks" replace />} />
            <Route path="/signup" element={<Navigate to="/tasks" replace />} />
          </>
        )}

        {/* Authenticated Routes */}
        {/* If user is logged in, allow access to tasks, profile, and task management routes */}
        {user.username ? (
          <>
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/addtask" element={<AddTask />} />
            <Route path="/updatetask" element={<UpdateTask />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/updateprofile" element={<UdpateProfile />} />
            <Route path="/singletask" element={<SingleTask />} />
          </>
        ) : (
          // Redirect unauthenticated users trying to access restricted pages to login page
          <>
            <Route path="/tasks" element={<Navigate to="/login" replace />} />
            <Route path="/addtask" element={<Navigate to="/login" replace />} />
            <Route
              path="/updatetask"
              element={<Navigate to="/login" replace />}
            />
            <Route path="/profile" element={<Navigate to="/login" replace />} />
            <Route
              path="/updateprofile"
              element={<Navigate to="/login" replace />}
            />
            <Route
              path="/singletask"
              element={<Navigate to="/login" replace />}
            />
          </>
        )}

        {/* Catch-all Route for undefined paths */}
        <Route path="*" element={<NoPage />} />
      </Routes>
      <Footer /> {/* Render Footer */}
    </Router>
  );
}

export default App;
