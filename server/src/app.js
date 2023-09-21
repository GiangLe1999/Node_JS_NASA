const express = require("express");
const cors = require("cors");
const planetRouter = require("./routes/planets.router");
const launchesRouter = require("./routes/launches.router");
const path = require("node:path");
const morgan = require("morgan");

const api = require("./routes/api");

const app = express();

app.use("/v1", api);

app.use(cors({ origin: "http://localhost:3000" }));
app.use(morgan("combined"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/planets", planetRouter);
app.use("/launches", launchesRouter);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
