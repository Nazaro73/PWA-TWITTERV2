import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import UserProfile from "./pages/UserProfile"
import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="app-container">
      {isAuthenticated && <Navbar />}
      <div className="container mt-4">
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/:userId"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  )
}

export default App

