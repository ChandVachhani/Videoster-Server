const axios = require("axios");

const KEY = "AIzaSyAgnnwHjqsxd0u1HdlRXQyLmZ5wDznKOhM";
const MY_KEY = "AIzaSyA1KurVPfdRyRJfcs3820IoIAALjJPE-VY";

exports.YT = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
  params: {
    key: MY_KEY,
  },
});
