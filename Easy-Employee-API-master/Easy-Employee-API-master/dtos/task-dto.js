class TaskDto {
    id;
    title;
    description;
    assignedTo;
    deadline;
    priority;
    status;
    createdBy;
    createdAt;
    updatedAt;

    constructor(task) {
        this.id = task._id;
        this.title = task.title;
        this.description = task.description;
        this.assignedTo = task.assignedTo;
        this.deadline = task.deadline;
        this.priority = task.priority;
        this.status = task.status;
        this.createdBy = task.createdBy;
        this.createdAt = task.createdAt ? task.createdAt.toISOString() : null;
        this.updatedAt = task.updatedAt ? task.updatedAt.toISOString() : null;
    }
}

module.exports = TaskDto;
