// export default Navbar
import React, { useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../AuthContext"
import "./Navbar.css"
import "./chef.css"

const Navbar = () => {
  const { loggedIn, handleLogout } = useContext(AuthContext)
  const userType = localStorage.getItem("userType")

  // useEffect(() => {
  //   tejas()
  // }, [])

  // const tejas = () => {
  //   const token = localStorage.getItem(token)
  //   console.log(token)
  // }

  return (
    <nav className="navbar">
      {/* Logo section */}
      <div className="logo">
        <Link className="button" to="/">
          Save
          <br />
          Aahaar
        </Link>
      </div>

      {/* Navigation links section */}
      <div className="reveal-text">
        <ul className="buttons">
          <li>
            <Link className="button" to="/donation">
              Donate
            </Link>
          </li>
          <li>
            <Link className="button" to="/inventory">
              Inventory
            </Link>
          </li>
          <li>
            <Link className="button" to="/ecopro">
              Kitchen Analytics
            </Link>
          </li>
          <li>
            {/* Dropdown for Chef's Corner */}
            <div className="button dropdownn">
              <button className="dropbtnn">Chef's Corner</button>
              {/* Dropdown content */}
              <div className="dropdown-contentt">
                <Link to="/recipeSearch">Recipe Search </Link>
                <Link to="/nutriAnalysis">Nutrition Analysis </Link>
                <Link to="/wasteAnalysis">Waste Analysis </Link>
              </div>
            </div>
          </li>

          {/* Dashboard link */}
          {loggedIn && (
            <li>
              <Link className="button" to="/dashboard">
                Dashboard
              </Link>
            </li>
          )}
        </ul>
      </div>

      {loggedIn ? (
        <div className="join-button">
          <p className="user-type">{`${userType.toUpperCase()} user`}</p>
          <Link className="join-button button" to="/" onClick={handleLogout}>
            LOG OUT
          </Link>
        </div>
      ) : (
        <div className="join-button">
          <Link className="join-button button" to="/login">
            LOG IN
          </Link>
        </div>
      )}
    </nav>
  )
}
export default Navbar
