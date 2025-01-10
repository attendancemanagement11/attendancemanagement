import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getTask,
  updateTask,
  createTask,
  deleteTask,
  viewAllTasks,
  getEmployees,
} from "../../http"; // Adjust the import path based on your project structure
import { toast } from "react-toastify";
import Loading from "../Loading"; // Adjust the path based on your project
import HeaderSection from "../../components/HeaderSection"; // Adjust the path based on your project

const TaskManagement = () => {
  const { id } = useParams(); // Get task ID from URL (if needed)
  const [tasks, setTasks] = useState([]); // For the list of all tasks
  const [employees, setEmployees] = useState([]); // List of employees for assignment
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false); // Tracks whether we're editing a task

  const initialState = {
    title: "",
    description: "",
    assignedTo: "",
    status: "Pending",
    deadline: "",
    priority: "Medium",
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all tasks
        const tasksRes = await viewAllTasks();
        setTasks(tasksRes.success ? tasksRes.tasks || [] : []);

        // Fetch employees for assignment
        const employeesRes = await getEmployees();
        setEmployees(employeesRes.success ? employeesRes.data || [] : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const inputEvent = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, assignedTo, status, deadline, priority } = formData;
    if (!title || !description || !assignedTo || !status || !deadline || !priority) {
      return toast.error("All fields are required");
    }

    try {
      if (editMode) {
        // Update task
        const res = await updateTask(formData.id, formData);
        if (res.success) {
          toast.success("Task updated successfully!");
          setTasks((prev) =>
            prev.map((task) => (task._id === formData._id ? { ...formData } : task))
          );
        } else {
          toast.error(res.message || "Failed to update task");
        }
      } else {
        // Create new task
        const res = await createTask(formData);
        if (res.success) {
          toast.success("Task created successfully!");
          setTasks((prev) => [...prev, res.data]);
        } else {
          toast.error(res.message || "Failed to create task");
        }
      }
      setFormData(initialState);
      setEditMode(false);
    } catch (error) {
      console.error("Error submitting task:", error);
      toast.error("Failed to submit task. Please try again.");
    }
  };

  const editTask = (task) => {
    setFormData(task);
    setEditMode(true); // Enable edit mode
  };

  const handleCancelEdit = () => {
    setFormData(initialState);
    setEditMode(false); // Exit edit mode
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="main-content">
          {/* Task List */}
          <section className="section">
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <h4>All Tasks</h4>
              </div>
              <div className="card-body">
                {tasks.length === 0 ? (
                  <p>No tasks available</p>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Assigned To</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task) => (
                        <tr key={task?._id}>
                          <td>{task?.title}</td>
                          <td>{task?.description}</td>
                          <td>{task?.assignedTo?.name}</td>
                          <td>{task?.status}</td>
                          <td>
                            <button
                              className="btn btn-info"
                              onClick={() => editTask(task)}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </section>

          {/* Task Form */}
          <section className="section">
            <HeaderSection
              title={editMode ? `Update Task: ${formData.title}` : "Create Task"}
            />
            <div className="card">
              <div className="card-body pr-5 pl-5 m-1">
                <form className="row" onSubmit={handleSubmit} id="taskForm">
                  <div className="form-group col-md-6">
                    <label>Task Title</label>
                    <input
                      onChange={inputEvent}
                      value={formData.title}
                      type="text"
                      name="title"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label>Description</label>
                    <textarea
                      onChange={inputEvent}
                      value={formData.description}
                      name="description"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label>Deadline</label>
                    <input
                      onChange={inputEvent}
                      value={formData.deadline}
                      type="date"
                      name="deadline"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label>Priority</label>
                    <select
                      onChange={inputEvent}
                      value={formData.priority}
                      name="priority"
                      className="form-control"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div className="form-group col-md-6">
                    <label>Assigned To</label>
                    <select
                      onChange={inputEvent}
                      value={formData.assignedTo}
                      name="assignedTo"
                      className="form-control"
                    >
                      <option value="" disabled>
                        Select Employee
                      </option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group col-md-6">
                    <label>Status</label>
                    <select
                      onChange={inputEvent}
                      value={formData.status}
                      name="status"
                      className="form-control"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>
                  <div className="d-flex gap-2 mt-3">
                    <button type="submit" className="btn btn-primary">
                      {editMode ? "Update Task" : "Create Task"}
                    </button>
                    {editMode && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default TaskManagement;
