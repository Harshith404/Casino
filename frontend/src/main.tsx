import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'
import ProtectedRoute from "./ProtectedRoute";
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import Leaderboard from './pages/Leaderboard'
import Admin from './pages/Admin'
import AdminRoute from "./AdminRoute";
import Profile from "./pages/Profile";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
        <Route path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
        <Route path="/leaderboard" element={<Leaderboard/>} />
        <Route path="/admin" 
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
/>
        <Route path="/profile" element={
        <ProtectedRoute>
            <Profile />
        </ProtectedRoute>
    }
/>
      </Routes>
    </BrowserRouter>
   </AuthProvider> 
  </StrictMode>
)