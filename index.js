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

client.connect();

app.listen(PORT, () => {
  console.log(`The server is up on  http://localhost:${PORT}`);
});
