import React, { useEffect, useState } from "react";
import { getAssignedTasks, markTaskAsCompleted } from "../../http"; // Adjust imports based on your project
import Loading from "../Loading"; // Adjust the path based on your project
import { toast } from "react-toastify";

const EmployeeTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        // Fetch tasks assigned to the logged-in employee
        const res = await getAssignedTasks();
        if (res.success) {
          setTasks(res.tasks || []);
        } else {
          toast.error("Failed to fetch tasks.");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const markAsCompleted = async (taskId) => {
    try {
      // Call the API to mark the task as completed
      const res = await markTaskAsCompleted(taskId);
      if (res.success) {
        toast.success("Task marked as completed!");
        // Update the task status in the state
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, status: "Completed" } : task
          )
        );
      } else {
        toast.error(res.message || "Failed to update task.");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="main-content">
      <section className="section">
        <div className="card">
          <div className="card-header d-flex justify-content-between">
            <h4>Assigned Tasks</h4>
          </div>
          <div className="card-body">
            {loading ? (
              <Loading />
            ) : tasks.length === 0 ? (
              <p>No tasks assigned yet.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Deadline</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task._id}>
                      <td>{task.title}</td>
                      <td>{task.description}</td>
                      <td>{new Date(task.deadline).toLocaleDateString()}</td>
                      <td>{task.priority}</td>
                      <td
                        className={`${
                          task.status === "Completed"
                            ? "text-success"
                            : task.status === "Pending"
                            ? "text-primary"
                            : "text-warning"
                        }`}
                      >
                        {task.status}
                      </td>
                      <td>
                        {task.status !== "Completed" && (
                          <button
                            className="btn btn-success"
                            onClick={() => markAsCompleted(task._id)}
                          >
                            Mark as Completed
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default EmployeeTasks;
