const { default: mongoose } = require("mongoose");
const laptopSchema = new mongoose.Schema({
  dataUrl: { type: String, required: true },
  laptop: {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 10, min: 0 },
  },
  processor: {
    brand: { type: String, required: true },
    model: { type: String },
    core: { type: String },
  },
  display: {
    size: { type: Number, required: true },
    type: { type: String },
    resolution: { type: String },
    touchScreen: { type: Boolean },
  },
  memory: {
    ram: { type: Number, required: true },
    ramType: { type: String },
    description: { type: String },
  },
  storage: {
    type: { type: String },
    capacity: { type: Number, required: true },
    description: { type: String },
  },
  graphics: {
    size: { type: Number, required: true },
    ramType: { type: String },
    description: { type: String },
  },
  keyboard: { type: String },
  fingerPrint: { type: Boolean },
  portsAndSlots: { type: String },
  networkAndConnectivity: { type: String },
  os: { type: String },
  battery: { type: String },

  physicalSpecification: {
    color: { type: String, required: true },
    weight: { type: String },
  },
  warranty: { type: String, required: true },
  publishDate: { type: Date, default: Date.now },
  images: { type: Array, default: [] },
});

const LaptopModel = mongoose.model("laptops", laptopSchema);
module.exports = LaptopModel;
