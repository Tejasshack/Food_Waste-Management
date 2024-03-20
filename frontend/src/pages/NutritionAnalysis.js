import React, { useState } from "react"

const NutritionAnalysis = () => {
  // State variables
  const [ingredients, setIngredients] = useState("")
  const [resultHtml, setResultHtml] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // Function to analyze nutrition based on entered ingredients
  const analyzeNutrition = () => {
    // Check if ingredients are provided
    if (!ingredients) {
      setErrorMessage("Please enter ingredients.")
      return
    }

    // Fetch nutrition data from the Edamam API
    fetch(
      `https://api.edamam.com/api/nutrition-data?app_id=100fcc68&app_key=c9f82907b76776cdab2cb96c7a8fa2b6&ingr=${ingredients}`
    )
      .then((response) => response.json())
      .then((data) => {
        // Check if the response contains total nutrients
        if (data.totalNutrients) {
          // Extract and format nutrient information
          const nutrients = data.totalNutrients
          let resultHtml = "<h2>Nutrition Facts</h2>"
          resultHtml += "<table>"
          resultHtml += "<tr><th>Amount Per Serving</th></tr>"
          resultHtml += `<tr><td>Calories</td><td>${nutrients.ENERC_KCAL.quantity.toFixed(
            2
          )} ${nutrients.ENERC_KCAL.unit}</td></tr>`
          // Add more rows for different nutrients
          // ...

          resultHtml += "</table>"

          // Set the result HTML and clear error message
          setResultHtml(resultHtml)
          setErrorMessage("")
        } else {
          // If no total nutrients, display an error message
          setResultHtml("")
          setErrorMessage("Unable to retrieve nutrition information.")
        }
      })
      .catch(() => {
        // Handle errors during the API request
        setResultHtml("")
        setErrorMessage("Error occurred during API request.")
      })
  }

  return (
    <div className="nutritionAnalysis-body">
      <div className="nutrition-content">
        <h2>Nutrition Analysis</h2>
        {/* Input area for entering ingredients */}
        <div className="input-container">
          <label htmlFor="ingredients">Enter Ingredients:</label>
          <textarea
            id="ingredients"
            rows="5"
            cols="80"
            placeholder="Enter ingredients with quantities (e.g., 1 cup of flour, 2 eggs, 200g sugar)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
          />
        </div>
        {/* Button to trigger nutrition analysis */}
        <button id="nutri-analyze" onClick={analyzeNutrition}>
          Analyze
        </button>
        {/* Display analysis results or error messages */}
        <div className="result-container">
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {resultHtml && (
            <div dangerouslySetInnerHTML={{ __html: resultHtml }} />
          )}
        </div>
      </div>
    </div>
  )
}

export default NutritionAnalysis
