import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebase"; // Ensure you have your Firebase config and initialization in this file
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      // create user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;

      // save user to Firestore (ensure addDoc and collection are imported from "firebase/firestore")
      await addDoc(collection(db, "Users"), {
        uid: user.uid,
        name: form.name,
        role: form.type,
        createdAt: new Date(),
      });

      setSuccess(true);
      console.log("User signed up:", user);
      // navigate("/welcome");
    } catch (error) {
      setError(error?.message || "Signup failed");
      console.error("Error signing up:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 text-blue-600">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-400 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-400 outline-none transition"
            >
              <option value="">Select type</option>
              <option value="doctor">Doctor</option>
              <option value="student">Student</option>
              <option value="amb_assistant">Amb Assistant</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-400 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-400 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-400 outline-none transition"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-400 hover:bg-blue-800 text-white font-semibold py-2 rounded-md shadow transition"
          >
            Sign Up
          </button>
        </form>
        <div>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          {success && (
            <div>
              <p className="text-green-500 text-sm mt-4">
                Signup successful! Redirecting...
              </p>
              <button
                onClick={() => navigate("/login")}
                className="text-blue-500 hover:underline"
              >
                {" "}
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
