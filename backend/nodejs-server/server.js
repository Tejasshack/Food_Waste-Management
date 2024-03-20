// Import required modules and packages
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// Create an Express application
const app = express()

// Start the server
const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server running on port ${port}`))

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Enable CORS for all routes
app.use(cors())

// MongoDB configuration
const mongoURI =
  "mongodb+srv://tejaswi376:0VaLfFIOMb8F27DL@cluster0.qqymdoc.mongodb.net/?retryWrites=true&w=majority"
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Save Aahaar Account DB connected"))
  .catch((err) => {
    console.error("Save Aahaar DB connection error:", err)
    process.exit(1) // Terminate the server on connection error
  })

// Middleware function to verify the token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  jwt.verify(
    token,
    "78f15b5705f3cd8d8c39ec495b9ac2f6637bf215eaf3dbf02e9f7549320a483b",
    (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" })
      }

      req.userId = decodedToken.userId
      next()
    }
  )
}

// MongoDB schema and model for the user
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  userType: String, // "household" or "business"
})

const User = mongoose.model("User", userSchema)

// Route to handle form submissions for signup
app.post("/signup", (req, res) => {
  // Extract data from the request body
  const { name, email, password, phone, userType } = req.body

  // Validation for required fields
  if (!name || !email || !password || !phone || !userType) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  // Hash the password before saving it
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Failed to hash password:", err)
      return res.status(500).json({ error: "Failed to save user" })
    }

    // Create a new user instance
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      userType,
    })

    // Save the user to the database
    newUser
      .save()
      .then((user) => {
        res.json(user)
      })
      .catch((err) => {
        if (err.code === 11000) {
          // Duplicate key error (email already exists)
          res.status(400).json({ error: "Email already exists" })
        } else {
          console.log(err)
          res.status(500).json({ error: "Failed to save user" })
        }
      })
  })
})

// Route to handle form submissions for login
app.post("/login", (req, res) => {
  // Extract data from the request body
  const { email, password } = req.body

  // Validation for required fields
  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" })
  }

  // Find the user in the database based on the provided email
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" })
      }

      // Compare the provided password with the stored password
      bcrypt.compare(password, user.password).then((passwordMatch) => {
        if (!passwordMatch) {
          return res.status(401).json({ error: "Invalid email or password" })
        }

        // Create and sign a JWT token
        const token = jwt.sign(
          { userId: user._id, userType: user.userType },
          "78f15b5705f3cd8d8c39ec495b9ac2f6637bf215eaf3dbf02e9f7549320a483b"
        )
        console.log(token)
        res.cookie(token)

        // Return the token in the response
        res.json({ token, userType: user.userType })
      })
    })
    .catch((err) => {
      console.error(err)
      res.status(500).json({ error: err.message })
    })
})

// Donation Database Schema and Model
const donationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  email: String,
  amount: Number,
  donationDate: Date,
  location: String,
  city: String,
  selectedInventoryItem: String, // Add this field
})

const Donation = mongoose.model("Donation", donationSchema)

app.post("/donate", verifyToken, async (req, res) => {
  try {
    const {
      name,
      email,
      amount,
      donationDate,
      location,
      city,
      selectedInventoryItem,
    } = req.body
    const userId = req.userId

    // Validation for required fields
    if (!name || !email || !amount || !donationDate || !location || !city) {
      return res
        .status(400)
        .json({ error: "Missing required donation data fields" })
    }

    // Create a new donation instance
    const newDonation = new Donation({
      user: userId,
      name,
      email,
      amount,
      donationDate,
      location,
      city,
      selectedInventoryItem,
    })

    // Save the donation to the donation database
    await newDonation.save()

    // Find the associated food donation request and update it with the donation ID
    const donationRequest = await FoodDonationRequest.findOneAndUpdate(
      {
        /* your criteria to match the request, e.g., title or requestedBy */
      },
      { associatedDonation: newDonation._id, status: "fulfilled" },
      { new: true }
    )

    // Update the inventory based on the donated amount
    if (selectedInventoryItem) {
      const inventoryItem = await InventoryItem.findOne({
        itemName: selectedInventoryItem,
        user: userId,
      })

      if (inventoryItem) {
        // Update the quantity in the inventory based on the donated amount
        if (inventoryItem.itemQuantity >= amount) {
          inventoryItem.itemQuantity -= amount
        } else {
          return res
            .status(400)
            .json({ error: "Not enough quantity in the inventory" })
        }

        // Save the updated inventory item
        await inventoryItem.save()
      }
    }

    res.json({ message: "Donation Made Successfully" })
  } catch (error) {
    console.error("Error making donation:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

// // Route to handle form submissions for donation
// app.post("/donate", verifyToken, async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       amount,
//       donationDate,
//       location,
//       city,
//       selectedInventoryItem,
//     } = req.body
//     const userId = req.userId

//     // Validation for required fields
//     if (!name || !email || !amount || !donationDate || !location || !city) {
//       return res
//         .status(400)
//         .json({ error: "Missing required donation data fields" })
//     }

//     // Create a new donation instance
//     const newDonation = new Donation({
//       user: userId,
//       name,
//       email,
//       amount,
//       donationDate,
//       location,
//       city,
//       selectedInventoryItem,
//     })
//     // Find the associated food donation request and update it with the donation ID
//     const donationRequest = await FoodDonationRequest.findOneAndUpdate(
//       {
//         /* your criteria to match the request, e.g., title or requestedBy */
//       },
//       { associatedDonation: newDonation._id, status: "fulfilled" },
//       { new: true }
//     )

//     // Save the donation to the donation database
//     await newDonation.save()

//     // Update the inventory based on the donated amount
//     if (selectedInventoryItem) {
//       const inventoryItem = await InventoryItem.findOne({
//         itemName: selectedInventoryItem,
//         user: userId,
//       })

//       if (inventoryItem) {
//         // Update the quantity in the inventory based on the donated amount
//         if (inventoryItem.itemQuantity >= amount) {
//           inventoryItem.itemQuantity -= amount
//         } else {
//           return res
//             .status(400)
//             .json({ error: "Not enough quantity in the inventory" })
//         }

//         // Save the updated inventory item
//         await inventoryItem.save()
//       }
//     }

//     res.json({ message: "Donation Made Successfully" })
//   } catch (error) {
//     console.error("Error making donation:", error)
//     res.status(500).json({ error: "Internal Server Error" })
//   }
// })

// app.post("/donate", verifyToken, async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       amount,
//       donationDate,
//       location,
//       city,
//       selectedInventoryItem,
//       title,
//       description,
//       requestedBy,
//     } = req.body

//     const userId = req.userId

//     // Validation for required fields
//     if (
//       !name ||
//       !email ||
//       !amount ||
//       !donationDate ||
//       !location ||
//       !city ||
//       !title ||
//       !description ||
//       !requestedBy
//     ) {
//       return res.status(400).json({ error: "Missing required fields" })
//     }

//     // Create a new donation instance
//     const newDonation = new Donation({
//       user: userId,
//       name,
//       email,
//       amount,
//       donationDate,
//       location,
//       city,
//       selectedInventoryItem,
//     })

//     // Save the donation to the donation database
//     await newDonation.save()

//     // Create a new donation request instance
//     const newDonationRequest = new FoodDonationRequest({
//       title,
//       description,
//       requestedBy,
//       associatedDonation: newDonation._id,
//       status: "fulfilled",
//     })

//     // Save the donation request to the database
//     await newDonationRequest.save()

//     // Update the inventory based on the donated amount
//     if (selectedInventoryItem) {
//       const inventoryItem = await InventoryItem.findOne({
//         itemName: selectedInventoryItem,
//         user: userId,
//       })

//       if (inventoryItem) {
//         // Update the quantity in the inventory based on the donated amount
//         if (inventoryItem.itemQuantity >= amount) {
//           inventoryItem.itemQuantity -= amount
//         } else {
//           return res
//             .status(400)
//             .json({ error: "Not enough quantity in the inventory" })
//         }

//         // Save the updated inventory item
//         await inventoryItem.save()
//       }
//     }

//     res.json({ message: "Donation Made Successfully" })
//   } catch (error) {
//     console.error("Error making donation:", error)
//     res.status(500).json({ error: "Internal Server Error" })
//   }
// })

// Food Donation Request Database Schema and Model
// MongoDB schema and model for the food donation request
const foodDonationRequestSchema = new mongoose.Schema({
  title: String,
  description: String,
  requestedBy: String,
  status: {
    type: String,
    enum: ["pending", "fulfilled", "expired"],
    default: "pending",
  },
  associatedDonation: { type: mongoose.Schema.Types.ObjectId, ref: "Donation" },
})

const FoodDonationRequest = mongoose.model(
  "FoodDonationRequest",
  foodDonationRequestSchema
)

app.get("/food-donation-requests", async (req, res) => {
  try {
    const donationRequests = await FoodDonationRequest.find()
    console.log("Donation Requests:", donationRequests)
    res.json(donationRequests)
  } catch (error) {
    console.error("Error fetching donation requests:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

// Route to handle creating donation requests
app.post("/create-donation-request", async (req, res) => {
  try {
    const { title, description, requestedBy } = req.body

    // Validate required fields
    if (!title || !description || !requestedBy) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Create a new donation request instance
    const newDonationRequest = new FoodDonationRequest({
      title,
      description,
      requestedBy,
    })

    // Save the donation request to the database
    await newDonationRequest.save()

    res.status(201).json(newDonationRequest)
  } catch (error) {
    console.error("Error creating donation request:", error)
    res.status(500).json({ error: error.message || "Internal Server Error" })
  }
})

// Route to handle deleting a donation request
app.delete("/delete-donation-request/:id", async (req, res) => {
  const requestId = req.params.id
  console.log(req)

  try {
    await FoodDonationRequest.findByIdAndDelete(requestId)
    res.json({ message: "Donation request deleted successfully" })
  } catch (error) {
    console.error("Error deleting donation request:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

// Route to handle marking a donation request as fulfilled

// Route to handle marking a donation request as fulfilled
app.put("/fulfill-donation-request/:id", async (req, res) => {
  const requestId = req.params.id
  // console.log(req)

  try {
    await FoodDonationRequest.findByIdAndUpdate(requestId, {
      status: "fulfilled",
    })
    res.json({ message: "Donation request marked as fulfilled" })
  } catch (error) {
    console.error("Error fulfilling donation request:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

// Add this route to handle donation acceptance check
app.get("/check-donation-acceptance/:id", async (req, res) => {
  const requestId = req.params.id

  try {
    // Assume you have a model for FoodDonationRequest
    const request = await FoodDonationRequest.findById(requestId)

    if (!request) {
      return res.status(404).json({ error: "Request not found" })
    }

    // You can implement your logic here to check whether donations are accepted for the request
    const acceptDonation = /* Your logic here */ true

    res.json({ acceptDonation, status: request.status })
  } catch (error) {
    console.error("Error checking donation acceptance:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

// Route to fetch donation data for a specific user
app.get("/donation", verifyToken, (req, res) => {
  const userId = req.userId

  Donation.find({ user: userId })
    .then((items) => {
      res.json(items)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ error: "Failed to fetch donation datas" })
    })
})

// Inventory Database Schema and Model
const inventorySchema = new mongoose.Schema({
  itemName: String,
  itemQuantity: Number,
  itemCost: Number,
  itemPurchaseDate: Date,
  itemExpiryDate: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  consumed: { type: Boolean, default: false },
})

const InventoryItem = mongoose.model("InventoryItem", inventorySchema)

// Route to handle form submissions for adding an item to the inventory
app.post("/inventory", verifyToken, (req, res) => {
  // Extract data from the request body
  const { itemName, itemQuantity, itemCost, itemPurchaseDate, itemExpiryDate } =
    req.body
  const userId = req.userId

  // Validation for required fields
  if (
    !itemName ||
    !itemQuantity ||
    !itemCost ||
    !itemPurchaseDate ||
    !itemExpiryDate
  ) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  // Create a new inventory item instance
  const newInventoryItem = new InventoryItem({
    itemName,
    itemQuantity,
    itemCost,
    itemPurchaseDate,
    itemExpiryDate,
    user: userId,
  })

  // Save the item to the inventory
  newInventoryItem
    .save()
    .then((item) => {
      res.json(item)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ error: "Failed to add item to inventory" })
    })
})

// Route to delete an inventory item
app.delete("/inventory/:id", verifyToken, (req, res) => {
  const itemId = req.params.id
  const userId = req.userId

  // Find and delete the item based on ID and user
  InventoryItem.findOneAndDelete({ _id: itemId, user: userId })
    .then((item) => {
      if (!item) {
        return res.status(404).json({ error: "Inventory item not found" })
      }

      res.json({ message: "Inventory item deleted successfully" })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ error: "Failed to delete inventory item" })
    })
})

// Route to fetch inventory items for a specific user
app.get("/inventory", verifyToken, (req, res) => {
  const userId = req.userId

  // Find inventory items based on user ID
  InventoryItem.find({ user: userId })
    .then((items) => {
      res.json(items)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ error: "Failed to fetch inventory items" })
    })
})

// Route to toggle the consumed status of an inventory item
app.put("/inventory/:id", verifyToken, (req, res) => {
  const itemId = req.params.id
  const userId = req.userId

  // Find the inventory item based on ID and user
  InventoryItem.findOne({ _id: itemId, user: userId })
    .then((item) => {
      if (!item) {
        return res.status(404).json({ error: "Inventory item not found" })
      }

      // Toggle the consumed status
      item.consumed = !item.consumed

      // Save the updated item
      item
        .save()
        .then((updatedItem) => {
          res.json(updatedItem)
        })
        .catch((err) => {
          console.log(err)
          res.status(500).json({ error: "Failed to update inventory item" })
        })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ error: "Failed to find inventory item" })
    })
})

// Food Waste Data Database Schema and Model
// Food Waste Data Database Schema and Model
const wasteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  foodItem: String,
  foodQuantity: Number,
  foodReason: String,
  foodWasteDate: Date,
  foodAddTxt: String,
})

const WasteData = mongoose.model("WasteData", wasteSchema)

// Route to handle form submissions for food waste data
app.post("/waste", verifyToken, (req, res) => {
  // Extract data from the request body
  const { foodItem, foodQuantity, foodReason, foodWasteDate, foodAddTxt } =
    req.body
  const userId = req.userId

  // Validation for required fields
  if (
    !foodItem ||
    !foodQuantity ||
    !foodReason ||
    !foodWasteDate ||
    !foodAddTxt
  ) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  // Create a new waste data instance
  const newWasteData = new WasteData({
    user: userId,
    foodItem,
    foodQuantity,
    foodReason,
    foodWasteDate,
    foodAddTxt,
  })

  // Save the waste data
  newWasteData
    .save()
    .then((waste) => {
      res.json(waste)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ error: "Failed to Save Waste Data" })
    })
})

// Route to fetch waste quantity for a specific user
app.get("/waste", verifyToken, (req, res) => {
  const userId = req.userId

  // Find waste data based on user ID
  WasteData.find({ user: userId })
    .then((items) => {
      res.json(items)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ error: "Failed to fetch waste data" })
    })
})
