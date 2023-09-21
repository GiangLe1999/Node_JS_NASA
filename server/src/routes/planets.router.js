const express = require("express");
const planetRouter = express.Router();
const planetControllers = require("../controllers/planets.controllers");

planetRouter.get("/", planetControllers.getAllPlanets);

module.exports = planetRouter;
