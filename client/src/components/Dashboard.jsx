import React, { useContext } from 'react'
import '../styling/Dashboard.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthContext } from '../auth/AuthProvider';

const Dashboard = () => {
  
  const [error, setError ] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { setIsAuthed } = useContext(AuthContext);

  const Logout = async () => {


    try {      

      const result = await fetch( `${API_URL}/api/auth/logout`, { 
        method: "POST",
        credentials: "include" });
    
      if(!result.ok){
        throw new Error({message: "Failed to log out"});
      } else {
        setIsAuthed(false);
        navigate("/register");
      }


    } catch (error) {
        console.error(error.message);
        setError(error.message)
    }
    

  };


  return (
    <main className="page">
      <div className="blobA" aria-hidden="true" />
      <div className="blobB" aria-hidden="true" />
      <section className="card">
        <p className="kicker">Welcome back</p>
        <h1 className="title">Dashboard</h1>
        <p className="subtle">A soft, steady view of your workspace.</p>

        <div className="visualRow">
          <div className="highlightCard">
            <div className="highlightHeader">
              <span className="highlightLabel">Profile snapshot</span>
            </div>
            <ul className="highlightList">
              <li className="highlightItem">
                <span className="highlightKey">Role</span>
                <span className="highlightText">Student</span>
              </li>
              <li className="highlightItem">
                <span className="highlightKey">Stack</span>
                <span className="highlightText">React, Node, PostgreSQL</span>
              </li>
              <li className="highlightItem">
                <span className="highlightKey">Focus</span>
                <span className="highlightText">Auth, backend, clean UX</span>
              </li>
            </ul>
          </div>

          <div className="impactCard">
            <div className="impactBadge">Project highlight</div>
            <p className="impactTitle">Production-ready auth flow</p>
            <p className="impactText">
              Secure sessions, protected routes, and a polished onboarding
              experience with a consistent visual system.
            </p>
            <div className="impactChips">
              <span className="chip">JWT + Cookies</span>
              <span className="chip">Protected Routes</span>
              <span className="chip">UI Consistency</span>
            </div>
          </div>
        </div>

        <button onClick={Logout} type="button" className="logoutButton">
          Logout
        </button>
        {error.lenght !== 0 && <p>{error}</p>}
      </section>
    </main>
  )
}
export default Dashboard
