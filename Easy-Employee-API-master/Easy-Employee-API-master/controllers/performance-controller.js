const ErrorHandler = require('../utils/error-handler');
const taskService = require('../services/task-service');
const TaskDto = require('../dtos/task-dto');
const mongoose = require('mongoose');

class PerformanceController {
    // Get employee performance in percentage based on tasks assigned and completed
    getPerformance = async (req, res, next) => {
        try {
            const { userId } = req.params;

            // Check if user ID is valid
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return next(ErrorHandler.badRequest('Invalid User ID'));
            }

            // Get all tasks assigned to the user
            const tasks = await taskService.getTasksByUser(userId);
            if (!tasks || tasks.length === 0) {
                return next(ErrorHandler.notFound('No tasks found for this user'));
            }

            // Metrics to calculate
            const totalTasks = tasks.length;
            const completedTasks = tasks.filter(task => task.status === 'Completed').length;
            const onTimeTasks = tasks.filter(task => task.status === 'Completed' && new Date(task.deadline) >= new Date()).length;
            const highPriorityTasks = tasks.filter(task => task.priority === 'High').length;
            const highPriorityCompletedOnTime = tasks.filter(task => task.priority === 'High' && task.status === 'Completed' && new Date(task.deadline) >= new Date()).length;
            const taskReassignments = tasks.filter(task => task.reassigned).length; // Assuming task has a 'reassigned' flag
            const qualityRatings = tasks.map(task => task.qualityRating || 0); // Assuming a quality rating for each task (1-5)
            const totalQualityRating = qualityRatings.reduce((acc, rating) => acc + rating, 0);
            const averageQualityRating = totalQualityRating / qualityRatings.length;

            // Performance Metrics Calculations
            const completionRate = (completedTasks / totalTasks) * 100;
            const timeliness = (onTimeTasks / completedTasks) * 100;
            const priorityHandling = (highPriorityCompletedOnTime / highPriorityTasks) * 100;
            const reassignmentsRate = (taskReassignments / totalTasks) * 100;
            const qualityScore = averageQualityRating; // Assuming average rating out of 5

            // Calculate overall performance
            const performancePercentage = this.calculateOverallPerformance({
                completionRate,
                timeliness,
                priorityHandling,
                qualityScore,
                reassignmentsRate,
            });

            // Send response with calculated performance
            res.json({
                success: true,
                message: 'Employee performance calculated successfully',
                performance: {
                    completionRate,
                    timeliness,
                    priorityHandling,
                    qualityScore,
                    reassignmentsRate,
                    overallPerformance: performancePercentage,
                }
            });
        } catch (error) {
            return next(ErrorHandler.serverError(error.message));
        }
    };

    // Helper method to calculate the overall performance percentage
    calculateOverallPerformance(metrics) {
        const { completionRate, timeliness, priorityHandling, qualityScore, reassignmentsRate } = metrics;

        // Weight each metric
        const weightedCompletionRate = completionRate * 0.25;
        const weightedTimeliness = timeliness * 0.2;
        const weightedPriorityHandling = priorityHandling * 0.15;
        const weightedQualityScore = qualityScore * 0.2;
        const weightedReassignmentsRate = (100 - reassignmentsRate) * 0.1; // Lower reassignments is better

        // Return the weighted average as the overall performance percentage
        return weightedCompletionRate + weightedTimeliness + weightedPriorityHandling + weightedQualityScore + weightedReassignmentsRate;
    }
}

module.exports = new PerformanceController();
