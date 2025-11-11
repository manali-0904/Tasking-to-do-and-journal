import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [query, setQuery] = useState("");
  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks");
      setAllTasks(res.data);
    } catch (err) {
      console.error("Failed to load tasks for search", err);
    }
  };

  fetchTasks();
}, []);


  useEffect(() => {
    if (query.trim()) {
      const q = query.toLowerCase();
      const matches = allTasks.filter((task) =>
        task.text.toLowerCase().includes(q)
      );
      setFilteredTasks(matches);
    } else {
      setFilteredTasks([]);
    }
  }, [query, allTasks]);


  return (
    <div className="w-64 min-h-screen bg-white shadow-md p-6">
      <div className="mb-6 text-center">
        <div className="w-12 h-12 mx-auto bg-indigo-200 text-indigo-800 rounded-full flex items-center justify-center text-xl font-bold">
          {user?.email?.charAt(0).toUpperCase()}
        </div>
        <h2 className="mt-2 font-bold text-lg text-gray-800">{user?.name || "User"}</h2>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>

            {/* Search input */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search tasks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      
        {filteredTasks.length > 0 && (
          <ul className="absolute z-10 left-0 right-0 bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto shadow-md">

  {filteredTasks.map((task) => {
    let destination = "/dashboard";
    if (task.planned_date) destination = "/planned";
    else if (task.important) destination = "/important";

    return (
      <Link key={task.id} to={`${destination}?highlight=${task.id}`}>
        <li className="p-2 hover:bg-indigo-100 text-sm text-gray-700 cursor-pointer">
          {task.text}
        </li>
      </Link>
    );
  })}
</ul>

        )}
      </div>

<nav className="flex flex-col items-start gap-4 mt-6">
  <Link
    to="/dashboard"
    className="text-indigo-800 text-lg font-semibold hover:underline hover:text-indigo-900"
  >
    🏠 My Day
  </Link>
  <Link
    to="/important"
    className="text-indigo-800 text-lg font-semibold hover:underline hover:text-indigo-900"
  >
    ★ Important Tasks
  </Link>
  <Link
    to="/planned"
    className="text-indigo-800 text-lg font-semibold hover:underline hover:text-indigo-900"
  >
    📅 Planned
  </Link>
  <Link
    to="/journal"
    className="text-indigo-800 text-lg font-semibold hover:underline hover:text-indigo-900"
  >
    📓 My Journal
  </Link>
 
</nav>

    </div>
  );
}

export default Sidebar;
