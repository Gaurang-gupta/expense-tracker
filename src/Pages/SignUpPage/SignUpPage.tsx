import React, { useState } from "react";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router";

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const userEmail = result?.user?.email;
      const displayName = result?.user?.displayName || "";
      const photoUrl = result?.user?.photoURL || "";
      console.log(result?.user?.photoURL)
      if (userEmail) {
        sessionStorage.setItem("userEmail", userEmail);
        sessionStorage.setItem("displayName", displayName);
        sessionStorage.setItem("photoUrl", photoUrl);
      }
      alert("Account created successfully!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-700">
          Sign Up
        </h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          onClick={handleSignUp}
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Sign Up
        </button>
        <div className="text-center mt-2">
        Already have an account?{" "}
          <Link
            to="/sign-in"
            className="text-blue-500 underline hover:text-blue-700"
          >
            Sign In here
          </Link>
        </div>
        {error && (
          <p className="mt-4 text-sm text-center text-red-500">Please enter correct email and password</p>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
