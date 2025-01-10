// models/Geofence.js
const mongoose = require('mongoose');

const geofenceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['office', 'client', 'other'],  // Different types of geofences
    required: true,
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],  // [longitude, latitude]
      required: true,
    },
  },
});

geofenceSchema.index({ coordinates: '2dsphere' });  // Ensure that MongoDB creates a geospatial index for querying by coordinates

module.exports = mongoose.model('Geofence', geofenceSchema);
