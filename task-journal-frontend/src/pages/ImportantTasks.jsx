import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
// import { useLocation } from "react-router-dom";

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

function ImportantTasks() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  // const query = useQuery();


  useEffect(() => {
    const all = JSON.parse(localStorage.getItem("tasks")) || [];
    const importantOnly = all.filter((t) => t.important);
    setTasks(importantOnly);
  }, []);

  const updateStorage = (newTasks) => {
    const all = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedAll = all.map((task) =>
      newTasks.find((nt) => nt.id === task.id) || task
    );
    localStorage.setItem("tasks", JSON.stringify(updatedAll));
    const updatedImportant = updatedAll.filter((t) => t.important);
    setTasks(updatedImportant);
  };

  const handleAdd = (e) => {
    if (e.key === "Enter" && input.trim()) {
      const newTask = {
        id: Date.now(),
        text: input.trim(),
        completed: false,
        important: true,
        fromMyDay: false,
      };

      const all = JSON.parse(localStorage.getItem("tasks")) || [];
      const updatedAll = [...all, newTask];
      localStorage.setItem("tasks", JSON.stringify(updatedAll));
      setTasks(updatedAll.filter((t) => t.important));
      setInput("");
    }
  };

  const toggleComplete = (id) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    updateStorage(updated);
  };

  const deleteTask = (id) => {
    const all = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedAll = all.filter((t) => t.id !== id);
    localStorage.setItem("tasks", JSON.stringify(updatedAll));
    setTasks(updatedAll.filter((t) => t.important));
  };

  const toggleImportant = (id) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, important: !t.important } : t
    );
    updateStorage(updated);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gradient-to-br from-yellow-100 via-red-100 to-pink-100 overflow-auto">
        <h1 className="text-3xl font-bold text-indigo-800 mb-6">★ Important Tasks</h1>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleAdd}
          placeholder="Add a new important task..."
          className="w-full p-3 mb-6 text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {tasks.length === 0 ? (
          <p className="text-center text-gray-500 mt-20 text-xl">
            No important tasks yet. Add one above or star from My Day ★
          </p>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="p-4 bg-white rounded-lg shadow flex items-start justify-between"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task.id)}
                      className="w-5 h-5"
                    />
                    <span
                      className={`text-lg ${
                        task.completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {task.text}
                    </span>
                  </div>
                  {task.fromMyDay && (
                    <span className="text-xs text-blue-500 pl-8">My Day</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleImportant(task.id)}
                    className={`text-xl ${
                      task.important ? "text-yellow-500" : "text-gray-400"
                    }`}
                  >
                    ★
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 hover:text-red-700 text-xl"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export default ImportantTasks;
