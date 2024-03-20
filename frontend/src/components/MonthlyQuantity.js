// import React, { useContext, useEffect, useState } from "react"
// import axios from "axios"
// import { AuthContext } from "../AuthContext"
// import { Typography } from "@mui/material"
// import { Bar } from "react-chartjs-2"

// // Component to display monthly quantity purchased chart for logged-in users
// const MonthlyQuantity = () => {
//   // Access authentication state from AuthContext
//   const { loggedIn } = useContext(AuthContext)
//   // State to store monthly quantity purchased data
//   const [monthlyQuantity, setMonthlyQuantity] = useState([])
//   // Array representing month names
//   const MONTHS = [
//     "JANUARY",
//     "FEBRUAURY",
//     "MARCH",
//     "APRIL",
//     "MAY",
//     "JUNE",
//     "JULY",
//     "AUGUST",
//     "SEPTEMBER",
//     "OCTOBER",
//     "NOVEMBER",
//     "DECEMBER",
//   ]
//   // Style for chart container
//   const chartContainerStyle = {
//     margin: "40px",
//   }

//   // Fetch monthly quantity purchased data on component mount or when login status changes
//   useEffect(() => {
//     if (loggedIn) {
//       fetchMonthlyQuantity()
//     }
//   }, [loggedIn])

//   // Function to fetch monthly quantity purchased data from the server
//   const fetchMonthlyQuantity = async () => {
//     try {
//       // Get the authentication token from local storage
//       const token = localStorage.getItem("token")
//       if (!token) {
//         throw new Error("No token found")
//       }

//       // Make a GET request to the server to fetch monthly quantity purchased data
//       const response = await axios.get("http://localhost:5000/inventory", {
//         headers: {
//           Authorization: token,
//         },
//       })

//       // Extract data from the response
//       const data = response.data

//       // Calculate monthly quantity
//       const quantityByMonth = {}
//       data.forEach((item) => {
//         const month = new Date(item.itemPurchaseDate).getMonth()
//         const quantity = item.itemQuantity
//         if (quantityByMonth[month]) {
//           quantityByMonth[month] += quantity
//         } else {
//           quantityByMonth[month] = quantity
//         }
//       })

//       // Set the monthly quantity purchased data in state
//       setMonthlyQuantity(quantityByMonth)
//     } catch (error) {
//       console.log("Error fetching monthly quantity:", error)
//     }
//   }

//   // Chart options for customization
//   const chartOptions = {
//     responsive: true,
//     scales: {
//       x: {
//         grid: {
//           color: "rgba(255,255,255, 0.2)",
//           borderColor: "rgba(233, 91, 133, 1)",
//           drawBorder: true,
//           borderWidth: 1,
//         },
//         ticks: {
//           color: "white",
//         },
//       },
//       y: {
//         grid: {
//           color: "rgba(255,255,255, 0.2)",
//           display: true,
//         },
//         ticks: {
//           color: "rgba(233, 91, 133, 1)",
//         },
//       },
//     },
//     plugins: {
//       legend: {
//         labels: {
//           color: "white",
//         },
//       },
//     },
//   }

//   // Chart data for the Bar chart
//   const chartData = {
//     labels: Object.keys(monthlyQuantity).map(
//       (month) => `${MONTHS[parseInt(month)]}`
//     ),
//     datasets: [
//       {
//         label: "Total Quantity Purchased in g",
//         data: Object.values(monthlyQuantity),
//         backgroundColor: "rgba(233, 91, 133, 1)",
//       },
//     ],
//   }

//   return (
//     <div className="monthly-Quantity-container">
//       {loggedIn ? (
//         <div>
//           <div className="monthly-Quantity-heading">
//             <h1>
//               YOUR <span className="spending">MONTHLY QUANTITY PURCHASED</span>
//             </h1>
//           </div>
//           {Object.keys(monthlyQuantity).length > 0 ? (
//             <div className="monthly-quantity-chart" style={chartContainerStyle}>
//               <Bar data={chartData} options={chartOptions} />
//             </div>
//           ) : (
//             <Typography
//               sx={{
//                 textAlign: "center",
//                 fontSize: "18px",
//                 fontWeight: "500",
//                 mt: "20px",
//               }}
//             >
//               No data available for monthly quantity purchased.
//             </Typography>
//           )}
//         </div>
//       ) : (
//         <Typography
//           sx={{
//             textAlign: "center",
//             fontSize: "30px",
//             fontWeight: "700",
//             color: "darkSalmon",
//             mt: "50px",
//           }}
//         >
//           Please log in to view the monthly quantity purchased.
//         </Typography>
//       )}
//     </div>
//   )
// }

// export default MonthlyQuantity

import React, { useContext, useEffect, useState } from "react"
import axios from "axios"
import { AuthContext } from "../AuthContext"
import { Typography } from "@mui/material"
import { Bar } from "react-chartjs-2"
import * as tf from "@tensorflow/tfjs"

const MonthlyQuantity = () => {
  const { loggedIn } = useContext(AuthContext)
  const [monthlyQuantity, setMonthlyQuantity] = useState([])
  const [predictedQuantity, setPredictedQuantity] = useState([])
  const [predictedAverage, setPredictedAverage] = useState(null) // New state for predicted average
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
  const chartContainerStyle = {
    margin: "40px",
  }

  useEffect(() => {
    if (loggedIn) {
      fetchMonthlyQuantity()
    }
  }, [loggedIn])

  const fetchMonthlyQuantity = async () => {
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

      const quantityByMonth = {}
      data.forEach((item) => {
        const month = new Date(item.itemPurchaseDate).getMonth()
        const quantity = item.itemQuantity
        if (quantityByMonth[month]) {
          quantityByMonth[month].push(quantity)
        } else {
          quantityByMonth[month] = [quantity]
        }
      })

      setMonthlyQuantity(quantityByMonth)

      // Initiate prediction based on the actual data
      predictMonthlyQuantity(quantityByMonth)
    } catch (error) {
      console.log("Error fetching monthly quantity:", error)
    }
  }

  const predictMonthlyQuantity = async (quantityData) => {
    if (Object.keys(quantityData).length === 0) {
      return
    }

    const features = Object.values(quantityData).map(
      (values) => values.reduce((a, b) => a + b, 0) / values.length
    )
    const labels = Object.keys(quantityData).map((month) => parseInt(month))
    const labelsTensor = tf.tensor1d(labels)
    const featuresTensor = tf.tensor2d(features, [features.length, 1])

    const { mean, variance } = tf.moments(featuresTensor, 0)
    const std = tf.sqrt(variance)
    const featuresNormalized = tf.div(tf.sub(featuresTensor, mean), std)

    const model = tf.sequential()
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }))
    model.compile({ loss: "meanSquaredError", optimizer: tf.train.adam() })

    await model.fit(featuresNormalized, labelsTensor, { epochs: 100 })

    const predictionInput = featuresNormalized
    const predictions = model.predict(predictionInput).dataSync()

    // Predict average using the same model
    const averagePredictionInput = tf.tensor2d(
      [features.reduce((a, b) => a + b, 0) / features.length],
      [1, 1]
    )
    const averagePrediction = model
      .predict(averagePredictionInput)
      .dataSync()[0]
    setPredictedAverage(averagePrediction)

    setPredictedQuantity(predictions)

    model.dispose()
  }

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

  const chartData = {
    labels: Object.keys(monthlyQuantity).map(
      (month) => `${MONTHS[parseInt(month)]}`
    ),
    datasets: [
      {
        label: "Total Quantity Purchased in g",
        data: Object.values(monthlyQuantity).map((values) =>
          values.reduce((a, b) => a + b, 0)
        ),
        backgroundColor: "rgba(233, 91, 133, 1)",
      },
      {
        label: "Predicted Quantity Purchased in g",
        data: predictedQuantity,
        backgroundColor: "rgba(0, 123, 255, 1)",
      },
    ],
  }

  return (
    <div className="monthly-Quantity-container">
      {loggedIn ? (
        <div>
          <div className="monthly-Quantity-heading">
            <h1>
              YOUR <span className="spending">MONTHLY QUANTITY PURCHASED</span>
            </h1>
          </div>
          {Object.keys(monthlyQuantity).length > 0 ? (
            <div className="monthly-quantity-chart" style={chartContainerStyle}>
              <Bar data={chartData} options={chartOptions} />
              {predictedAverage !== null && (
                <Typography
                  sx={{
                    textAlign: "center",
                    fontSize: "18px",
                    fontWeight: "500",
                    mt: "20px",
                  }}
                >
                  Predicted Average Quantity: {predictedAverage.toFixed(2)} g
                </Typography>
              )}
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
              No data available for monthly quantity purchased.
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
          Please log in to view the monthly quantity purchased.
        </Typography>
      )}
    </div>
  )
}

export default MonthlyQuantity
