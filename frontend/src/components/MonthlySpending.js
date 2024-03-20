import React, { useContext, useEffect, useState } from "react"
import axios from "axios"
import { AuthContext } from "../AuthContext"
import { Typography } from "@mui/material"
import { Line } from "react-chartjs-2"

const dummyMonthlySpending = {
  0: 1500, // January
  1: 2000, // February
  2: 1200, // March
  3: 1800, // April
  4: 1000, // May
  5: 2500, // June
  6: 1700, // July
  7: 3000, // August
  8: 2200, // September
  9: 1400, // October
  10: 1800, // November
  11: 2100, // December
}

// You can use this data in your state or wherever you are using the MonthlySpending component.
// For example:
// setMonthlySpending(dummyMonthlySpending);

// Component to display monthly spending chart for logged-in users
const MonthlySpending = () => {
  // Access authentication state from AuthContext
  const { loggedIn } = useContext(AuthContext)
  // State to store monthly spending data
  const [monthlySpending, setMonthlySpending] = useState([])
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
    margin: "40px",
  }

  // Fetch monthly spending data on component mount or when login status changes
  useEffect(() => {
    if (loggedIn) {
      fetchMonthlySpending()
    }
  }, [loggedIn])

  // Function to fetch monthly spending data from the server
  const fetchMonthlySpending = async () => {
    try {
      // Get the authentication token from local storage
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No token found")
      }

      // Make a GET request to the server to fetch monthly spending data
      const response = await axios.get("http://localhost:5000/inventory", {
        headers: {
          Authorization: token,
        },
      })

      // Extract data from the response
      const data = response.data

      // Calculate monthly spending
      const spendingByMonth = {}
      data.forEach((item) => {
        const month = new Date(item.itemPurchaseDate).getMonth()
        const cost = item.itemCost
        if (spendingByMonth[month]) {
          spendingByMonth[month] += cost
        } else {
          spendingByMonth[month] = cost
        }
      })

      // Set the monthly spending data in state
      setMonthlySpending(spendingByMonth)
    } catch (error) {
      console.log("Error fetching monthly spending:", error)
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

  // Chart data for the Line chart
  const chartData = {
    labels: Object.keys(monthlySpending).map(
      (month) => `${MONTHS[parseInt(month)]}`
    ),
    datasets: [
      {
        label: "Total Spendings in ₹",
        data: Object.values(monthlySpending),
        backgroundColor: "rgba(233, 91, 133, 1)",
        borderColor: "rgba(233, 91, 133, 0.8)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(233, 91, 133, 0.8)",
      },
    ],
    labelsStyle: {
      color: "rgba(233, 91, 133, 1)",
    },
  }

  return (
    <div className="monthly-spending-container">
      {loggedIn ? (
        <div>
          <div className="monthly-spending-heading">
            <h1>
              YOUR <span className="spending">MONTHLY SPENDINGS</span>
            </h1>
          </div>
          {Object.keys(monthlySpending).length > 0 ? (
            <div className="monthly-spending-chart" style={chartContainerStyle}>
              <Line data={chartData} options={chartOptions} />
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
              No data available for monthly spending.
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
          Please log in to view the monthly spending.
        </Typography>
      )}
    </div>
  )
}

export default MonthlySpending
