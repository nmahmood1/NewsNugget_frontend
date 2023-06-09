// Constants for DOM elements
const categorySelect = document.getElementById("categoryList");
const newsSection = document.getElementById("news-section");

// API endpoints stored in ENDPOINTS for reusability
// const API_URL = "http://localhost:4002";
const API_URL = "https://murmuring-badlands-02250.herokuapp.com";
const ENDPOINTS = {
  ALL_NEWS: `${API_URL}/news/get`,
  CATEGORY_NEWS: `${API_URL}/news/getByCategory/`,
  ALL_CATEGORIES: `${API_URL}/categories/all`,
};

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

// Function to get all news by category
async function getNews(category = "all") {
  const endpoint =
    category === "all"
      ? ENDPOINTS.ALL_NEWS
      : ENDPOINTS.CATEGORY_NEWS + category;
  return fetchData(endpoint);
}

// Function to get all categories
async function getAllCategories() {
  return fetchData(ENDPOINTS.ALL_CATEGORIES);
}

// Function to create a news card
function createNewsCard(news) {
  return `
    <div class="grid-item">
      <div id="card-1" class="news-card">
        <img src="${news.image}" alt="news image">
        <a href="${news.url}" target="_blank" class="title"><h6>${news.title}</h6></a>
        <p>${news.description}</p>
        <span>Published: ${news.published}</span>
        <div class="action">
          <div class="icon">    
            <a  href="edit.html?id=${news._id}"> <i class=" edit fa-regular fa-pen-to-square"></i></a>  
          </div>
          <div class="icon">    
            <i data-news-id=${news._id} class="delete fa-solid fa-trash-can"></i>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Function to display the news
async function showNews(category = "all") {
  const newsList = await getNews(category);
  const newsCards = newsList.map(createNewsCard).join("");
  newsSection.innerHTML = newsCards;
}

// Function to populate the category select
async function populateCategories() {
  const categories = await getAllCategories();
  const categoryOptions = categories
    .map(
      (category) => `<option value="${category._id}">${category.name}</option>`
    )
    .join("");
  categorySelect.innerHTML =
    `<option value="all">All</option>` + categoryOptions;
}

// Function to delete a news card
async function deleteNews(id) {
  const requestOptions = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  };

  const response = await fetch(`${API_URL}/news/delete/${id}`, requestOptions);

  if (response.ok) {
    showNews();
    return await response.json();
  }

  throw new Error(`Request failed: ${response.status}`);
}

// Initialize the application
async function initializeApp() {
  await populateCategories();
  showNews();
}

document.addEventListener("DOMContentLoaded", function () {
  // Event listener for category selection
  categorySelect.addEventListener("change", (event) => {
    showNews(event.target.value);
  });

  // Event listener for delete click
  newsSection.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete")) {
      const id = event.target.dataset.newsId;
      deleteNews(id);
    }
  });

  initializeApp();
});
