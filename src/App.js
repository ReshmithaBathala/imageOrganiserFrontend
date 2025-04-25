import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ImageUpload from "./components/ImageUpload/ImageUpload";
// import Login from "./components/Login/Login";
// import Register from "./components/Register/Register";
// import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="app-container">
      <Routes>
        {/* Protected Route - Only accessible when authenticated */}

        <Route
          path="/"
          element={
            <>
              <h1 className="title">Image Organizer</h1>
              <ImageUpload />
              {/* Decorative background elements */}
              <div className="decorative-circle circle-1"></div>
              <div className="decorative-circle circle-2"></div>
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="particle"
                  style={{
                    width: `${Math.random() * 10 + 5}px`,
                    height: `${Math.random() * 10 + 5}px`,
                    top: `${Math.random() * 100}vh`,
                    left: `${Math.random() * 100}vw`,
                    animationDelay: `${Math.random() * 5}s`,
                  }}
                ></div>
              ))}
            </>
          }
        />
        {/* Login Route */}
        {/* <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />

        {/* Register Route */}
        {/* <Route
          path="/register"
          element={<Register setIsAuthenticated={setIsAuthenticated} />} */}
        {/* /> */}

        {/* Fallback route for unknown paths */}
        {/* <Route path="*" element={<Navigate to="/login" replace />} />  */}
      </Routes>
    </div>
  );
}

// Router Wrapper Component
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
