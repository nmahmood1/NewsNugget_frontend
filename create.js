// API endpoints stored in ENDPOINTS for reusability
// const API_URL = "http://localhost:4002";
const API_URL = "https://murmuring-badlands-02250.herokuapp.com";
const ENDPOINTS = {
  ALL_CATEGORIES: `${API_URL}/categories/all`,
  ADD_NEWS: `${API_URL}/news/add`,
};

// Initialize the application
async function initializeApp() {
  await populateCategories();
}

initializeApp();

// Function to get all categories
async function getAllCategories() {
  return fetchData(ENDPOINTS.ALL_CATEGORIES);
}

// Function to populate the category select
async function populateCategories() {
  const categorySelect = document.getElementById("category");
  const categories = await getAllCategories();
  const categoryOptions = categories
    .map(
      (category) => `<option value="${category._id}">${category.name}</option>`
    )
    .join("");
  categorySelect.innerHTML =
    `<option value="all">All</option>` + categoryOptions;
}

// Fetch function to handle API calls
async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

document
  .getElementById("news-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission
    // Get form input values
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const url = document.getElementById("url").value;
    const author = document.getElementById("author").value;
    const image = document.getElementById("image").value;
    const language = document.getElementById("language").value;
    const category = Array.from(
      document.getElementById("category").selectedOptions
    ).map((option) => option.value);
    const published = document.getElementById("published").value;

    // Create news object
    const newsData = {
      title,
      description,
      url,
      author,
      image,
      language,
      category: category,
      published,
    };

    // Send a POST request to the API endpoint to create a news article
    fetch(ENDPOINTS.ADD_NEWS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newsData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Clear form input values
        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("url").value = "";
        document.getElementById("author").value = "";
        document.getElementById("image").value = "";
        document.getElementById("language").value = "";
        document.getElementById("category").selectedIndex = -1;
        document.getElementById("published").value = "";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
