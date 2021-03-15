const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");

const auth = require("./routes/auth");
const users = require("./routes/users");
const categories = require("./routes/categories");
const channels = require("./routes/channels");
const YT = require("./routes/YT");
const tokens = require("./routes/tokens");

const authMiddleware = require("./middleware/authMiddleware");

const db = require("./utils/database");

app.use(bodyParser.json());

app.use("/chand", (req, res, next) => {
  res.status(200).json({
    message: "Its chand",
  });
});

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
app.use("/users", users);
app.use("/categories", categories);
app.use("/channels", channels);
app.use("/YT", YT);
app.use("/tokens", tokens);

app.listen(process.env.PORT || 3001);
