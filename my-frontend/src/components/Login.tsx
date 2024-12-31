import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase-config";
import ErrorModal from "./ErrorMessage";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const auth = getAuth(app);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in successfully!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError("Invalid email or password. Please try again.");
        setShowErrorModal(true);
        console.error("Login error:", error.message);
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("User registered successfully!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError("Registration failed. Please try again.");
        setShowErrorModal(true);
        console.error("Registration error:", error.message);
      }
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegistering ? "Register" : "Login"}</h2>
      <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered"
            required
          />
        </div>
        <div className="form-control">
          <button type="submit" className="btn btn-primary">
            {isRegistering ? "Register" : "Log In"}
          </button>
        </div>
      </form>

      <div className="toggle-btn">
        <button 
          onClick={() => setIsRegistering(!isRegistering)} 
          className="btn btn-link">
          {isRegistering ? "Already have an account? Log In" : "Don't have an account? Register"}
        </button>
      </div>

      {showErrorModal && (
        <ErrorModal 
          message={error} 
          onClose={() => setShowErrorModal(false)} 
        />
      )}
    </div>
  );
};

export default Login;