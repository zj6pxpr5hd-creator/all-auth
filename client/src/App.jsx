import './App.css'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import AuthProvider from './auth/AuthProvider'
import ProtectedRoute from './components/ProtectedRoute'

function App() {


  return (
    
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />}/>
          <Route path="/" element={         
              <ProtectedRoute>
                <Dashboard />          
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>

  )
}

export default App
