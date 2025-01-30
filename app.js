import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

app.post("/reading", (req, res) => {
  // Access POST data
  const postData = req.body;

  // Process the data
  console.log("Received POST data:", postData);

  res.send("Data received successfully");
});

app.get("/latest", (request, response) => {
  const device_id = request.query.id;
  console.log(device_id);

  const date = new Date();

  const return_data = {
    latest_timestamp: date.toISOString(),
  };

  response.json(return_data);
});

app.get("/sum", (request, response) => {
  const device_id = request.query.id;
  console.log(device_id);

  const return_data = {
    cumulative_count: 17,
  };

  response.json(return_data);
});

app.get("/status", (request, response) => {
  const status = {
    Status: "Running",
  };

  response.send(status);
});

// In a real situation, this variable would live
// in a local environment file.
const PORT = 3000;
app.listen(PORT, () => {
  console.log("app listening on port " + PORT);
});
