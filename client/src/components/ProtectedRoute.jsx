import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../auth/AuthProvider'


function ProtectedRoute({ children }) {

    const isAuthed = useContext(AuthContext);
    if(!isAuthed){
        return (
            <Navigate to="/register" replace />
        )
    }

    return children;

}

export default ProtectedRoute
