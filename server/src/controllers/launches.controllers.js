const {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require("../models/launches.model");

const getPagination = require("../services/query");

async function getLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);
  res.status(200).json(await getAllLaunches(skip, limit));
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;
  console.log(launch);

  //Check các field required
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({ error: "Missing required property" });
  }

  //Check format của field launchDate có hợp lệ không
  if (launch.launchDate.toString() === "Invalid Date") {
    return res.status(400).json({ error: "Invalid launch date" });
  }

  launch.launchDate = new Date(launch.launchDate);

  await addNewLaunch(launch);

  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const flightNumber = Number(req.params.id);
  const existLaunch = await existsLaunchWithId(flightNumber);

  if (!existLaunch) {
    return res.status(404).json({ error: "Launch not found!" });
  }

  const aborted = await abortLaunchById(flightNumber);

  if (!aborted) {
    return res.status(400).json({ error: "Launch not aborted" });
  }

  return res.status(200).json({ oke: true });
}

module.exports = { getLaunches, httpAddNewLaunch, httpAbortLaunch };
