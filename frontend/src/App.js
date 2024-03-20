import "./App.css"
import React from "react"
import { Route, Routes } from "react-router-dom"

import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Footer from "./components/Footer"
import Donation from "./pages/Donation"
import Inventory from "./pages/Inventory"
import SignUp from "./pages/SignUp"
import Login from "./pages/Login"

import { AuthProvider } from "./AuthContext"
import EcoProgress from "./pages/ECOProgress"
import Waste from "./pages/Waste"
import RecipeSearch from "./pages/RecipeSearch"
import NutritionAnalysis from "./pages/NutritionAnalysis"
import Dashboard from "./components/dashboard"

// App component that serves as the main entry point of the application
function App() {
  return (
    // Wrap the entire application with the AuthProvider to manage authentication state
    <AuthProvider>
      {/* Include the navigation bar component */}
      <Navbar />
      {/* Define the application routes using React Router's Routes */}
      <Routes>
        {/* Home route */}
        <Route path="/" element={<Home />} />

        {/* Donation route */}
        <Route path="/donation" element={<Donation />} />

        {/* Inventory route */}
        <Route path="/inventory" element={<Inventory />} />

        {/* SignUp route */}
        <Route path="/signup" element={<SignUp />} />

        {/* RecipeSearch route */}
        <Route path="/recipeSearch" element={<RecipeSearch />}></Route>

        {/* Waste route */}
        <Route path="/wasteAnalysis" element={<Waste />}></Route>

        {/* NutritionAnalysis route */}
        <Route path="/nutriAnalysis" element={<NutritionAnalysis />}></Route>

        {/* Dashboard route */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Login route */}
        <Route path="/login" element={<Login />}></Route>

        {/* EcoProgress route */}
        <Route path="/ecopro" element={<EcoProgress />}></Route>
      </Routes>
      {/* Include the footer component */}
      <Footer />
    </AuthProvider>
  )
}

// Export the App component as the default export
export default App
