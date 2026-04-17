import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import '../styling/Register.css'
import { AuthContext } from '../auth/AuthProvider';


const Register = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { setIsAuthed } = useContext(AuthContext);

  const handleSubmit = (event) => {
    event.preventDefault();

    if(!username.trim() || !password.trim()){
      return;
    }

    sendRegister();

    console.log("form has been sent")
  }

  const  sendRegister = async () => {
    setLoading(true)
    const data = { // user data
      username: username,
      password: password
    }
    try {
      
      const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' 
                },
                credentials: "include",
                body: JSON.stringify(data)
      });

      if(!response.ok){
        const data = await response.json(); //reads error message from api response
        throw new Error(data.message || `Server Error: ${response.status}`);//throws an error with message or general server error message    
      }

      const result = await response.json();
      
      console.log("success: ", result);
      setIsAuthed(true);
      navigate("/");

    } catch (err) {
      setError(err.message);
      console.log(err);
    } finally{
      setLoading(false);
    }
  };

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
          {error.length!==0 && <p>{error}</p>}
          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? "Loading" : "Register"}
          </button>
          <Link className="login" type="submit" disabled={loading} to = {{pathname: "/login"}}>
            Login
          </Link>          
        </div>
      </form>
      
    </main>
  )
}

export default Register
