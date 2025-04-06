const mongoose = require('mongoose');

const imgSchema = new mongoose.Schema(
    {
        imageUrl: {
            type: String,
            required: true,
        },
        targetLink: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

const ImgModel = mongoose.model('ImgModel', imgSchema);

module.exports = ImgModel;
