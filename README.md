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

In order to run the test suite for the API, navigate to the project folder and run `npm test`.

## Technologies used

In order to work quickly for an interview problem, I decided to use a Node.js server. In order to accelerate handling of API calls and their JSON bodies, I used the external packages of `express` and `body-parser`. In order to write some tests, I installed `supertest`, `mocha` and `chai`.

## Summary of solution

I created a "Devices Store" object to hold all the information for our devices, where the IDs of the devices are used as keys, and "Device" objects are used as values. Keying on the IDs allows us to quickly find a device by ID. When we receive new readings with a POST, I check to see if the ID already exists in the Devices Store, and if not I add it to the store before processing the readings that were submitted.

Each "Device" object maintains its own readings, which I store as an object with timestamps as the keys and the counts as the values. Keying on the timestamps allows us to quickly find a reading by timestamp, to look for duplicates before adding another reading.

Each "Device" keeps track of the latest reading timestamp and the cumulative sum in local variables, since we know these are values we want to pull out with our GET API calls. In my opinion, it seemed more efficient to handle updating these when adding a reading than to have to compute them when requested by computing comparisons/addition across all readings on the fly.

As a result, I just needed to give the "Device" class a couple class methods for accessing these pre-computed variables, which are then called by the respective GET handlers.

## Assumptions made

- I documented this inline as well, but due to the request to ignore duplicate readings, I made the assumption that a device would never send two unique readings sent at the exact same timestamp. It seems impossible to tell the difference between two identical timestamp readings whether they were intentional (i.e., two intentionally identical-count readings) or duplicates (i.e., two accidentally-sent identical-count readings). If multiple readings at the same timestamp needed to be supported, I would advocate for the devices to send a unique identifier with each reading.
- Specifics weren't given about how to handle errors, so I assumed it would be OK to send back JSON with an error message. In a real project, I would chat with stakeholders to determine the best way to handle errors, what information we should give back, etc.
- If I find an error with one reading (e.g., a poorly formatted timestamp), I assumed it was correct to skip processing the rest of the readings after that reading.

## Things skipped for time constraints

In order to keep this a reasonably timeboxed assignment, I kept things simple:

- I didn't convert the whole project to Typescript, even though types are super important for a larger-scale project.
- I didn't do any sort of authentication to ensure only valid requests are made.
- I used a hardcoded PORT of 3000 and didn't set up an environment variables file.
- Per the nudge in the problem prompt, I wrote some tests for the API endpoints which act as integration tests of the whole flow, but I skipped writing unit tests for each of the individual class functions. In a real project, I would be more thorough with testing various cases and components.

## Endpoints available

### `GET /status`

Not required for the assignment, but just a quick endpoint to see that the server is running.

### `POST /reading`

This endpoint allows devices to send their readings. It requires the following arguments to be sent in the JSON body:

- id - a string representing the UUID for the device
- readings - an array of readings for the device
  - timestamp - an ISO-8061 timestamp for when the reading was taken
  - count - an integer representing the reading data

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
