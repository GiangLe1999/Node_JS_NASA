const axios = require("axios");

const Launch = require("../models/launches.mongo");
const Planet = require("../models/planets.mongo");

const getAllLaunches = async (skip, limit) => {
  return await Launch.find({}, { _id: 0, __v: 0 })
    .skip(skip)
    .limit(limit)
    .sort({ flightNumber: 1 });
};

const saveLaunch = async (launch) => {
  await Launch.updateOne({ flightNumber: launch.flightNumber }, launch, {
    upsert: true,
  });
};

const addNewLaunch = async (launch) => {
  const planet = await Planet.findOne({ keplerName: launch.target });
  if (!planet) {
    throw new Error("No matching planet was found!");
  }

  const newLaunch = {
    ...launch,
    success: true,
    upcoming: true,
    customers: ["Giang Le", "NASA"],
    flightNumber: (await getLatestFlightNumber()) + 1,
  };

  await saveLaunch(newLaunch);
};

const findLaunch = async (filter) => {
  // Tìm Launch dựa vào Object filter
  return await Launch.findOne({ filter });
};

const loadLaunchesData = async () => {
  // Tìm kiếm database, nếu phát hiện first launch đã tồn tại thì không thực hiện fetch data nữa
  // Mà return ngay lập tức
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    console.log("Launch data already loaded!");
    return;
  }

  const response = await axios.post(
    "https://api.spacexdata.com/v4/launches/query",
    {
      query: "",
      options: {
        pagination: false,
        populate: [
          { path: "rocket", select: { name: 1 } },
          { path: "payloads", select: { customers: 1 } },
        ],
      },
    }
  );

  if (response.status !== 200) {
    console.log("Problem downloading launch data");
    throw new Error("Launch data download failed!");
  }

  const launchDocs = response.data.docs;

  for (const launch of launchDocs) {
    const newLaunchDoc = {
      flightNumber: launch.flight_number,
      mission: launch.name,
      rocket: launch.rocket.name,
      launchDate: launch.data_local,
      upcoming: launch.upcoming,
      success: launch.success,
      customers: launch.payloads.flatMap((payload) => payload.customers),
    };

    await saveLaunch(newLaunchDoc);
  }
};

const getLatestFlightNumber = async () => {
  // Sort các Launches theo thứ flightNumber giảm dần
  const latestLaunch = await Launch.findOne().sort({ flightNumber: -1 });
  // Hoặc
  // const latestLaunch = await Launch.findOne().sort('-flightNumber');

  // Trong trường hợp trong Launches Collection chưa có Launch nào
  if (!latestLaunch) {
    return 100;
  }

  return latestLaunch.flightNumber;
};

const existsLaunchWithId = async (flightNumber) => {
  return await findLaunch({ flightNumber });
};

const abortLaunchById = async (flightNumber) => {
  const aborted = await Launch.updateOne(
    { flightNumber },
    { upcoming: false, success: false }
  );

  return aborted.modifiedCount === 1;
};

module.exports = {
  loadLaunchesData,
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
};
