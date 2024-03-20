import React, { createContext, useState, useEffect } from "react"

// Create a context for managing authentication state
export const AuthContext = createContext()

// AuthProvider component that will wrap the application and provide authentication context
export const AuthProvider = ({ children }) => {
  // State to manage the user's login status
  const [loggedIn, setLoggedIn] = useState(false)

  // Check if there is a token in local storage on component initialization
  useEffect(() => {
    const token = localStorage.getItem("token")
    // If a token is present, set loggedIn to true
    if (token) {
      setLoggedIn(true)
    }
  }, [])

  // Function to handle successful login
  const handleLoginSuccess = () => {
    setLoggedIn(true)
  }

  // Function to handle logout
  const handleLogout = () => {
    // Clear the token from local storage on logout
    localStorage.removeItem("token")
    // Set loggedIn to false
    setLoggedIn(false)
  }

  // Provide the AuthContext to the components in the application
  return (
    <AuthContext.Provider
      value={{ loggedIn, handleLoginSuccess, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// The AuthProvider component is responsible for managing authentication state and providing it to the rest of the application.
// It checks for the presence of a token in local storage during initialization and sets the loggedIn state accordingly.
// The handleLoginSuccess function is used to update the loggedIn state when a user successfully logs in.
// The handleLogout function is responsible for clearing the token from local storage and updating the loggedIn state when a user logs out.
// The AuthContext.Provider wraps the entire application and provides the authentication context to its child components.
