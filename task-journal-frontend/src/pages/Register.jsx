import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Register() {
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
    await API.post("/register", { name, email, password });
    // ✅ Redirect to login after successful registration
    navigate("/login");
  } catch (err) {
    setError("Registration failed. Try again.");
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4">
  <form className="bg-white/90 backdrop-blur-sm shadow-lg rounded-xl p-8 w-full max-w-md">
 

        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-indigo-600">
          Create an Account
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
          className="text-black w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-200"
        >
          Register
        </button>

        <p className="text-sm mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/" className="text-indigo-600 hover:underline">
            Login here
          </a>
        </p>
      </form>
    </div>
  );
}

export default Register;
