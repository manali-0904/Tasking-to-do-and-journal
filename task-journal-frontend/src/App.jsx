import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ImportantTasks from "./pages/ImportantTasks"; 
import PlannedTasks from "./pages/PlannedTasks";
import Journal from "./pages/Journal";
import JournalEntry from "./pages/JournalEntry";

// inside <Routes>
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/important" element={<ImportantTasks />} />
          <Route path="/planned" element={<PlannedTasks />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journal/new" element={<JournalEntry />} />
          <Route path="/journal/:id" element={<JournalEntry />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
