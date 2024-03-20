import React, { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Link as ScrollLink } from "react-scroll"

const SignUp = () => {
  // State variables for household sign-up
  const [householdName, setHouseholdName] = useState("")
  const [householdEmail, setHouseholdEmail] = useState("")
  const [householdPassword, setHouseholdPassword] = useState("")
  const [householdPhone, setHouseholdPhone] = useState("")

  // State variables for business sign-up
  const [businessName, setBusinessName] = useState("")
  const [businessEmail, setBusinessEmail] = useState("")
  const [businessPassword, setBusinessPassword] = useState("")
  const [businessPhone, setBusinessPhone] = useState("")

  // State variables for sign-up messages and countdown
  const [signUpMessage, setSignUpMessage] = useState("")
  const [countdown, setCountdown] = useState(10)

  // Hook for navigation in React Router
  const navigate = useNavigate()

  // Function to handle household sign-up
  const handleHouseholdSignUp = async (e) => {
    e.preventDefault()

    // Password validation regex
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

    // Password validation
    if (
      householdPassword !== "" &&
      householdEmail !== "" &&
      !passwordRegex.test(householdPassword)
    ) {
      setSignUpMessage(
        "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
      )
      return
    }

    // User data for household sign-up
    const userData = {
      name: householdName,
      email: householdEmail,
      password: householdPassword,
      phone: householdPhone,
      userType: "household",
    }

    try {
      // API call for household sign-up
      const response = await axios.post(
        "http://localhost:5000/signup",
        userData
      )

      // Success message and countdown for redirection
      setSignUpMessage("User Account Created Successfully")
      let timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1)
      }, 1000)

      // Redirect to login page after countdown
      setTimeout(() => {
        clearInterval(timer)
        navigate("/login") // Replace "/login" with the actual route to your login page
      }, 10000)
    } catch (error) {
      // Handle API call error
      if (error.response && error.response.data.error) {
        setSignUpMessage(error.response.data.error)
      } else {
        setSignUpMessage("Something went wrong")
      }
      console.log(error)
    }
  }

  // Function to handle business sign-up
  const handleBusinessSignUp = async (e) => {
    e.preventDefault()

    // Password validation regex
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

    // Password validation
    if (
      businessPassword !== "" &&
      businessEmail !== "" &&
      !passwordRegex.test(businessPassword)
    ) {
      setSignUpMessage(
        "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
      )
      return
    }

    // User data for business sign-up
    const businessData = {
      name: businessName,
      email: businessEmail,
      password: businessPassword,
      phone: businessPhone,
      userType: "business",
    }

    try {
      // API call for business sign-up
      const response = await axios.post(
        "http://localhost:5000/signup",
        businessData
      )

      // Success message and countdown for redirection
      setSignUpMessage("User Account Created Successfully")
      let timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1)
      }, 1000)

      // Redirect to login page after countdown
      setTimeout(() => {
        clearInterval(timer)
        navigate("/login") // Replace "/login" with the actual route to your login page
      }, 10000)
    } catch (error) {
      // Handle API call error
      if (error.response && error.response.data.error) {
        setSignUpMessage(error.response.data.error)
      } else {
        setSignUpMessage("Something went wrong")
      }
      console.log(error)
    }
  }

  return (
    <div className="signup-body">
      {/* Description Section */}
      <div className="wrapper">
        <div className="description">
          <h1 id="msg">
            Make a difference with{" "}
            <span className="site-name">SAVE Aahaar</span>
          </h1>
          <p>
            Sign up below to join our community and unlock a world of
            possibilities. <br />
            Fill out the form and let's get started on this journey together
          </p>
        </div>
      </div>

      {/* Display Sign-Up Message */}
      {signUpMessage && (
        <p
          className={`message ${
            signUpMessage
              ? signUpMessage === "User Account Created Successfully"
                ? "success"
                : "error"
              : ""
          }`}
        >
          {signUpMessage}
        </p>
      )}

      {/* Display Countdown Timer */}
      {signUpMessage === "User Account Created Successfully" &&
        countdown > 0 && (
          <p className="countdown-timer">
            Redirecting in <span className="timer">{countdown}</span> seconds to
            LOG IN...
          </p>
        )}

      {/* Sign-Up Form */}
      <div className="form-wrapper">
        {/* Household Sign-Up Section */}
        <div className="container-1">
          <h1>As a Household</h1>
          <form method="POST">
            {/* Household Form Inputs */}
            <div className="form-group">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                value={householdName}
                onChange={(e) => setHouseholdName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email ID"
                value={householdEmail}
                onChange={(e) => setHouseholdEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Create Password"
                value={householdPassword}
                onChange={(e) => setHouseholdPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Phone Number"
                value={householdPhone}
                onChange={(e) => setHouseholdPhone(e.target.value)}
                required
              />
            </div>
          </form>

          {/* Household Bullet Points */}
          <div className="bullet-points">
            <ul>
              <li>Full Access to our Algorithms</li>
              <li>Unlimited Donations</li>
              <li>Easily Track Food Waste</li>
              <li>Reduce Costs with Analysis</li>
              <li>Minimize Carbon Emissions</li>
              <li>Help the Unprivileged</li>
            </ul>
          </div>

          {/* Scroll Link and Sign-Up Button */}
          <ScrollLink to="msg" smooth={true} duration={500}>
            <button
              type="button"
              className="sign-upbtn"
              onClick={handleHouseholdSignUp}
            >
              SIGN UP
            </button>
          </ScrollLink>
        </div>

        {/* Business Sign-Up Section */}
        <div className="container2">
          <h1>As a Business</h1>
          <form method="POST">
            {/* Business Form Inputs */}
            <div className="form-group2">
              <input
                type="text"
                id="name2"
                name="name2"
                placeholder="Name of the Business"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
              />
            </div>
            <div className="form-group2">
              <input
                type="email"
                id="email2"
                name="email2"
                placeholder="Business Email ID"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group2">
              <input
                type="password"
                id="password2"
                name="password2"
                placeholder="Create Password"
                value={businessPassword}
                onChange={(e) => setBusinessPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group2">
              <input
                type="tel"
                id="phone2"
                name="phone2"
                placeholder="Contact Number"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                required
              />
            </div>
          </form>

          {/* Business Bullet Points */}
          <div className="bullet-points2">
            <ul>
              <li>Full Access to our Algorithms</li>
              <li>Unlimited Donations</li>
              <li>Cost Reductions & Higher Profit Margins</li>
              <li>Better Tax Implications</li>
              <li>Gain Competitive Advantage</li>
              <li>Minimize Carbon Emissions</li>
              <li>Help the Unprivileged</li>
            </ul>
          </div>

          {/* Scroll Link and Sign-Up Button */}
          <ScrollLink to="msg" smooth={true} duration={500}>
            <button
              type="button"
              className="sign-upbtn"
              onClick={handleBusinessSignUp}
            >
              SIGN UP
            </button>
          </ScrollLink>
        </div>
      </div>
    </div>
  )
}

export default SignUp
