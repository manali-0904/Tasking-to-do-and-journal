import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
// import { useLocation } from "react-router-dom";

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

function Dashboard() {
  const today = new Date().toISOString().split("T")[0];
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  // const query = useQuery();
  // const highlightId = query.get("highlight");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tasks")) || [];
    const todaysTasks = stored.filter((t) => t.date === today);
    setTasks(todaysTasks);
  }, [today]);

  const updateStorage = (newTasks) => {
    const all = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedAll = all.map((task) => newTasks.find((nt) => nt.id === task.id) || task);
    localStorage.setItem("tasks", JSON.stringify(updatedAll));
    setTasks(updatedAll.filter((t) => t.date === today));
  };

  const handleAdd = (e) => {
    if (e.key === "Enter" && input.trim()) {
      const newTask = {
        id: Date.now(),
        text: input.trim(),
        completed: false,
        important: false,
        date: today,
        fromMyDay: true,
      };

      const all = JSON.parse(localStorage.getItem("tasks")) || [];
      const updatedAll = [...all, newTask];
      localStorage.setItem("tasks", JSON.stringify(updatedAll));
      setTasks(updatedAll.filter((t) => t.date === today));
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
    setTasks(updatedAll.filter((t) => t.date === today));
  };

  const toggleImportant = (id) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, important: !t.important } : t
    );
    updateStorage(updated);
  };

  return (
    <div className="flex min-h-screen w-full">
      
      <Sidebar />
      
      <main className="flex-1 p-6 bg-gradient-to-br from-blue-100 via-purple-100 to-green-100">
        <h1 className="text-3xl font-bold text-indigo-800 mb-6">My Day – {today}</h1>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleAdd}
          placeholder="Add a new task for today..."
          className="w-full p-3 mb-6 text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {tasks.length === 0 ? (
          <p className="text-center text-gray-500 mt-20 text-xl">
            Do something human ✨
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

export default Dashboard;
