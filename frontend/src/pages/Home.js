import React from "react"
import Content from "../components/Content"
import Problems from "../components/Problems"

// Home component represents the main page of the application
const Home = () => {
  return (
    <>
      {/* Display the Content component for main content on the home page */}
      <Content />

      {/* Display the Problems component for handling specific problems or challenges */}
      <Problems />
    </>
  )
}

export default Home
