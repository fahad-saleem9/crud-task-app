import React, { useEffect, useState } from "react";
import {
  FaCheck,
  FaPencilAlt,
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import {
  CreateTask,
  DeleteTaskById,
  GetAllTasks,
  UpdateTaskById,
} from "./api";
import { notify } from "./utils";
import "bootstrap/dist/css/bootstrap.min.css";

function TaskManager() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [copyTasks, setCopyTasks] = useState([]);
  const [updateTask, setUpdateTask] = useState(null);

  useEffect(() => {
    if (updateTask) {
      setInput(updateTask.taskName);
    }
  }, [updateTask]);

  const fetchAllTasks = async () => {
    try {
      const { data } = await GetAllTasks();
      setTasks(data);
      setCopyTasks(data);
    } catch (err) {
      console.error(err);
      notify("Failed to fetch tasks", "error");
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const handleTask = async () => {
    if (!input.trim()) {
      notify("Task cannot be empty", "error");
      return;
    }

    if (updateTask) {
      const obj = { taskName: input, isDone: updateTask.isDone };
      try {
        const { success, message } = await UpdateTaskById(updateTask._id, obj);
        if (success) {
          notify(message, "success");
          fetchAllTasks();
        } else {
          notify(message, "error");
        }
        setUpdateTask(null);
      } catch (err) {
        console.error(err);
        notify("Failed to update task", "error");
      }
    } else {
      const obj = { taskName: input, isDone: false };
      try {
        const { success, message } = await CreateTask(obj);
        if (success) {
          notify(message, "success");
          fetchAllTasks();
        } else {
          notify(message, "error");
        }
      } catch (err) {
        console.error(err);
        notify("Failed to create task", "error");
      }
    }
    setInput("");
  };

  const handleDeleteTask = async (id) => {
    try {
      const { success, message } = await DeleteTaskById(id);
      if (success) {
        notify(message, "success");
        fetchAllTasks();
      } else {
        notify(message, "error");
      }
    } catch (err) {
      console.error(err);
      notify("Failed to delete task", "error");
    }
  };

  const handleCheckAndUncheck = async (task) => {
    try {
      const updatedTask = { ...task, isDone: !task.isDone };
      const { success, message } = await UpdateTaskById(task._id, updatedTask);

      if (success) {
        notify(message, "success");
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t._id === task._id ? updatedTask : t))
        );
      } else {
        notify(message, "error");
      }
    } catch (err) {
      console.error("Error toggling task completion:", err);
      notify("Failed to update task status", "error");
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setTasks(
      copyTasks.filter((item) => item.taskName.toLowerCase().includes(term))
    );
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Task Manager App</h1>

      <div className="row g-2 mb-4">
        <div className="col-12 col-md-6">
          <div className="input-group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="form-control"
              placeholder="Add a new Task"
            />
            <button onClick={handleTask} className="btn btn-success">
              {updateTask ? <FaCheck /> : <FaPlus />}
            </button>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <FaSearch />
            </span>
            <input
              onChange={handleSearch}
              className="form-control"
              type="text"
              placeholder="Search Tasks"
            />
          </div>
        </div>
      </div>

      <div className="list-group">
        {tasks.map((item) => (
          <div
            key={item._id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span className={item.isDone ? "text-decoration-line-through" : ""}>
              {item.taskName}
            </span>
            <div>
              <button
                onClick={() => handleCheckAndUncheck(item)}
                className={`btn btn-sm me-2 ${item.isDone ? "btn-secondary" : "btn-success"}`}
              >
                <FaCheck />
              </button>
              <button
                onClick={() => setUpdateTask(item)}
                className="btn btn-primary btn-sm me-2"
              >
                <FaPencilAlt />
              </button>
              <button
                onClick={() => handleDeleteTask(item._id)}
                className="btn btn-danger btn-sm"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
}

export default TaskManager;
