import React, { useState } from "react"
import axios from "axios"

const RecipeSearch = () => {
  // State variables to store user input and recipe data
  const [ingredients, setIngredients] = useState("")
  const [diet, setDiet] = useState("")
  const [calories, setCalories] = useState("")
  const [cuisineType, setCuisineType] = useState("")
  const [recipeList, setRecipeList] = useState([])
  const [errorMessage, setErrorMessage] = useState("")

  // Function to handle form submission and fetch recipes from the API
  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      // API call to Edamam Recipe Search
      const response = await axios.get("https://api.edamam.com/search", {
        params: {
          app_id: "3e4361b4",
          app_key: "e61e338daa8d6f7cf1eda9ffcff65081",
          q: ingredients,
          diet: diet,
          calories: calories,
          cuisineType: cuisineType,
        },
      })

      // Check if recipes are found in the response
      if (response.data.hits.length > 0) {
        const recipes = response.data.hits.map((hit) => hit.recipe)
        setRecipeList(recipes)
      } else {
        // No recipes found, set error message
        setRecipeList([])
        setErrorMessage("No recipes found.")
      }
    } catch (error) {
      // Error occurred during API request, set error message
      setRecipeList([])
      setErrorMessage("Error occurred during API request.")
    }
  }

  return (
    <div className="RS-body" style={{ fontSize: "18px", marginTop: "20px" }}>
      <div className="menu">
        <div className="rs-content">
          <div id="recipeSearch" style={{ marginBottom: "20px" }}>
            {/* Recipe Search Title */}
            <h2 style={{ color: "#333" }}>Recipe Search</h2>

            {/* Recipe Search Form */}
            <form
              className="rs-form"
              onSubmit={handleSubmit}
              id="recipeForm"
              style={{ marginBottom: "200px" }}
            >
              {/* Ingredients Input */}
              <div className="ingredient-input">
                <label htmlFor="ingredients" style={{ width: "150px" }}>
                  Enter Ingredients:
                </label>
                <div className="btn-input">
                  <input
                    type="text"
                    id="ingredients"
                    required
                    className="ingredients-input"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                  />
                  <button type="submit">Search</button>
                </div>
              </div>

              {/* Diet Selection */}
              <div className="option-input">
                <label htmlFor="diet" style={{ width: "150px" }}>
                  Diet:
                </label>
                <select
                  id="diet"
                  value={diet}
                  onChange={(e) => setDiet(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="balanced">Balanced</option>
                  <option value="high-protein">High Protein</option>
                  <option value="low-carb">Low Carb</option>
                  <option value="low-fat">Low Fat</option>
                </select>
              </div>

              {/* Calories Input */}
              <div className="option-input">
                <label htmlFor="calories" style={{ width: "150px" }}>
                  Calories:
                </label>
                <input
                  type="number"
                  id="calories"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                />
              </div>

              {/* Cuisine Type Input */}
              <div className="option-input">
                <label htmlFor="cuisineType" style={{ width: "150px" }}>
                  Cuisine Type:
                </label>
                <input
                  type="text"
                  id="cuisineType"
                  value={cuisineType}
                  onChange={(e) => setCuisineType(e.target.value)}
                />
              </div>
            </form>

            {/* Display Recipe List or Error Message */}
            {recipeList.length > 0 ? (
              <div id="recipeList" className="recipe-grid">
                {recipeList.map((recipe) => (
                  <div
                    className="recipe-row"
                    key={recipe.label}
                    style={{ margin: "20px 0", display: "flex" }}
                  >
                    <div className="recipe-column">
                      {/* Recipe Image */}
                      <img
                        src={recipe.image}
                        alt={recipe.label}
                        className="recipe-image"
                      />
                    </div>
                    <div
                      className="recipe-column"
                      style={{ marginLeft: "20px" }}
                    >
                      {/* Recipe Title */}
                      <h3>{recipe.label}</h3>

                      {/* Recipe Ingredients */}
                      {recipe.ingredientLines.map((line, index) => (
                        <p className="recipe-ingredients" key={index}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Display Error Message
              <div id="recipeList" style={{ color: "red" }}>
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeSearch
