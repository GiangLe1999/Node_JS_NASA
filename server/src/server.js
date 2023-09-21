require("dotenv").config();

const http = require("node:http");

const app = require("./app");
const mongoose = require("mongoose");

const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchesData } = require("./models/launches.model");

const PORT = process.env.PORT || 8000;

const MONGO_URL = process.env.MONGO_URL;

const server = http.createServer(app);

// mongoose.connection là 1 Event Emitter, nó sẽ emit event khi mà connection thành công hoặc thất bại
// vì thế nên ta có thể dùng method on để bắt event
// tuy nhiên vì connection chỉ diễn ra 1 lần nên ta dùng once để bắt event
mongoose.connection.once("open", () => {
  console.log("MongoDB Connection is ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function startServer() {
  await mongoose.connect(MONGO_URL);

  await loadPlanetsData();

  await loadLaunchesData();

  server.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}...`);
  });
}

startServer();
