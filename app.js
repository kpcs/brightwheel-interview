import express from "express";
import bodyParser from "body-parser";

import { DevicesStore } from "./devices_store.js";

const app = express();
app.use(bodyParser.json());

const devicesStore = new DevicesStore();

app.post("/reading", (request, response) => {
  const postData = request.body;
  const deviceId = postData.id;

  let device = devicesStore.findDevice(deviceId);
  if (!device) {
    devicesStore.addDevice(deviceId);
    device = devicesStore.findDevice(deviceId);
  }

  const readings = postData.readings;
  let errorFound = false;
  readings.forEach((reading) => {
    if (errorFound) {
      // We've already sent an error response to the client, so skip
      // parsing future readings from this device.
      return;
    }
    const timestamp = new Date(reading["timestamp"]);
    if (isNaN(timestamp.getTime())) {
      response.json({
        success: "false",
        error: "Timestamp invalid",
      });
      errorFound = true;
      return;
    }

    const count = reading["count"];
    if (isNaN(count)) {
      response.json({
        success: "false",
        error: "Count should be a number",
      });
      errorFound = true;
      return;
    }

    device.addReading(timestamp, count);
  });

  if (!errorFound) {
    response.json({
      success: "true",
      error: "Readings recorded successfully",
    });
  }
});

app.get("/latest", (request, response) => {
  const deviceId = request.query.id;

  const device = devicesStore.findDevice(deviceId);
  if (!device) {
    response.json({
      success: "false",
      error: "Device ID not found",
    });
    return;
  }

  response.json({
    latest_timestamp: device.getLatestTimestamp(),
  });
});

app.get("/sum", (request, response) => {
  const deviceId = request.query.id;

  const device = devicesStore.findDevice(deviceId);
  if (!device) {
    response.json({
      success: "false",
      error: "Device ID not found",
    });
    return;
  }

  response.json({
    cumulative_count: device.getSum(),
  });
});

app.get("/status", (_request, response) => {
  response.json({
    status: "running",
  });
});

// In a real situation, this variable would live
// in a local environment file.
const PORT = 3000;
app.listen(PORT, () => {
  console.log("app listening on port " + PORT);
});
