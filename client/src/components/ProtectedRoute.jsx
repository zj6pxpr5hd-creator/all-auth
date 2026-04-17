import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../auth/AuthProvider'
import Loading from './Loading';

function ProtectedRoute({ children }) {

    const {isAuthed} = useContext(AuthContext);
    if(isAuthed === false){
        return (
            <Navigate to="/register" replace />
        )
    }
    
    if(isAuthed){
        return children;
    }
    
    if(isAuthed == undefined){
        return (
        <>
            <Loading />
        </>
        );
    }

}

export default ProtectedRoute;
