const mongoose = require('mongoose');

const missileHitSchema = new mongoose.Schema({
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country' // Reference to the Country collection
    },
    coordinates: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
            index: '2dsphere' // Index for geospatial queries
        }
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    missileType: {
        type: String
    },
    damageRadius: {
        type: Number
    },
    damageLevel: {
        type: String,
        enum: ['minor', 'moderate', 'severe'],
        required: true
    },
    populationReduction: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('MissileHit', missileHitSchema);