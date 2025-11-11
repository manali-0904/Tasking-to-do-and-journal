import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
  const user = localStorage.getItem("user");
  if (user) {
    navigate("/dashboard");
  }
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await API.post("/login", { email, password });
    localStorage.setItem("user", JSON.stringify(res.data));
    navigate("/dashboard"); 
  } catch {
    setError("Invalid credentials");
  }
};


  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4">
    <form 
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto bg-white/90 p-6 rounded-lg shadow-md"
    >

        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-indigo-600">
          Welcome Back
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-black w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="text-black bg-white-200 w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-200"
        >
          Login
        </button>

        <p className="text-sm mt-4 text-center text-gray-600">
          Don’t have an account?{" "}
          <a href="/register" className="text-indigo-600 hover:underline">
            Register here
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login;
