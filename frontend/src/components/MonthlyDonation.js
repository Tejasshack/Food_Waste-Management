// import React, { useContext, useEffect, useState } from "react"
// import axios from "axios"
// import { AuthContext } from "../AuthContext"
// import { Typography } from "@mui/material"
// import { Doughnut } from "react-chartjs-2"
// import * as tf from "@tensorflow/tfjs"

// // Component to display monthly donations made chart with prediction for logged-in users
// const MonthlyDonation = () => {
//   // Access authentication state from AuthContext
//   const { loggedIn } = useContext(AuthContext)
//   // State to store actual monthly donation data
//   const [monthlyDonation, setMonthlyDonation] = useState([])
//   // State to store predicted monthly donation data
//   const [predictedDonation, setPredictedDonation] = useState([])
//   // Style for chart container
//   const chartContainerStyle = {
//     height: "500px",
//     width: "500px",
//     margin: "auto",
//   }
//   // Array representing month names
//   const MONTHS = [
//     "JANUARY",
//     "FEBRUARY",
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

//   // Fetch actual and predicted monthly donation data on component mount or when login status changes
//   useEffect(() => {
//     if (loggedIn) {
//       fetchMonthlyDonation()
//     }
//   }, [loggedIn])

//   // Function to fetch monthly donation data from the server and initiate prediction
//   const fetchMonthlyDonation = async () => {
//     try {
//       // Get the authentication token from local storage
//       const token = localStorage.getItem("token")
//       if (!token) {
//         throw new Error("No token found")
//       }

//       // Make a GET request to the server to fetch monthly donation data
//       const response = await axios.get("http://localhost:5000/donation", {
//         headers: {
//           Authorization: token,
//         },
//       })

//       // Extract data from the response
//       const data = response.data

//       // Calculate actual monthly donation
//       const donationByMonth = {}
//       data.forEach((item) => {
//         const month = new Date(item.donationDate).getMonth()
//         const quantity = item.amount
//         if (donationByMonth[month]) {
//           donationByMonth[month] += quantity
//         } else {
//           donationByMonth[month] = quantity
//         }
//       })

//       // Set the actual monthly donation data in state
//       setMonthlyDonation(donationByMonth)

//       // Initiate prediction based on the actual data
//       predictMonthlyDonation(donationByMonth)
//     } catch (error) {
//       console.log("Error fetching monthly donation data:", error)
//     }
//   }

//   const predictMonthlyDonation = async (donationByMonth) => {
//     if (Object.keys(donationByMonth).length === 0) {
//       // Handle the case when there is no data for prediction
//       return
//     }

//     // Convert donationData to an array of arrays
//     const features = Object.values(donationByMonth).map((value) => [value])

//     // Assuming labels are the keys of the original object
//     const labels = Object.keys(donationByMonth).map((month) => parseInt(month))

//     // Convert labels to a tensor
//     const labelsTensor = tf.tensor1d(labels)

//     // Convert features to a tensor
//     const featuresTensor = tf.tensor2d(features)

//     // Normalize features (optional)
//     const { mean, variance } = tf.moments(featuresTensor, 0)
//     const std = tf.sqrt(variance)
//     const featuresNormalized = tf.div(tf.sub(featuresTensor, mean), std)

//     // Create a simple linear regression model using TensorFlow.js
//     const model = tf.sequential()
//     model.add(tf.layers.dense({ units: 1, inputShape: [1] }))
//     model.compile({ loss: "meanSquaredError", optimizer: tf.train.adam() })

//     // Train the model
//     await model.fit(featuresNormalized, labelsTensor, { epochs: 100 })

//     // Make predictions using the trained model
//     const predictionInput = featuresNormalized
//     const predictions = model.predict(predictionInput).dataSync()

//     // Update state with predicted values
//     setPredictedDonation(predictions)

//     // Dispose of the model when it's no longer needed
//     model.dispose()
//   }

//   // Chart options for customization
//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         labels: {
//           color: "white",
//         },
//       },
//     },
//   }

//   // Chart data for the Doughnut chart
//   const chartData = {
//     labels: Object.keys(monthlyDonation).map(
//       (month) => `${MONTHS[parseInt(month)]} `
//     ),
//     datasets: [
//       {
//         label: "Actual Donation Made in g",
//         data: Object.values(monthlyDonation),
//         backgroundColor: "rgba(233, 91, 133, 1)",
//       },
//       {
//         label: "Predicted Donation Made in g",
//         data: predictedDonation,
//         backgroundColor: "rgba(0, 123, 255, 1)",
//       },
//     ],
//   }

//   return (
//     <div className="monthly-Donation-container">
//       {loggedIn ? (
//         <div>
//           <div className="monthly-Donation-heading">
//             <h1>
//               YOUR <span className="spending">MONTHLY DONATIONS MADE</span>
//             </h1>
//           </div>
//           {Object.keys(monthlyDonation).length > 0 ? (
//             <div className="monthly-donation-chart" style={chartContainerStyle}>
//               <Doughnut data={chartData} options={chartOptions} />
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
//               You have not made any donations yet.
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
//           Please log in to view the monthly donation.
//         </Typography>
//       )}
//     </div>
//   )
// }

// export default MonthlyDonation
import React, { useContext, useEffect, useState } from "react"
import axios from "axios"
import { AuthContext } from "../AuthContext"
import { Typography } from "@mui/material"
import { Doughnut } from "react-chartjs-2"
import * as tf from "@tensorflow/tfjs"

const MonthlyDonation = () => {
  const { loggedIn } = useContext(AuthContext)
  const [monthlyDonation, setMonthlyDonation] = useState([])
  const [predictedDonation, setPredictedDonation] = useState([])
  const [predictedAverage, setPredictedAverage] = useState(null) // New state for predicted average
  const chartContainerStyle = {
    height: "500px",
    width: "500px",
    margin: "auto",
  }
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

  useEffect(() => {
    if (loggedIn) {
      fetchMonthlyDonation()
    }
  }, [loggedIn])

  const fetchMonthlyDonation = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No token found")
      }

      const response = await axios.get("http://localhost:5000/donation", {
        headers: {
          Authorization: token,
        },
      })

      const data = response.data

      const donationByMonth = {}
      data.forEach((item) => {
        const month = new Date(item.donationDate).getMonth()
        const quantity = item.amount
        if (donationByMonth[month]) {
          donationByMonth[month].push(quantity)
        } else {
          donationByMonth[month] = [quantity]
        }
      })

      setMonthlyDonation(donationByMonth)

      // Initiate prediction based on the actual data
      predictMonthlyDonation(donationByMonth)
    } catch (error) {
      console.log("Error fetching monthly donation data:", error)
    }
  }

  const predictMonthlyDonation = async (donationData) => {
    if (Object.keys(donationData).length === 0) {
      // Handle the case when there is no data for prediction
      return
    }

    // Convert donationData to an array of arrays
    const features = Object.values(donationData).map(
      (values) => values.reduce((a, b) => a + b, 0) / values.length
    )

    // Assuming labels are the keys of the original object
    const labels = Object.keys(donationData).map((month) => parseInt(month))

    // Convert labels to a tensor
    const labelsTensor = tf.tensor1d(labels)

    // Convert features to a tensor
    const featuresTensor = tf.tensor2d(features, [features.length, 1])

    // Normalize features (optional)
    const { mean, variance } = tf.moments(featuresTensor, 0)
    const std = tf.sqrt(variance)
    const featuresNormalized = tf.div(tf.sub(featuresTensor, mean), std)

    // Create a simple linear regression model using TensorFlow.js
    const model = tf.sequential()
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }))
    model.compile({ loss: "meanSquaredError", optimizer: tf.train.adam() })

    // Train the model
    await model.fit(featuresNormalized, labelsTensor, { epochs: 100 })

    // Make predictions using the trained model
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

    // Update state with predicted values
    setPredictedDonation(predictions)

    // Dispose of the model when it's no longer needed
    model.dispose()
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
  }

  const chartData = {
    labels: Object.keys(monthlyDonation).map(
      (month) => `${MONTHS[parseInt(month)]} `
    ),
    datasets: [
      {
        label: "Actual Donation Made in g",
        data: Object.values(monthlyDonation).map((values) =>
          values.reduce((a, b) => a + b, 0)
        ),
        backgroundColor: "rgba(233, 91, 133, 1)",
      },
      {
        label: "Predicted Donation Made in g",
        data: predictedDonation,
        backgroundColor: "rgba(0, 123, 255, 1)",
      },
    ],
  }

  return (
    <div className="monthly-Donation-container">
      {loggedIn ? (
        <div>
          <div className="monthly-Donation-heading">
            <h1>
              YOUR <span className="spending">MONTHLY DONATIONS MADE</span>
            </h1>
          </div>
          {Object.keys(monthlyDonation).length > 0 ? (
            <div className="monthly-donation-chart" style={chartContainerStyle}>
              <Doughnut data={chartData} options={chartOptions} />
              {predictedAverage !== null && (
                <Typography
                  sx={{
                    textAlign: "center",
                    fontSize: "18px",
                    fontWeight: "500",
                    mt: "20px",
                  }}
                >
                  Predicted Average Donation: {predictedAverage.toFixed(2)} g
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
              You have not made any donations yet.
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
          Please log in to view the monthly donation.
        </Typography>
      )}
    </div>
  )
}

export default MonthlyDonation
