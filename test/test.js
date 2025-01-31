import request from "supertest";
import app from "../app.js";
import { expect } from "chai";

describe("App", () => {
  const uuid = "36d5658a-6908-479e-887e-a949ec199272";
  const data = {
    id: uuid,
    readings: [
      {
        timestamp: "2021-09-29T16:08:15+01:00",
        count: 2,
      },
      {
        timestamp: "2021-09-29T16:09:15+01:00",
        count: 15,
      },
    ],
  };

  it("should be healthy", (done) => {
    request(app)
      .get("/status")
      .expect(200)
      .end(function (err, response) {
        expect(response.body).to.have.property("status", "running");
        if (err) throw err;
        done();
      });
  });

  it("should save readings", function (done) {
    request(app)
      .post("/reading")
      .send(data)
      .expect(201)
      .end(function (err, response) {
        expect(response.text).to.equal("Readings saved");
        if (err) throw err;
        done();
      });
  });

  it("should return sum after post", (done) => {
    request(app)
      .post("/reading")
      .send(data)
      .expect(201)
      .end(function () {
        request(app)
          .get("/sum?id=" + uuid)
          .expect(200)
          .end(function (err, response) {
            expect(response.body).to.have.property("cumulative_count", 17);
            if (err) throw err;
            done();
          });
      });
  });

  it("should return latest timestamp after post", (done) => {
    request(app)
      .post("/reading")
      .send(data)
      .expect(201)
      .end(function () {
        request(app)
          .get("/latest?id=" + uuid)
          .expect(200)
          .end(function (err, response) {
            expect(response.body).to.have.property(
              "latest_timestamp",
              "2021-09-29T15:09:15.000Z"
            );
            if (err) throw err;
            done();
          });
      });
  });

  // Finally, adding some examples of tests for unexpected/error states.
  it("should error if no device found for sum", (done) => {
    request(app)
      .get("/sum?id=foo")
      .expect(400)
      .end(function (err, response) {
        expect(response.body).to.have.property("error", "Device ID not found");
        if (err) throw err;
        done();
      });
  });

  it("should error if no device found for latest", (done) => {
    request(app)
      .get("/latest?id=foo")
      .expect(400)
      .end(function (err, response) {
        expect(response.body).to.have.property("error", "Device ID not found");
        if (err) throw err;
        done();
      });
  });

  it("should error with bad timestamp", function (done) {
    const badData = {
      id: uuid,
      readings: [
        {
          timestamp: "xxxxx",
          count: 2,
        },
      ],
    };
    request(app)
      .post("/reading")
      .send(badData)
      .expect(400)
      .end(function (err, response) {
        expect(response.body).to.have.property("error", "Timestamp invalid");
        if (err) throw err;
        done();
      });
  });

  it("should error with bad count", function (done) {
    const badData = {
      id: uuid,
      readings: [
        {
          timestamp: "2021-09-29T16:08:15+01:00",
          count: "foo",
        },
      ],
    };
    request(app)
      .post("/reading")
      .send(badData)
      .expect(400)
      .end(function (err, response) {
        expect(response.body).to.have.property(
          "error",
          "Count should be a number"
        );
        if (err) throw err;
        done();
      });
  });
});
