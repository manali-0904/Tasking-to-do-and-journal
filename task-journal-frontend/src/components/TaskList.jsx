// src/components/TaskList.jsx
import { useEffect, useState } from "react";
import API from "../api";

function TaskList({ userEmail }) {
  const [tasks, setTasks] = useState("");
  const [newTask, setNewTask] = useState("");

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks/${userEmail}`);
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  const handleCreateTask = async () => {
  if (!newTask.trim()) return;

  try {
    const response = await API.post("/tasks", {
      title: newTask,
      userEmail,
      important: page === "important",
      planned: page === "planned",
      from_my_day: page === "dashboard",
    });

    setTasks([...tasks, response.data]); // Update list
    setNewTask(""); // Clear input
  } catch (err) {
    console.error("Failed to create task:", err);
  }
};

  const toggleComplete = async (id, currentStatus) => {
    try {
      await API.put(`/tasks/${id}`, { completed: !currentStatus });
      fetchTasks();
    } catch (err) {
      console.error("Error toggling task", err);
    }
  };

  const toggleImportant = async (id, currentStatus) => {
    try {
      await API.put(`/tasks/${id}`, { important: !currentStatus });
      fetchTasks();
    } catch (err) {
      console.error("Error toggling important", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task", err);
    }
  };

  return (
    <div>
      <input
        placeholder="Add a task..."
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
       onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleCreateTask(); // Call your function to create the task
    }
  }}
  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
/>
      {tasks.length === 0 ? (
        <p className="text-center text-gray-500">Do something human</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id, task.completed)}
                  className="mr-3"
                />
                <span
                  className={`$ {
                    task.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {task.text}
                  {task.from_my_day && (
                    <span className="text-xs ml-2 text-gray-400">(My Day)</span>
                  )}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleImportant(task.id, task.important)}
                  className={`text-xl ${
                    task.important ? "text-yellow-500" : "text-gray-400"
                  }`}
                >
                  ★
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 text-xl"
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList;
