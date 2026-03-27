import { createContext, useEffect, useMemo, useState, useCallback } from "react";
import React from 'react'

// Create an empty context object that will be used to share the authentication state and functions between components.
export const AuthContext = createContext();

// AuthProvider component that wraps the app to provide authentication context to all child components.
export const AuthProvider = ({ children }) => {
    // State to track whether the user is authenticated (true), not authenticated (false), or loading (undefined).
    const [isAuthed, setIsAuthed] = useState();

    // Retrieve the API URL from environment variables for making API calls.
    const API_URL = import.meta.env.VITE_API_URL;

    // Memoized context value that includes the authentication state. This prevents unnecessary re-renders of consumers.
    const contextValue = useMemo(() => ({
        isAuthed,
        setIsAuthed
    }), [isAuthed])

    // Function to authenticate the user by making an API call to the server.
    // Uses useCallback to memoize the function and prevent unnecessary re-creations.
    const authenticateUser = useCallback(async () => {
        // Make an API call to verify if the user is authenticated.
        try {

            const response = await fetch(`${API_URL}/api/auth/authenticate`, { credentials: "include" });

            const data = await response.json();

            if (!response.ok) {
                // If the response is not ok, throw an error indicating the user is not authenticated.
                throw new Error(data.message);
            } else {
                // If the response is ok, set the authentication state to true.
                setIsAuthed(true);
            }

        } catch (error) {
            // Log the error to the console and set authentication state to false.
            console.error(error);
            setIsAuthed(false);
        }
    }, [API_URL]);

    // useEffect hook to run the authentication check when the component mounts.
    // The dependency array includes authenticateUser to re-run if the function changes.
    useEffect(() => {
        authenticateUser();
    }, [authenticateUser])

    // Render the AuthContext.Provider to make the context available to child components.
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

// Export the AuthProvider as the default export.
export default AuthProvider;