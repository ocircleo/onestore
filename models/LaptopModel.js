const { default: mongoose } = require("mongoose");
const laptopSchema = new mongoose.Schema({
  dataUrl: { type: String, required: true },
  laptop: {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 10 },
  },
  processor: {
    brand: { type: String, required: true },
    model: { type: String },
    core: { type: String },
  },
  display: {
    size: { type: String, required: true },
    type: { type: String },
    resolution: { type: String },
    touchScreen: { type: Boolean },
    features: { type: String },
  },
  memory: {
    ram: { type: String, required: true },
    ramType: { type: String },
    removable: {
      type: String,
      enum: ["Removable", "Non-Removable"],
    },
  },
  storage: {
    type: { type: String },
    capacity: { type: String, required: true },
    upgradeOptions: { type: String }, // Configurable storage options
  },
  graphics: {
    model: { type: String },
    memory: { type: String },
  },
  keyboardAndTouchpad: {
    keyboard: {
      type: { type: String },
      features: { type: String },
    },
    touchpad: { type: String },
  },
  cameraAndAudio: {
    webcam: { type: String },
    speaker: { type: String },
    microphone: { type: String },
    audioFeatures: { type: String },
  },
  portsAndSlots: {
    cardReader: { type: String },
    hdmiPort: { type: String },
    usbTypeC: { type: String },
    headphoneJack: { type: String },
  },
  networkAndConnectivity: {
    wifi: { type: String },
    bluetooth: { type: String },
  },
  security: {
    fingerprintSensor: { type: String },
  },
  operatingSystem: { type: String },
  power: {
    batteryType: { type: String },
    batteryCapacity: { type: String },
    adapterType: { type: String },
  },
  physicalSpecification: {
    color: { type: String, required: true },
    dimensions: {
      height: { type: String },
      width: { type: String },
      depth: { type: String },
    },
    weight: { type: String },
  },
  warranty: { type: String, required: true },
  publishDate: { type: Date, default: Date.now },
  images: { type: Array, default: [] },
});

const LaptopModel = mongoose.model("laptops", laptopSchema);
module.exports = LaptopModel;
