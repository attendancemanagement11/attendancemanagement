const ErrorHandler = require('../utils/error-handler');
const taskService = require('../services/task-service');
const TaskDto = require('../dtos/task-dto');
const mongoose = require('mongoose');
const taskModel = require('../models/task-model');

class TaskController {
    // Create a task and assign to a user
    createTask = async (req, res, next) => {
        try {
            const { title, description, assignedTo, deadline, priority } = req.body;
            const status = 'In Progress'
            if (!title || !assignedTo || !deadline || !priority) {
                return next(ErrorHandler.badRequest('Title, Assigned To, Deadline, and Priority are required'));
            }

            const task = {
                title,
                description,
                assignedTo,  // Assign user to the task
                deadline,
                priority,
                status: status || 'Pending',
                createdBy: req.user._id, // Assuming you track which admin/leader created the task
            };

            const newTask = await taskService.createTask(task);
            if (!newTask) return next(ErrorHandler.serverError('Failed to create task'));

            res.json({ success: true, message: 'Task created successfully', task: new TaskDto(newTask) });
        } catch (error) {
            return next(ErrorHandler.serverError(error.message));
        }
    };

    // Update task and re-assign it if needed
    updateTask = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { title, description, assignedTo, deadline, priority, status } = req.body;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return next(ErrorHandler.badRequest('Invalid Task ID'));
            }

            const taskUpdates = { title, description, assignedTo, deadline, priority, status };

            const updatedTask = await taskService.updateTask(id, taskUpdates);
            if (!updatedTask) return next(ErrorHandler.serverError('Failed to update task'));

            res.json({ success: true, message: 'Task updated successfully', task: new TaskDto(updatedTask) });
        } catch (error) {
            return next(ErrorHandler.serverError(error.message));
        }
    };

    // Assign task to another user (Separate function, optional)
    assignTask = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { assignedTo } = req.body;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return next(ErrorHandler.badRequest('Invalid Task ID'));
            }

            if (!assignedTo) {
                return next(ErrorHandler.badRequest('AssignedTo field is required'));
            }

            const updatedTask = await taskService.updateTask(id, { assignedTo });
            if (!updatedTask) return next(ErrorHandler.serverError('Failed to assign task'));

            res.json({ success: true, message: 'Task assigned successfully', task: new TaskDto(updatedTask) });
        } catch (error) {
            return next(ErrorHandler.serverError(error.message));
        }
    };

    deleteTask = async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return next(ErrorHandler.badRequest('Invalid Task ID'));
            }

            const deletedTask = await taskService.deleteTask(id);
            if (!deletedTask) return next(ErrorHandler.serverError('Failed to delete task'));

            res.json({ success: true, message: 'Task deleted successfully' });
        } catch (error) {
            return next(ErrorHandler.serverError(error.message));
        }
    };

    getTask = async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return next(ErrorHandler.badRequest('Invalid Task ID'));
            }

            const task = await taskService.getTaskById(id);
            if (!task) return next(ErrorHandler.notFound('Task not found'));

            res.json({ success: true, task: new TaskDto(task) });
        } catch (error) {
            return next(ErrorHandler.serverError(error.message));
        }
    };

    getAllTasks = async (req, res, next) => {
        try {
            const tasks = await taskService.getAllTasks();

            if (!tasks || tasks.length === 0) {
                return next(ErrorHandler.badRequest('No tasks found'));
            }

            const taskDtos = tasks.map(task => new TaskDto(task));
            res.json({ success: true, tasks: taskDtos });
        } catch (error) {
            return next(ErrorHandler.serverError(error.message));
        }
    };

    getTasksByUser = async (req, res, next) => {
        try {
            const { userId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return next(ErrorHandler.badRequest('Invalid User ID'));
            }

            const tasks = await taskService.getTasksByUser(userId);
            if (!tasks || tasks.length === 0) {
                return next(ErrorHandler.notFound('No tasks found for this user'));
            }

            const taskDtos = tasks.map(task => new TaskDto(task));
            res.json({ success: true, tasks: taskDtos });
        } catch (error) {
            return next(ErrorHandler.serverError(error.message));
        }
    };
    viewAllTasks = async (req, res, next) => {
        try {
            const tasks = await taskService.getAllTasks();

            if (!tasks || tasks.length === 0) {
                return next(ErrorHandler.notFound('No tasks found'));
            }

            const taskDtos = tasks.map(task => new TaskDto(task));
            res.json({ success: true, tasks: taskDtos });
        } catch (error) {
            return next(ErrorHandler.serverError(error.message));
        }
    };

    // Get a single task by ID
    getTask = async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return next(ErrorHandler.badRequest('Invalid Task ID'));
            }

            const task = await taskService.getTaskById(id);
            if (!task) return next(ErrorHandler.notFound('Task not found'));

            res.json({ success: true, task: new TaskDto(task) });
        } catch (error) {
            return next(ErrorHandler.serverError(error.message));
        }
    };

    // Delete a task by ID
    deleteTask = async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return next(ErrorHandler.badRequest('Invalid Task ID'));
            }

            const deletedTask = await taskService.deleteTask(id);
            if (!deletedTask) return next(ErrorHandler.serverError('Failed to delete task'));

            res.json({ success: true, message: 'Task deleted successfully' });
        } catch (error) {
            return next(ErrorHandler.serverError(error.message));
        }
    };
    // Get tasks assigned to a specific user
getTasksForUser = async (req, res, next) => {
    try {
      const { _id } = req.user; // Assuming `req.user` contains the logged-in user info
      console.log(req.user)
      const tasks = await taskModel.find({ assignedTo: _id });
      res.json({ success: true, tasks });
    } catch (error) {
        console.log('jbdjbvjfv',error)
      next(ErrorHandler.serverError(error.message));
    }
  };
  

  markTaskAsCompleted = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(ErrorHandler.badRequest('Invalid Task ID'));
        }

        // Update the task status to "Completed"
        const updatedTask = await taskService.markTaskAsCompleted(id);
        if (!updatedTask) return next(ErrorHandler.serverError('Failed to mark task as completed'));

        res.json({
            success: true,
            message: 'Task marked as completed successfully',
            task: updatedTask,
        });
    } catch (error) {
        return next(ErrorHandler.serverError(error.message));
    }
};

}

module.exports = new TaskController();
