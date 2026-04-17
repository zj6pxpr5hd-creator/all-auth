import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../styling/Login.css'
import { AuthContext } from '../auth/AuthProvider';

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const API_URL = import.meta.env.VITE_API_URL
  const navigate = useNavigate()
  const { setIsAuthed } = useContext(AuthContext);

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!username.trim() || !password.trim()) {
      return
    }

    sendLogin()
  }

  const sendLogin = async () => {
    setLoading(true)
    const data = {
      username: username,
      password: password,
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || `Server Error: ${response.status}`)
      }

      const result = await response.json()
      console.log('success: ', result)
      setIsAuthed(true);
      navigate('/')
    } catch (err) {
      setError(err.message)
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Welcome back</h1>
        <p>Sign in with your username and password.</p>

        <div className="form-grid">
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              value={username}
              onChange={(e) => { setUsername(e.target.value) }}
              id="username"
              name="username"
              type="text"
              placeholder="yourname"
              autoComplete="username"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              value={password}
              onChange={(e) => { setPassword(e.target.value) }}
              id="password"
              name="password"
              type="password"
              placeholder="Your password"
              autoComplete="current-password"
              required
            />
          </div>

          {error.length !== 0 && <p>{error}</p>}

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? 'Loading' : 'Login'}
          </button>
          <Link className="register" type="submit" disabled={loading} to = {{pathname: "/register"}}>
            Register
          </Link>     
        </div>
      </form>
    </main>
  )
}

export default Login
