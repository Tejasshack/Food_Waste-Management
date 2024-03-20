// Import necessary libraries and components
import React, { useContext, useEffect, useState } from "react"
import { AuthContext } from "../AuthContext"
import L from "leaflet"
import axios from "axios"
import { useLocation, useParams, useNavigate } from "react-router-dom"
import MenuItem from "@mui/material/MenuItem"
import { Modal, Box, Paper, Typography, TextField, Button } from "@mui/material"
// import L from "leaflet"

const Donation = () => {
  const { requestId } = useParams()
  const Navigate = useNavigate()

  // Access the loggedIn state from the AuthContext
  const { loggedIn } = useContext(AuthContext)

  // Use the useLocation hook to get the state
  const location = useLocation()
  const requestDetails = location.state && location.state.requestDetails

  // State to hold donation form data, messages, inventory data, and selected inventory item
  const [donationData, setDonationData] = useState({
    name: "",
    email: "",
    amount: "",
    donationDate: new Date(),
    location: "",
    city: "",
    selectedInventoryItem: "", // New state to store selected inventory item
  })

  const [donationMessage, setDonationMessage] = useState("")
  const [inventoryData, setInventoryData] = useState([])

  // Fetch inventory data when the component mounts
  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("No token found")
        }

        const response = await axios.get("http://localhost:5000/inventory", {
          headers: {
            Authorization: token,
          },
        })

        const data = response.data
        setInventoryData(data)
      } catch (error) {
        console.error("Error fetching inventory data:", error)
      }
    }

    if (loggedIn) {
      fetchInventoryData()
    }
  }, [loggedIn])

  useEffect(() => {
    // Update the state with pre-filled data when the component mounts
    if (location.state && location.state.requestDetails) {
      const { requestDetails } = location.state
      setDonationData((prevData) => ({
        ...prevData,
        name: requestDetails.requestedBy,
        // ... (other fields based on requestDetails)
      }))
    }
  }, [location.state])

  useEffect(() => {
    // Update the state with pre-filled data when the component mounts
    if (requestDetails) {
      setDonationData((prevData) => ({
        ...prevData,
        name: requestDetails.requestedBy,
        // ... (other fields based on requestDetails)
      }))
    }
  }, [requestDetails])

  // Function to handle the submission of donation data
  // Function to handle the submission of donation data
  const handleDonationSubmit = async (e) => {
    try {
      e.preventDefault() // Move this line here to ensure 'e' is defined

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No token found")
      }

      // Make an API request to submit donation data
      const response = await axios.post(
        "http://localhost:5000/donate",
        {
          ...donationData,
          // If a selected item exists, add it to the request
          selectedItem: donationData.selectedInventoryItem,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )

      const data = response.data
      console.log("Donation data:", data)
      setDonationMessage("Donation Made Successfully")

      if (requestId) {
        // You need to make an API request to update the request status
        await axios.put(
          `http://localhost:5000/fulfill-donation-request/${data.requestId}`
        )
      }

      // Redirect to the Dashboard after successful donation
      setTimeout(() => {
        Navigate("/dashboard")
      }, 5000)
    } catch (error) {
      if (error.response && error.response.data.error) {
        setDonationMessage(error.response.data.error)
      } else {
        setDonationMessage("Something went wrong")
      }
      console.log(error)
    }
  }

  // useEffect to initialize the map and enable auto-fill functionality
  useEffect(() => {
    const initializeMap = () => {
      const map = L.map("map").setView([22.3511148, 78.6677428], 5)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map)

      const marker = L.marker([20.5937, 78.9629], { draggable: true }).addTo(
        map
      )

      marker.on("dragend", function (event) {
        const latlng = event.target.getLatLng()

        // Reverse geocoding to get address based on marker's location
        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`
        )
          .then((response) => response.json())
          .then((data) => {
            setDonationData((prevData) => ({
              ...prevData,
              location: data.display_name,
              city: data.address.city || "",
            }))
          })
      })
    }

    initializeMap()
  }, [])

  return (
    <div className="donation-body">
      {/* Header and Description */}
      <div className="head-description">
        <h1>
          Donate Food with <span className="site-name">Save Aahaar</span>
        </h1>
        <p>
          "Food donation is not just about filling empty stomachs; it's about
          nourishing hope, feeding compassion, and cultivating a brighter future
          for all."
        </p>
      </div>

      {/* Main Donation Form Container */}
      <div className="main-container">
        {/* Donation Form */}
        <div className="donateform-container">
          <h1>DONATE FOOD</h1>
          <form>
            {/* Form Inputs */}
            {/* Name */}
            <div className="name-id">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name or Business Name"
                value={donationData.name}
                onChange={(e) =>
                  setDonationData({ ...donationData, name: e.target.value })
                }
                required
              />
            </div>
            {/* Email */}
            <div className="password">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={donationData.email}
                onChange={(e) =>
                  setDonationData({ ...donationData, email: e.target.value })
                }
                required
              />
            </div>
            {/* Estimated Amount */}
            <div className="amount">
              <input
                type="number"
                id="amount"
                name="amount"
                placeholder="Estimated Amount"
                value={donationData.amount}
                onChange={(e) =>
                  setDonationData({ ...donationData, amount: e.target.value })
                }
                required
              />
            </div>
            {/* Location and City */}
            <div className="location">
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Address"
                value={donationData.location}
                onChange={(e) =>
                  setDonationData({ ...donationData, location: e.target.value })
                }
                required
              />
            </div>
            <div className="city">
              <input
                type="text"
                id="city"
                name="city"
                placeholder="City"
                value={donationData.city}
                onChange={(e) =>
                  setDonationData({ ...donationData, city: e.target.value })
                }
                required
              />
            </div>
            {/* Dropdown list for Inventory Data */}
            <div className="inventory-dropdown">
              <TextField
                select
                label="Select an item from your inventory"
                variant="outlined"
                fullWidth
                value={donationData.selectedInventoryItem}
                onChange={(e) =>
                  setDonationData({
                    ...donationData,
                    selectedInventoryItem: e.target.value,
                  })
                }
              >
                <MenuItem value="">Select an item from your inventory</MenuItem>
                {inventoryData.map((item) => (
                  <MenuItem key={item._id} value={item.itemName}>
                    {item.itemName} - {item.itemQuantity} items
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </form>
          {/* Donation Button */}
          {loggedIn ? (
            <button
              type="button"
              className="donate-btn"
              onClick={handleDonationSubmit}
            >
              DONATE
            </button>
          ) : (
            <button type="button" className="donate-btn" disabled>
              LOG IN TO DONATE
            </button>
          )}
          {/* Donation Message */}
          {donationMessage && (
            <p
              className={`message ${
                donationMessage
                  ? donationMessage === "Donation Made Successfully"
                    ? "success"
                    : "error"
                  : ""
              }`}
            >
              {donationMessage}
            </p>
          )}
        </div>

        {/* Map Container */}
        <div
          className="map-container"
          id="map"
          style={{ width: "50%", height: "510px" }}
        ></div>
      </div>
    </div>
  )
}

export default Donation
