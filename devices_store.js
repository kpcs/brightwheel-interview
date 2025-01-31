import { Device } from "./device.js";
export class DevicesStore {
  constructor() {
    this.devices = {};
  }

  findDevice(id) {
    return this.devices[id];
  }

  addDevice(id) {
    const newDevice = new Device(id);
    this.devices[id] = newDevice;
  }
}
