import React, { useContext, useState } from "react"
import axios from "axios"
import { Button } from "@mui/material"
import { useNavigate } from "react-router-dom"

import { AuthContext } from "../AuthContext"

const Login = () => {
  // State variables for email, password, login message, and countdown
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginMessage, setLoginMessage] = useState("")
  const [countdown, setCountdown] = useState(5)

  // React Router's navigate hook
  const navigate = useNavigate()

  // Access the authentication context for handling login success
  const { handleLoginSuccess } = useContext(AuthContext)

  // Handle the login process
  const handleLogin = async (e) => {
    e.preventDefault()

    const userData = {
      email,
      password,
    }

    try {
      // Send a POST request to the login endpoint with user data
      const response = await axios.post("http://localhost:5000/login", userData)
      const data = response.data

      // Assuming login was successful and received a token in the response
      const token = data.token
      const userType = data.userType

      // Store the token in local storage for future authenticated requests
      localStorage.setItem("token", token)
      localStorage.setItem("userType", userType)

      // Display a success message
      setLoginMessage("Login Successfully")

      // Redirect to the home page after a countdown
      handleLoginSuccess()
      let timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1)
      }, 1000)

      setTimeout(() => {
        clearInterval(timer)
        navigate("/")
      }, 5000)
    } catch (error) {
      // Handle login errors
      if (error.response && error.response.data.error) {
        setLoginMessage(error.response.data.error)
      } else {
        setLoginMessage("Something went wrong")
      }
      console.log(error) // Log the error
    }
  }

  return (
    <div className="login-body">
      <section className="login-body-container">
        <div className="login-container">
          <div className="form-container">
            {/* Illustration */}
            <img
              src="https://raw.githubusercontent.com/hicodersofficial/glassmorphism-login-form/master/assets/illustration.png"
              alt="illustration"
              className="illustration"
            />
            <h1 className="opacity">LOGIN</h1>
            <form>
              {/* Email input */}
              <input
                type="email"
                placeholder="EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {/* Password input */}
              <input
                type="password"
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* Login button */}
              <Button className="login-button" onClick={handleLogin}>
                LOG IN
              </Button>
            </form>

            {/* Display login message */}
            {loginMessage && (
              <p
                className={`message login-msg ${
                  loginMessage
                    ? loginMessage === "Login Successfully"
                      ? "success"
                      : "error"
                    : ""
                }`}
              >
                {loginMessage}
              </p>
            )}

            {/* Display countdown timer after successful login */}
            {loginMessage === "Login Successfully" && countdown > 0 && (
              <p className="countdown-timer login-timer">
                Redirecting in <span className="timer">{countdown}</span>{" "}
                seconds to HOME...
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Login
