import React, { useState } from 'react'
import '../styling/Register.css'

const Register = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if(!username.trim() || !password.trim()){
      return;
    }

    console.log("form has been sent")
  }

  return (
    <main className="register-page">
      <form className="register-card" onSubmit={handleSubmit}>
        <h1>Create account</h1>
        <p>Sign up with a username and password.</p>

        <div className="form-grid">
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              value={username}
              onChange={(e) => {setUsername(e.target.value);}}
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
              onChange={(e) => {setPassword(e.target.value)}}
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          <button className="submit-btn" type="submit">
            Register
          </button>
        </div>
      </form>
    </main>
  )
}

export default Register
