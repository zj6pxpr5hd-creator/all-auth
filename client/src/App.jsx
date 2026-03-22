import './App.css'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect } from 'react'
import AuthProvider from './auth/AuthProvider'


function App() {

  //const [isAuthed, setIsAuthed] = useState(false);

  useEffect

  return (
    
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />}/>
          <Route path="/dashboard" element={<Dashboard />}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>

  )
}

export default App
