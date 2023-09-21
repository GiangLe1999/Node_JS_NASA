const express = require("express");

const planetRouter = require("../routes/planets.router");
const launchesRouter = require("../routes/launches.router");

const api = express.Router();

api.use("/planets", planetRouter);
api.use("/launches", launchesRouter);

module.exports = api;
