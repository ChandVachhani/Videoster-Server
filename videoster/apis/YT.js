const axios = require("axios");

const MY_KEY = "AIzaSyA1KurVPfdRyRJfcs3820IoIAALjJPE-VY";
const KEY = "AIzaSyAgnnwHjqsxd0u1HdlRXQyLmZ5wDznKOhM";

exports.YT = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
  params: {
    key: MY_KEY,
  },
});
