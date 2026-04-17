import './App.css'
import Register from './components/Register'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import AuthProvider from './auth/AuthProvider'
import ProtectedRoute from './components/ProtectedRoute'
import Loading from './components/Loading'

function App() {


  return (
    
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/loading" element={<Loading />}/>
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
