import { React, useContext } from "react"
import BCKVID from "../assets/backgroundVideo.mp4"
import { Link } from "react-router-dom"
import { AuthContext } from "../AuthContext"

const Content = () => {
  // Accessing login status from the authentication context
  const { loggedIn } = useContext(AuthContext)

  return (
    <>
      {/* Layer for styling purposes */}
      <div id="layer"></div>

      {/* Video background */}
      <div className="video-background">
        <video autoPlay loop muted>
          <source src={BCKVID} type="video/mp4" />
        </video>
      </div>

      {/* Main content */}
      <div className="content">
        {/* Main heading */}
        <h1>
          <div className="main-heading">
            {/* First line of the heading */}
            <div className="head-sentence1">
              <span className="quote">" </span>
              <span className="reduce">Reduce</span>{" "}
              <span className="food-waste">Food Waste</span>
            </div>

            {/* Second line of the heading */}
            <div className="head-sentence2">
              One Meal at a Time<span className="quote"> ! "</span>
            </div>
          </div>
        </h1>
        {/* Main paragraph */}
        <p className="paragraph">
          <span className="highlight">
            Save Aahaar's technology allows businesses & people to revolutionize{" "}
            <br />
            food donation, empower communities, and foster sustainable
            solutions.
          </span>
        </p>
        {/* Conditional rendering based on login status */}
        {loggedIn ? (
          // Displayed when the user is logged in
          <div className="logged-in-text">
            <p>Welcome Back !</p>
          </div>
        ) : (
          // Displayed when the user is not logged in
          <div className="signup-container">
            {/* Signup button for non-logged in users */}
            <Link className="signup-button" to="/signup">
              <span className="highlight2">SIGN UP TO SAVE</span>
            </Link>
          </div>
        )}
        {/* Semicolon at the end of the component */};
      </div>
    </>
  )
}

export default Content
