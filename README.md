# Hello, and thanks for taking the time to consider my application to Brightwheel.

## Setup

After downloading this repository onto your local machine, you can start this server by navigating to the project folder and running `node app.js`. The application will default to using port `3000`. (In a real-world situation, this would not be hard-coded but would rather live in an environment variables file.)

To send requests to the API, you can use an application like Postman. Thus, you can send API requests like: `GET localhost:3000/status`.

In order to send a `POST` with JSON in Postman:

- Ensure the POST request URL is correct, for example `POST` to `localhost:3000/reading`
- On the Headers tab, add the header key/value pair: `Content-Type` - `application/json`
- On the Body tab, select `raw` and choose `JSON` as the type.
- Still on the Body tab, enter in the JSON you'd like to send.
- Click `Send`

## Technologies used

In order to work quickly for an interview problem, I decided to use a Node.js server. In order to accelerate handling of API calls and their JSON bodies, I used the external packages of `express` and `body-parser`.

## Endpoints available

### `GET /status`

Not required for the assignment, but just a quick endpoint to see that the server is running.

### `POST /reading`

This endpoint allows devices to send their readings. It requires the following arguments to be sent in the JSON body:

- id - a string representing the UUID for the device
- readings- an array of readings for the device
  - timestamp- an ISO-8061 timestamp for when the reading was taken
  - count- an integer representing the reading data

### `GET /latest?id={device_id}`

This endpoint allows you to fetch the timestamp of the latest reading for a specific device known by the UUID `device_id`. It should return the following JSON:

```
{
    "latest_timestamp": "2021-09-29T16:08:15+01:00"
}
```

### `GET /sum?id={device_id}`

This endpoint allows you to fetch the sum of counts of all readings for a specific device known by the UUID `device_id`. It should return the following JSON:

```
{
    "cumulative_count": 17
}
```
