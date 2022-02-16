// create the express server here
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const apiRouter = require("./api");
const { client } = require("./db");
require("dotenv").config();
const { PORT } = process.env;

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use("/api", apiRouter);

app.get("*", (req, res, next) => {
  res.status(404).send("This route does not exist");
});

app.use(({ name, message }, req, res, next) => {
  res.status(500).send({ name: name, message: message });
});

app.listen(PORT, () => {
  client.connect();
  console.log(`The server is up on  http://localhost:${PORT}`);
});
