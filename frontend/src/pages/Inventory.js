import React, { useContext, useEffect, useState } from "react"
import axios from "axios"
import { AuthContext } from "../AuthContext"
import { Typography } from "@mui/material"

const Inventory = () => {
  // Access the authentication context
  const { loggedIn } = useContext(AuthContext)

  // State variables for form input and inventory data
  const [itemName, setItemName] = useState("")
  const [itemQuantity, setItemQuantity] = useState("")
  const [itemCost, setItemCost] = useState("")
  const [itemPurchaseDate, setItemPurchaseDate] = useState("")
  const [itemExpiryDate, setItemExpiryDate] = useState("")
  const [inventoryData, setInventoryData] = useState([])

  // Fetch inventory data on component mount and whenever the user logs in
  useEffect(() => {
    if (loggedIn) {
      fetchInventoryData()
    }
  }, [loggedIn])

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
      console.log("Error fetching inventory data:", error)
    }
  }

  // Calculate the number of days until the item expires
  const calculateExpiryDays = (expiryDate) => {
    const currentDate = new Date()
    const diffTime = expiryDate - currentDate
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Determine the CSS class for the row based on expiry days
  const getRowClassName = (expiryDays) => {
    if (expiryDays <= 0) {
      return "expiry-red"
    } else if (expiryDays <= 14) {
      return "expiry-yellow"
    } else {
      return "expiry-green"
    }
  }

  // Handle form submission to add a new item to the inventory
  const handleSubmit = async (e) => {
    e.preventDefault()
    const newItem = {
      itemName,
      itemQuantity,
      itemCost,
      itemPurchaseDate,
      itemExpiryDate,
      consumed: false, // Set initial consumed status to false
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No token found")
      }

      await axios.post("http://localhost:5000/inventory", newItem, {
        headers: {
          Authorization: token,
        },
      })

      console.log("Item added successfully:")
      setItemName("")
      setItemQuantity("")
      setItemCost("")
      setItemPurchaseDate("")
      setItemExpiryDate("")
      fetchInventoryData()
    } catch (error) {
      console.error("Error adding item:", error)
    }
  }

  // Handle toggling the consumed status of an item
  const handleConsumedToggle = async (itemId, consumed) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No token found")
      }

      await axios.put(
        `http://localhost:5000/inventory/${itemId}`,
        { consumed },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      fetchInventoryData()
      console.log("Consumed status updated successfully:")
    } catch (error) {
      console.error("Error updating consumed status:", error)
    }
  }

  // Handle deleting an item from the inventory
  const handleDeleteItem = async (itemId) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No token found")
      }

      await axios.delete(`http://localhost:5000/inventory/${itemId}`, {
        headers: {
          Authorization: token,
        },
      })

      console.log("Item deleted successfully:")
      fetchInventoryData()
    } catch (error) {
      console.error("Error deleting item:", error)
    }
  }

  return (
    <div className="grocery-form-body">
      {loggedIn ? (
        <div>
          <div className="inventory-heading">
            <h1>
              YOUR <span className="inventory">INVENTORY</span>
            </h1>
          </div>
          <div className="grocery-form-container">
            <form onSubmit={handleSubmit}>
              {/* Form input fields */}
              <input
                type="text"
                value={itemName}
                placeholder="Item Name"
                onChange={(e) => setItemName(e.target.value)}
              />
              <input
                type="number"
                value={itemQuantity}
                placeholder="Item Quantity (in g)"
                onChange={(e) => setItemQuantity(e.target.value)}
              />
              <input
                type="number"
                value={itemCost}
                placeholder="Item Cost"
                onChange={(e) => setItemCost(e.target.value)}
              />
              <label>
                Item Purchase Date:
                <input
                  type="date"
                  value={itemPurchaseDate}
                  onChange={(e) => setItemPurchaseDate(e.target.value)}
                />
              </label>
              <label>
                Item Expiry Date:
                <input
                  type="date"
                  value={itemExpiryDate}
                  onChange={(e) => setItemExpiryDate(e.target.value)}
                />
              </label>
              <br />
              {/* Add Item button */}
              <button type="submit">Add Item</button>
            </form>

            {/* Inventory table */}
            <table>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Item Quantity</th>
                  <th>Item Cost</th>
                  <th>Item Purchase Date</th>
                  <th>Item Expiry Date</th>
                  <th>Consumed</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Map through inventory data and render rows */}
                {inventoryData.map((item) => {
                  const expiryDate = new Date(item.itemExpiryDate)
                  const expiryDays = calculateExpiryDays(expiryDate)
                  const rowClassName = getRowClassName(expiryDays)

                  return (
                    <tr key={item._id} className={rowClassName}>
                      <td>{item.itemName}</td>
                      <td>{item.itemQuantity}</td>
                      <td>{item.itemCost}</td>
                      <td>
                        {new Date(item.itemPurchaseDate).toLocaleDateString()}
                      </td>
                      <td>
                        {new Date(item.itemExpiryDate).toLocaleDateString()}
                      </td>
                      {/* Checkbox to toggle consumed status */}
                      <td>
                        <input
                          type="checkbox"
                          checked={item.consumed}
                          onChange={() =>
                            handleConsumedToggle(item._id, !item.consumed)
                          }
                        />
                      </td>
                      {/* Button to delete item */}
                      <td>
                        <button onClick={() => handleDeleteItem(item._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Display a message if the user is not logged in
        <Typography
          sx={{
            textAlign: "center",
            fontSize: "30px",
            fontWeight: "700",
            color: "darkSalmon",
            mt: "50px",
          }}
        >
          Please log in to view the inventory.
        </Typography>
      )}
    </div>
  )
}

export default Inventory
