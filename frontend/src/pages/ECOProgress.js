import React from "react"

import MonthlySpending from "../components/MonthlySpending"
import MonthlyQuantity from "../components/MonthlyQuantity"
import MonthlyDonation from "../components/MonthlyDonation"
import MonthlyWaste from "../components/MonthlyWaste"

// Component that represents the EcoProgress page, displaying various monthly statistics
const EcoProgress = () => {
  return (
    <div>
      {/* Display the MonthlySpending component for tracking monthly spending */}
      <MonthlySpending />

      {/* Display the MonthlyQuantity component for tracking monthly quantity */}
      <MonthlyQuantity />

      {/* Display the MonthlyDonation component for tracking monthly donations */}
      <MonthlyDonation />

      {/* Display the MonthlyWaste component for tracking monthly waste */}
      <MonthlyWaste />
    </div>
  )
}

export default EcoProgress
