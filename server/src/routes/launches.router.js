const express = require("express");
const launchesController = require("../controllers/launches.controllers");

const launchesRouter = express.Router();

launchesRouter.get("/", launchesController.getLaunches);
launchesRouter.post("/", launchesController.httpAddNewLaunch);
launchesRouter.delete("/:id", launchesController.httpAbortLaunch);

module.exports = launchesRouter;
