import React, { useEffect, useState } from "react"
import axios from "axios"

import {
  Card,
  CardContent,
  Typography,
  Button,
  Modal,
  Box,
  Paper,
  TextField,
} from "@mui/material"
import Donation from "../pages/Donation" // Import the Donation component
import "./Dashboard.css" // Import your CSS file
import { useNavigate } from "react-router-dom"

const Dashboard = () => {
  const [foodDonationRequests, setFoodDonationRequests] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState(null)
  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
    requestedBy: "",
  })
  const navigate = useNavigate()

  const fetchFoodDonationRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/food-donation-requests"
      )
      setFoodDonationRequests(response.data)
    } catch (error) {
      console.log("Error fetching food donation requests:", error)
    }
  }

  useEffect(() => {
    fetchFoodDonationRequests()
  }, [])

  // const handleDonate = async (requestId, requestDetails) => {
  //   try {
  //     // You might need to update the API endpoint based on your backend
  //     const response = await axios.get(
  //       `http://localhost:5000/check-donation-acceptance/${requestId}`
  //     )

  //     if (
  //       response.data.acceptDonation ||
  //       requestDetails.status === "fulfilled"
  //     ) {
  //       setSelectedRequestId(requestId)
  //       navigate("/donation", { state: { requestDetails } })
  //     } else {
  //       alert("Donations are not accepted for this request.")
  //     }
  //   } catch (error) {
  //     console.log("Error checking donation acceptance:", error)
  //   }
  // }

  const handleCreateRequestInsideModal = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/create-donation-request",
        {
          ...newRequest,
          status: "pending",
        }
      )
      fetchFoodDonationRequests()
      setNewRequest({
        title: "",
        description: "",
        requestedBy: "",
      })
      // Close the modal after creating the request
      setIsModalOpen(false)
    } catch (error) {
      console.log("Error creating donation request:", error)
    }
  }
  const handleDonate = async (requestId, requestDetails) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/check-donation-acceptance/${requestId}`
      )

      if (
        response.data.acceptDonation ||
        requestDetails.status === "fulfilled"
      ) {
        setSelectedRequestId(requestId)
        // Pass requestDetails as state to Donation component
        navigate("/donation", { state: { requestDetails } })
      } else {
        alert("Donations are not accepted for this request.")
      }
    } catch (error) {
      console.log("Error checking donation acceptance:", error)
    }
  }

  const handleDeleteRequest = async (requestId) => {
    // console.log(requestId)
    try {
      if (window.confirm("Do you want to delete this request?")) {
        await axios.delete(
          `http://localhost:5000/delete-donation-request/${requestId}`
        )
        fetchFoodDonationRequests()
      }
    } catch (error) {
      console.log("Error deleting request:", error)
    }
  }

  const handleFulfillRequest = async (requestId) => {
    try {
      if (window.confirm("Mark this request as fulfilled?")) {
        // Make API request to update request status to "fulfilled"
        await axios.put(
          `http://localhost:5000/fulfill-donation-request/${requestId}`
        )
        fetchFoodDonationRequests()
      }
    } catch (error) {
      console.log("Error fulfilling request:", error)
    }
  }

  return (
    <div className="dashboard-container">
      <div className="button-container">
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="contained"
          color="primary"
          style={{ marginTop: "20px", fontFamily: "Arial, sans-serif" }}
        >
          Create Request
        </Button>
      </div>

      <div className="card-container">
        {foodDonationRequests.map((request) => (
          <Card key={request._id} className="request-card">
            <CardContent>
              <Typography variant="h5" component="div">
                {request.title}
              </Typography>
              <Typography>{request.description}</Typography>
              <Typography>{`Requested by: ${request.requestedBy}`}</Typography>
              <Typography>{`Status: ${request.status}`}</Typography>
              <div style={{ marginTop: "12px", display: "flex" }}>
                <Button
                  onClick={() => handleDonate(request._id, request)}
                  variant="contained"
                  color="secondary"
                  style={{ marginRight: "10px" }}
                  disabled={request.status === "fulfilled"}
                >
                  Donate
                </Button>
                <Button
                  onClick={() => handleDeleteRequest(request._id)}
                  variant="contained"
                  color="error"
                  style={{ marginRight: "10px" }}
                >
                  Delete
                </Button>
                {request.status === "pending" && (
                  <Button
                    onClick={() => {
                      handleFulfillRequest(request._id)
                    }}
                    variant="contained"
                    style={{
                      backgroundColor: "#4caf50",
                      color: "white",
                    }}
                  >
                    Fulfill
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          sx={{
            top: `50%`,
            left: `50%`,
            transform: `translate(-50%, -50%)`,
            position: "absolute",
            width: 400,
            bgcolor: "white",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: "20px",
              borderRadius: "12px",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Create a New Request
            </Typography>
            <TextField
              label="Title"
              value={newRequest.title}
              onChange={(e) =>
                setNewRequest({ ...newRequest, title: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              value={newRequest.description}
              onChange={(e) =>
                setNewRequest({ ...newRequest, description: e.target.value })
              }
              multiline
              rows={4}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Requested By"
              value={newRequest.requestedBy}
              onChange={(e) =>
                setNewRequest({ ...newRequest, requestedBy: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <Button
              onClick={handleCreateRequestInsideModal}
              variant="contained"
              color="primary"
              style={{ marginTop: "15px" }}
            >
              Create Request
            </Button>
          </Paper>
        </Box>
      </Modal>

      {/* Use Donation component inside the modal */}
      <Modal
        open={!!selectedRequestId}
        onClose={() => setSelectedRequestId(null)}
      >
        <Box
          sx={{
            top: `50%`,
            left: `50%`,
            transform: `translate(-50%, -50%)`,
            position: "absolute",
            width: "80%",
            bgcolor: "white",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Donation
            requestId={selectedRequestId}
            onClose={() => setSelectedRequestId(null)}
          />
        </Box>
      </Modal>
    </div>
  )
}

export default Dashboard
