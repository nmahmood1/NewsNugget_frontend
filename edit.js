const API_URL = "https://murmuring-badlands-02250.herokuapp.com";
const ENDPOINTS = {
  GET_NEWS_BY_ID: `${API_URL}/news/get/`,
  UPDATE_NEWS: `${API_URL}/news/update/`,
};
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const newsId = urlParams.get("id");
  const form = document.getElementById("edit-news-form");
  const errorMessage = document.getElementById("error-message");

  //   GET NEWS BY ID AND SHOW IN THE FILEDS
  fetch(`${ENDPOINTS.GET_NEWS_BY_ID}${newsId}`)
    .then((response) => response.json())
    .then((data) => {
      // Populate the form fields with the retrieved data
      form.title.value = data.title;
      form.description.value = data.description;
      form.url.value = data.url;
      form.author.value = data.author;
      form.image.value = data.image;
      form.language.value = data.language;
      // Populate the category field (assuming data.category is an array)
      Array.from(form.category.options).forEach((option) => {
        if (data.category.includes(option.value)) {
          option.selected = true;
        }
      });
      const publishedDate = new Date(data.published);
      const formattedDate = publishedDate.toISOString().split('T')[0];
      form.published.value = formattedDate;
    })
    .catch((error) => {
      console.error("Error:", error);
      errorMessage.textContent = "Failed to fetch news article details.";
    });

  // Event listener for form submission for update the news
  form.addEventListener("submit", function (event) {
    event.preventDefault();
   // Get the updated values from the form fields
   const updatedNews = {
    title: form.title.value,
    description: form.description.value,
    url: form.url.value,
    author: form.author.value,
    image: form.image.value,
    language: form.language.value,
    category: Array.from(form.category.selectedOptions).map(option => option.value),
    published: form.published.value
  };

  // Make the API call to update the news article
  fetch(`${ENDPOINTS.UPDATE_NEWS}${newsId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedNews)
  })
    .then(response => response.json())
    .then(data => {
      // Handle the response data or redirect to a success page
      window.location.href = 'index.html';
      // Redirect to a success page or perform any other action
    })
    .catch(error => {
      console.error('Error:', error);
      errorMessage.textContent = 'Failed to update the news article.';
    });
  });
});
