// services/geofence-service.js
const GeofenceModel = require('../models/geofence-model'); // Assuming you have a Geofence model

class GeofenceService {

    // Create a new geofence location
    createGeofence = async (geofenceData) => {
        try {
            const geofence = await GeofenceModel.create(geofenceData);
            return geofence;
        } catch (error) {
            throw new Error('Error creating geofence location: ' + error.message);
        }
    };

    // Update an existing geofence location
    updateGeofence = async (id, geofenceData) => {
        try {
            const geofence = await GeofenceModel.findByIdAndUpdate(id, geofenceData, { new: true });
            if (!geofence) {
                throw new Error('Geofence location not found');
            }
            return geofence;
        } catch (error) {
            throw new Error('Error updating geofence location: ' + error.message);
        }
    };

    // Find a geofence by ID
    findGeofenceById = async (id) => {
        try {
            const geofence = await GeofenceModel.findById(id);
            if (!geofence) {
                throw new Error('Geofence location not found');
            }
            return geofence;
        } catch (error) {
            throw new Error('Error finding geofence location: ' + error.message);
        }
    };

    // Find all geofences with a specific filter
    findGeofences = async (filter) => {
        try {
            const geofences = await GeofenceModel.find(filter);
            return geofences;
        } catch (error) {
            throw new Error('Error fetching geofence locations: ' + error.message);
        }
    };

    // Delete a geofence location by ID
    deleteGeofence = async (id) => {
        try {
            const geofence = await GeofenceModel.findByIdAndDelete(id);
            if (!geofence) {
                throw new Error('Geofence location not found');
            }
            return { success: true, message: 'Geofence location deleted successfully' };
        } catch (error) {
            throw new Error('Error deleting geofence location: ' + error.message);
        }
    };
}

module.exports = new GeofenceService();
