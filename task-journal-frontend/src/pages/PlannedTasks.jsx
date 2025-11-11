import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/sidebar";
import * as chrono from "chrono-node";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function PlannedTasks() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [groupedTasks, setGroupedTasks] = useState({});
  const query = useQuery();
  const highlightId = query.get("highlight");

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/api/tasks");
    const plannedTasks = res.data.filter(task => task.planned_date);
    groupAndSetTasks(plannedTasks);
  };

    const groupAndSetTasks = (tasks) => {
    const grouped = {
      Today: [],
      Tomorrow: [],
      Later: []
    };

    tasks.forEach(task => {
      const date = new Date(task.planned_date);
      if (formatDate(date) === formatDate(today)) {
        grouped.Today.push(task);
      } else if (formatDate(date) === formatDate(tomorrow)) {
        grouped.Tomorrow.push(task);
      } else {
        grouped.Later.push(task);
      }
    });

    setGroupedTasks(grouped);
  };

  const handleAdd = async (e) => {
    if (e.key === "Enter" && input.trim()) {
      const parsed = chrono.parseDate(input);
      const taskData = {
        text: input.trim(),
        completed: false,
        important: false,
        from_my_day: !parsed,
        planned_date: parsed ? formatDate(parsed) : formatDate(today),
        user_email: JSON.parse(localStorage.getItem("user"))?.email || "test@example.com"
      };

      await axios.post("http://localhost:5000/api/tasks", taskData);
      setInput("");
      fetchTasks();
    }
  };

  const toggleComplete = async (id, current) => {
    await axios.put(`http://localhost:5000/api/tasks/${id}`, {
      completed: !current
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="bg-gradient-to-br from-yellow-100 via-red-100 to-pink-100 overflow-auto flex-1 p-6 overflow-auto"> 
        <h1 className="text-3xl font-bold text-indigo-800 mb-6">📅 Planned Tasks</h1>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleAdd}
          placeholder="Add a new task with date info..."
          className="w-full p-3 mb-6 text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {Object.keys(groupedTasks).map((group) => (
          groupedTasks[group].length > 0 && (
            <div key={group} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">{group}</h2>
              <ul className="space-y-4">
                {groupedTasks[group].map((task) => (
                  <li
                    key={task.id}
                    className="p-4 bg-white rounded-lg shadow flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleComplete(task.id, task.completed)}
                        className="w-5 h-5"
                      />
                      <div className="flex flex-col">
                        <span
                          className={`text-lg ${
                            task.completed ? "line-through text-gray-400" : ""
                          }`}
                        >
                          {task.text}
                        </span>
                        {task.from_my_day && (
                          <span className="text-xs text-blue-500">My Day</span>
                        )}
                        {task.planned_date && (
                          <span className="text-xs text-gray-500">
                            {new Date(task.planned_date).toDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 hover:text-red-700 text-xl"
                    >
                      🗑️
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )
        ))}
      </main>
    </div>
  );
}

export default PlannedTasks;
