const GeofenceService = require('../services/geofence-service');

class GeofenceController {
    // Create a new geofence location
    async createGeofence(req, res) {
        try {
            const { name, latitude, longitude, radius } = req.body;

            // Validate input
            if (!name || !latitude || !longitude || !radius) {
                return res.status(400).json({
                    success: false,
                    message: 'Name, latitude, longitude, and radius are required',
                });
            }

            const geofenceData = { name, latitude, longitude, radius };
            const geofence = await GeofenceService.createGeofence(geofenceData);
            return res.status(201).json({
                success: true,
                message: 'Geofence location created successfully',
                data: geofence,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message,
            });
        }
    }

    // Update an existing geofence location
    async updateGeofence(req, res) {
        try {
            const geofenceId = req.params.id;
            const geofenceData = req.body;

            if (!geofenceId) {
                return res.status(400).json({
                    success: false,
                    message: 'Geofence ID is required',
                });
            }

            const geofence = await GeofenceService.updateGeofence(geofenceId, geofenceData);

            if (!geofence) {
                return res.status(404).json({
                    success: false,
                    message: 'Geofence not found',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Geofence location updated successfully',
                data: geofence,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message,
            });
        }
    }

    // Find a geofence by ID
    async findGeofenceById(req, res) {
        try {
            const geofenceId = req.params.id;

            if (!geofenceId) {
                return res.status(400).json({
                    success: false,
                    message: 'Geofence ID is required',
                });
            }

            const geofence = await GeofenceService.findGeofenceById(geofenceId);

            if (!geofence) {
                return res.status(404).json({
                    success: false,
                    message: 'Geofence not found',
                });
            }

            return res.status(200).json({
                success: true,
                data: geofence,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message,
            });
        }
    }

    // Find all geofences with a specific filter
    async findGeofences(req, res) {
        try {
            const filter = req.query; // Get filter from query parameters
            const geofences = await GeofenceService.findGeofences(filter);

            return res.status(200).json({
                success: true,
                data: geofences,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message,
            });
        }
    }

    // Delete a geofence location by ID
    async deleteGeofence(req, res) {
        try {
            const geofenceId = req.params.id;

            if (!geofenceId) {
                return res.status(400).json({
                    success: false,
                    message: 'Geofence ID is required',
                });
            }

            const result = await GeofenceService.deleteGeofence(geofenceId);

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'Geofence not found',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Geofence location deleted successfully',
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message,
            });
        }
    }
}

module.exports = new GeofenceController();
