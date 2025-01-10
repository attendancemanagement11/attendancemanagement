
const TaskModel = require('../models/task-model');

class TaskService {

    // Create a new task
    createTask = async task => await TaskModel.create(task);

    // Update an existing task
    updateTask = async (id, taskData) => await TaskModel.findByIdAndUpdate(id, taskData, { new: true });

    // Find a single task by filter
    findTask = async filter => await TaskModel.findOne(filter);

    // Find all tasks with a specific filter
    findTasks = async filter => await TaskModel.find(filter);

    // Delete a task
    deleteTask = async id => await TaskModel.findByIdAndDelete(id);
    markTaskAsCompleted = async id => 
        await TaskModel.findByIdAndUpdate(
            id, 
            { status: 'Completed' }, 
            { new: true } // Return the updated document
        );
    
    // Count tasks based on a filter
    countTasks = async filter => await TaskModel.find(filter).countDocuments();

    // Find tasks with a certain status or type
    findTasksByStatus = async status => await TaskModel.find({ status });

    // Assign a task to a user
    async assignTask(taskId, userId) {
        // Step 1: Update the Task document
        const task = await TaskModel.findByIdAndUpdate(
            taskId,
            { assignedTo: userId },
            { new: true }
        );

        if (!task) {
            throw new Error('Task not found');
        }

        // Step 2: Update the User document
        const user = await UserModel.findByIdAndUpdate(
            userId,
            { $addToSet: { assignedTasks: taskId } }, // Ensure no duplicates
            { new: true }
        );

        if (!user) {
            throw new Error('User not found');
        }

        // Optionally return both updated documents
        return { task, user };
    }
    // Find overdue tasks (example of custom logic)
    findOverdueTasks = async () => {
        const now = new Date();
        return await TaskModel.find({ dueDate: { $lt: now }, status: 'Pending' });
    };
    getAllTasks = async () => {
        try {
            return await TaskModel.find().populate('assignedTo');
        } catch (error) {
            console.log(error.message)
            throw new Error('Error retrieving tasks');
        }
    };

    // Get tasks assigned to a specific user
    getTaskById = async (userId) => {
        try {
            return await TaskModel.find({ assignedTo: userId });
        } catch (error) {
            throw new Error('Error retrieving tasks for this user');
        }
    };

    // Delete a task by ID
    deleteTask = async (id) => {
        try {
            const deletedTask = await TaskModel.findByIdAndDelete(id);
            if (!deletedTask) {
                throw new Error('Task not found');
            }
            return deletedTask;
        } catch (error) {
            throw new Error('Error deleting task');
        }
    };

}

module.exports = new TaskService();
