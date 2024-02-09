const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    countryName: {
        type: String,
        required: true
    },
    initialPopulation: {
        type: Number,
        required: true
    },
    currentPopulation: {
        type: Number,
        required: true
    },
    missilesHit: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model('Country', countrySchema);