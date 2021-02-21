const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.status(200).json({
    message: "Hello Videoster!!"
  })
});

app.listen(3001);