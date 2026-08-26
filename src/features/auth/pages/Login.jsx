import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [empId, setEmpId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!empId.trim() || !password.trim()) {
      setError("Please enter both your Employee ID/Email and password.");
      return;
    }

    setLoading(true);

    // ---- TEMPORARY demo check (no backend yet) ----
    // Swap this whole block for the real axios call below once
    // your auth endpoint is ready.
    setTimeout(() => {
      if (empId === "admin@gmail.com" && password === "Admin@123") {
        localStorage.setItem("token", "demo-token");
        localStorage.setItem(
          "user",
          JSON.stringify({ name: "Admin", email: empId, role: "Admin" })
        );
        navigate("/dashboard", { replace: true });
      } else {
        setError("Invalid credentials. Please try again.");
      }
      setLoading(false);
    }, 400);

    /* ---- Real API version, use this once your backend is ready ----
    try {
      const res = await axios.post("/api/auth/login", {
        empId,
        password,
        rememberMe,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
    */
  };

  return (
    <div className="auth-shell">
      <div className="container-fluid p-0 h-100">
        <div className="row g-0 h-100">
          {/* LEFT: brand panel */}
          <div className="col-lg-6 d-none d-lg-flex brand-panel">
            <div className="brand-mark">
              <div className="logo-mark">D</div>
              <div className="txt">
                <strong>DigiLog</strong>
                <span>Attendance System</span>
              </div>
            </div>

            <div className="brand-mid">
              <h1>Office attendance, tracked the smart way.</h1>
              <p>
                Punch in, view your history, and keep every check-in accurate
                — all from one place built for Digisphere Tech.
              </p>

              <div className="scan-motif">
                <div className="scan-ring">
                  <i className="bi bi-fingerprint"></i>
                  <div className="scan-line"></div>
                </div>
                <div className="scan-copy">
                  <strong>Biometric-ready</strong>
                  <span>Fast, verified check-ins</span>
                </div>
              </div>
            </div>

            <div className="brand-foot">
              &copy; 2026 Digisphere Tech Private Limited
            </div>
          </div>

          {/* RIGHT: sign-in form */}
          <div className="col-12 col-lg-6 form-panel">
            <div className="form-wrap">
              <h2>Welcome back</h2>
              <p className="sub">
                Sign in with your employee credentials to continue.
              </p>

              {error && (
                <div className="alert alert-danger py-2 px-3 mb-3" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <label className="form-label" htmlFor="empId">
                  Employee Email
                </label>
                <div className="input-icon-wrap">
                  <i className="bi bi-person"></i>
                  <input
                    type="text"
                    className="form-control"
                    id="empId"
                    placeholder="name@digispheretech.in"
                    value={empId}
                    onChange={(e) => setEmpId(e.target.value)}
                    autoComplete="username"
                  />
                </div>

                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <div className="input-icon-wrap">
                  <i className="bi bi-lock"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <i
                    className={`bi toggle-eye ${
                      showPassword ? "bi-eye-slash" : "bi-eye"
                    }`}
                    onClick={() => setShowPassword((s) => !s)}
                    role="button"
                    aria-label="Toggle password visibility"
                  ></i>
                </div>

                <div className="remember-row">
                  <div className="d-flex align-items-center">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Keep me signed in
                    </label>
                  </div>
                </div>

                <button type="submit" className="btn btn-signin" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <div className="form-foot">
                Having trouble signing in? Contact your admin.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}