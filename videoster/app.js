const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const auth = require("./routes/auth");
const user = require("./routes/users");

const authMiddleware = require("./middleware/authMiddleware");

const db = require("./utils/database");

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(cors());

db.sync();

app.use("/auth", auth);

app.use(authMiddleware.verifyLogin);

app.use("/users", user);

app.listen(3001);