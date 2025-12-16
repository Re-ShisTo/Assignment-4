const mealImg = document.querySelector(".meal-img");
const mName = document.querySelector(".name");
const shortIntro = document.querySelector(".short-intro");

//loading spinner
const showLoading = () => {
  const meals = document.querySelector(".meals");
  meals.innerHTML = `
  <div class="loading-spinner">
    <div class="spinner"></div>
  </div>
  `;
};

// fetching api
const fetchMeals = async (searchTerm = "") => {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error.message);
  }
};

// displays api data
const displayMeals = async (searchTerm = "") => {
  // shows loading spinner
  showLoading();

  let data = await fetchMeals(searchTerm);
  const meals = document.querySelector(".meals");

  // to clear existing meal
  meals.innerHTML = "";

  // check if meal exist
  if (!data.meals) {
    meals.innerHTML = `<p class="no-results">No meals found. Try another search!</p>`;
    return;
  }

  const mealsToShow = data.meals.slice(0, 12);
  mealsToShow.forEach((mealData, index) => {
    const meal = document.createElement("div");
    meal.classList = "meal";
    meal.innerHTML = `
      <div class="meal-img-container">
        <img src="${mealData.strMealThumb}" 
        alt="${mealData.strMeal}" class="meal-img" />
      </div>
      <h2 class="name">${mealData.strMeal}</h2>
      <p class="short-intro">${
        mealData.strInstructions.slice(0, 100) + "..."
      }</p>
      <button class="btn">VIEW DETAILS</button>
    `;
    meals.appendChild(meal);
  });
  addButtonListeners(data.meals);
};

// search function
const setUpSearch = () => {
  const searchInput = document.querySelector(".searchInput");
  const searchButton = document.querySelector(".search-btn");
  const title = document.querySelector(".title");

  searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.trim();
    displayMeals(searchTerm);
    title.innerText = `${searchTerm} Recipies`;
  });

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const searchTerm = searchInput.value.trim();
      displayMeals(searchTerm);
      title.innerText = `${searchTerm} Recipies`;
    }
  });
};
displayMeals();

// button event listener adding function
const addButtonListeners = (mealsData) => {
  const btn = document.querySelectorAll(".btn");

  btn.forEach((button, index) => {
    button.addEventListener("click", () => {
      const overlay = document.querySelector(".overlay");
      overlay.classList.add("active");

      const mealData = mealsData[index];

      const category = document.querySelector(".category");
      const overlayImage = document.querySelector(".overlay-hero-img");
      const overlayName = document.querySelector(".card-name");
      const instructions = document.querySelector(".instructions");

      overlayImage.setAttribute("src", mealData.strMealThumb);
      overlayName.innerText = mealData.strMeal;
      instructions.innerText = mealData.strInstructions;
      category.innerText = mealData.strCategory;
    });
  });
};

setUpSearch();

// close overlay
const closeBtn = document.querySelector(".close-btn");
if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    const overlay = document.querySelector(".overlay");
    overlay.classList.remove("active");
  });
}

// Close overlay when clicking outside
const overlay = document.querySelector(".overlay");
if (overlay) {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.remove("active");
    }
  });
}
