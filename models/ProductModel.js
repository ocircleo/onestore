const { default: mongoose } = require("mongoose");

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
      },
      category: {
        type: String,
        enum: ['Laptop', 'Monitor', 'Phone', 'Tablet', 'Accessories', 'Others'],
        required: true,
      },
      brand: {
        type: String,
        required: true,
        trim: true,
      },
      model: {
        type: String,
        required: true,
        trim: true,
      },
      specifications: {
        processor: {
          type: String,
          trim: true,
        },
        ram: {
          type: String,
          trim: true,
        },
        storage: {
          type: String,
          trim: true,
        },
        screenSize: {
          type: Number,
        },
        resolution: {
          type: String,
          trim: true,
        },
        battery: {
          type: String,
          trim: true,
        },
        os: {
          type: String,
          trim: true,
        },
        ports: [String], // List of available ports (e.g., USB-C, HDMI, etc.)
        weight: {
          type: Number,
        },
        color: {
          type: String,
          trim: true,
        },
      },
      price: {
        type: Number,
        required: true,
      },
      availability: {
        type: Boolean,
        default: true,
      },
      warrantyPeriod: {
        type: String, // e.g., '1 year', '2 years'
        trim: true,
      },
      releaseDate: {
        type: Date,
      },
      ratings: {
        averageRating: {
          type: Number,
          min: 0,
          max: 5,
          default: 0,
        },
        reviews: [],
      },
      stock: {
        type: Number,
        default: 0,
      },
      images: [String], // URLs of product images
      description: {
        type: String,
        trim: true,
      },
      features: [String], // Special features like 'Touchscreen', '4K', etc.
      updatedAt: {
        type: Date,
        default: Date.now,
      },
});

const ProductModel = mongoose.model("products", schema);
module.exports = ProductModel;
