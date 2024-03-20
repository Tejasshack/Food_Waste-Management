import React, { useContext, useEffect, useState } from "react"
import axios from "axios"
import { AuthContext } from "../AuthContext"
import { Typography } from "@mui/material"
import { Bar } from "react-chartjs-2"

// Component to display monthly waste chart for logged-in users
const MonthlyWaste = () => {
  // Access authentication state from AuthContext
  const { loggedIn } = useContext(AuthContext)
  // State to store monthly waste data
  const [monthlyWaste, setMonthlyWaste] = useState([])
  // Array representing month names
  const MONTHS = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ]
  // Style for chart container
  const chartContainerStyle = {
    margin: "98px",
  }

  // Fetch monthly waste data on component mount or when login status changes
  useEffect(() => {
    if (loggedIn) {
      fetchMonthlyWaste()
    }
  }, [loggedIn])

  // Function to fetch monthly waste data from the server
  const fetchMonthlyWaste = async () => {
    try {
      // Get the authentication token from local storage
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No token found")
      }

      // Make a GET request to the server to fetch monthly waste data
      const response = await axios.get("http://localhost:5000/waste", {
        headers: {
          Authorization: token,
        },
      })

      // Extract data from the response
      const data = response.data

      // Calculate monthly waste
      const wasteByMonth = {}
      data.forEach((item) => {
        const month = new Date(item.foodWasteDate).getMonth()
        const quantity = item.foodQuantity
        if (wasteByMonth[month]) {
          wasteByMonth[month] += quantity
        } else {
          wasteByMonth[month] = quantity
        }
      })

      // Set the monthly waste data in state
      setMonthlyWaste(wasteByMonth)
    } catch (error) {
      console.log("Error fetching monthly waste:", error)
    }
  }

  // Chart options for customization
  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        grid: {
          color: "rgba(255,255,255, 0.2)",
          borderColor: "rgba(233, 91, 133, 1)",
          drawBorder: true,
          borderWidth: 1,
        },
        ticks: {
          color: "white",
        },
      },
      y: {
        grid: {
          color: "rgba(255,255,255, 0.2)",
          display: true,
        },
        ticks: {
          color: "rgba(233, 91, 133, 1)",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
  }

  // Chart data for the Bar chart
  const chartData = {
    labels: Object.keys(monthlyWaste).map(
      (month) => `${MONTHS[parseInt(month)]}`
    ),
    datasets: [
      {
        label: "Total Waste in g",
        data: Object.values(monthlyWaste),
        backgroundColor: "rgba(233, 91, 133, 1)",
      },
    ],
  }

  return (
    <div className="monthly-Waste-container" style={chartContainerStyle}>
      {loggedIn ? (
        <div>
          <div className="monthly-waste-heading">
            <h1>
              YOUR <span className="wasting">MONTHLY WASTE</span>
            </h1>
          </div>
          {Object.keys(monthlyWaste).length > 0 ? (
            <div className="monthly-wasting-chart">
              <Bar data={chartData} options={chartOptions} />
            </div>
          ) : (
            <Typography
              sx={{
                textAlign: "center",
                fontSize: "18px",
                fontWeight: "500",
                mt: "20px",
              }}
            >
              No data available for monthly waste.
            </Typography>
          )}
        </div>
      ) : (
        <Typography
          sx={{
            textAlign: "center",
            fontSize: "30px",
            fontWeight: "700",
            color: "darkSalmon",
            mt: "50px",
          }}
        >
          Please log in to view the monthly waste.
        </Typography>
      )}
    </div>
  )
}

export default MonthlyWaste
