export class Device {
  constructor(id) {
    this.id = id;
    this.readings = {};

    // We're going to keep track of the information we know we want to retreive easily
    this.latestTimestamp = new Date("1970-01-01T00:00:00Z");
    this.sum = 0;
  }

  addReading(timestamp, count) {
    // Update the latest timestamp if this is more recent.
    if (timestamp > this.latestTimestamp) {
      this.latestTimestamp = timestamp;
    }

    // Update the cumulative sum. I was asked to ignore duplicates, so only add
    // if the timestamp doesn't already exist. In doing this strategy, I am
    // assuming that we will NEVER send multiple UNIQUE readings at the exact
    // same timestamp; if this assumption is incorrect, I would perhaps ask
    // if we could update the devices to attach a unique key to the readings.
    // Otherwise, it seems impossible to know the difference between a duplicate
    // sent in error and a duplicate sent intentionally.
    if (!Object.hasOwn(this.readings, timestamp)) {
      this.sum += count;
    }

    // Add the reading to our store.
    this.readings[timestamp] = count;
  }

  getSum() {
    return this.sum;
  }

  getLatestTimestamp() {
    return this.latestTimestamp;
  }
}
