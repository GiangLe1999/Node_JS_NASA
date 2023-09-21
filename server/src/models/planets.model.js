const { parse } = require("csv-parse");
const path = require("node:path");
const fs = require("node:fs");
const Planet = require("../models/planets.mongo");

function isHabitablePlanet(planet) {
  return (
    planet.koi_disposition === "CONFIRMED" &&
    planet.koi_insol > 0.36 &&
    planet.koi_insol < 1.11 &&
    planet.koi_prad < 1.6
  );
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(parse({ comment: "#", columns: true }))
      .on("data", async function (data) {
        if (isHabitablePlanet(data)) {
          await savePlanets(data);
        }
      })
      .on("error", function (error) {
        console.log(error);
      })
      .on("end", function () {
        resolve();
      });
  });
}

async function savePlanets(data) {
  try {
    await Planet.updateOne(
      {
        keplerName: data.kepler_name,
      },
      { keplerName: data.kepler_name },
      { upsert: true }
    );
  } catch (error) {
    console.log(`Could not save planets ${error}`);
  }
}

async function getAllHabitablePlanets() {
  return await Planet.find({}, { _id: 0, __v: 0 });
}

module.exports = { getAllHabitablePlanets, loadPlanetsData };
