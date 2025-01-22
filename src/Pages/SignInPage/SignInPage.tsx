import React, { useState } from "react";
import { auth, googleProvider } from "../../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router";
import { Link } from "react-router";

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate()

  const handleEmailSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = userCredential?.user?.email;
      const displayName = userCredential?.user?.displayName || "";
      const photoUrl = userCredential?.user?.photoURL || "";
      console.log(userCredential?.user?.photoURL)
      if (userEmail) {
        sessionStorage.setItem("userEmail", userEmail);
        sessionStorage.setItem("displayName", displayName);
        sessionStorage.setItem("photoUrl", photoUrl);
        // alert("Signed in successfully!");
        navigate("/")
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result?.user)
      const userEmail = result?.user?.email;
      const displayName = result?.user?.displayName || "";
      const photoUrl = result?.user?.photoURL || "";
      console.log(result?.user?.photoURL)
      if (userEmail) {
        sessionStorage.setItem("userEmail", userEmail);
        sessionStorage.setItem("displayName", displayName);
        sessionStorage.setItem("photoUrl", photoUrl);
        navigate("/")
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-700">
          Sign In
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
        <button
          onClick={handleEmailSignIn}
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Sign In
        </button>
        <div className="text-center my-3">
          OR
        </div>
        <button
          onClick={handleGoogleSignIn}
          className="w-full px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
        >
          Sign In with Google
        </button>
        <div className="text-center mt-2">
        Don't have an account?{" "}
          <Link
            to="/sign-up"
            className="text-blue-500 underline hover:text-blue-700"
          >
            Sign up here
          </Link>
        </div>
        {error && (
          <p className="mt-4 text-sm text-center text-red-500">Check your Email and Password</p>
        )}
      </div>
    </div>
  );
};

export default SignInPage;
