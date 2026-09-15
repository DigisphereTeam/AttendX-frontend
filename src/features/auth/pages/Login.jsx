import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../api/authApi";
import { saveToken } from "../utils/authStorage";
import logo from "../../../assets/digiLog-logo.png";

import "./Login.css";

export default function Login() {
  const [role, setRole] = useState("admin"); // "admin" | "employee"

  const [empId, setEmpId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Separate state for the employee tab so switching tabs never clobbers
  // whatever the admin had already typed, and vice versa.
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeeError, setEmployeeError] = useState("");
  const [employeeLoading, setEmployeeLoading] = useState(false);

  const navigate = useNavigate();

  const switchRole = (nextRole) => {
    setRole(nextRole);
    setError("");
    setEmployeeError("");
  };

  // ---- Admin sign in (unchanged) ----
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!empId.trim() || !password.trim()) {
      setError("Please enter both your Employee ID/Email and password.");
      return;
    }

    const payload = {
      email: empId.trim(),
      password,
    };

    setLoading(true);
    try {
      const response = await login(payload);

      if (response.statusCode === 200) {
        toast.success(response.message);

        saveToken(response.data.token);
        navigate("/dashboard", { replace: true });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Signin Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Invalid credentials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ---- Employee sign in (email only) ----
  // NOTE: this calls the same `login` API with only an email in the payload.
  // If your backend needs a dedicated endpoint for employee (email-only)
  // sign-in, swap `login(payload)` below for that function instead
  // (e.g. `loginEmployee(payload)` from authApi).
  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();

    if (!employeeEmail.trim()) {
      setEmployeeError("Please enter your employee email.");
      return;
    }

    const payload = {
      email: employeeEmail.trim(),
    };

    setEmployeeLoading(true);
    try {
      const response = await login(payload);

      if (response.statusCode === 200) {
        toast.success(response.message);

        saveToken(response.data.token);
        navigate("/dashboard", { replace: true });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Employee Signin Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Invalid email. Please try again.",
      );
    } finally {
      setEmployeeLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="container-fluid p-0 h-100">
        <div className="row g-0 h-100">
          {/* LEFT: brand panel */}
          <div className="col-lg-6 d-none d-lg-flex brand-panel">
            <div className="brand-mark">
              <img src={logo} alt="digiLog Logo" className="brand-logo" />
              <div className="txt">
                <span>Attendance System</span>
              </div>
            </div>

            <div className="brand-mid">
              <h1>Office attendance, tracked the smart way.</h1>
              <p>
                Punch in, view your history, and keep every check-in accurate
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
              {/* Role tabs */}
              <div className="role-tabs" role="tablist" aria-label="Sign in as">
                <button
                  type="button"
                  role="tab"
                  aria-selected={role === "admin"}
                  className={`role-tab ${role === "admin" ? "active" : ""}`}
                  onClick={() => switchRole("admin")}
                >
                  Admin
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={role === "employee"}
                  className={`role-tab ${role === "employee" ? "active" : ""}`}
                  onClick={() => switchRole("employee")}
                >
                  Employee
                </button>
              </div>

              {role === "admin" ? (
                <>
                  <h2>Welcome back</h2>
                  <p className="sub">
                    Sign in with your employee credentials to continue.
                  </p>

                  {error && (
                    <div
                      className="alert alert-danger py-2 px-3 mb-3"
                      role="alert"
                    >
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
                      <button
                        type="button"
                        className="toggle-eye"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
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
                        <label
                          className="form-check-label"
                          htmlFor="rememberMe"
                        >
                          Keep me signed in
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-signin"
                      disabled={loading}
                    >
                      {loading ? "Signing in..." : "Sign In"}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <h2>Employee sign in</h2>
                  <p className="sub">
                    Enter your work email to sign in and punch in.
                  </p>

                  {employeeError && (
                    <div
                      className="alert alert-danger py-2 px-3 mb-3"
                      role="alert"
                    >
                      {employeeError}
                    </div>
                  )}

                  <form onSubmit={handleEmployeeSubmit} noValidate>
                    <label className="form-label" htmlFor="employeeEmail">
                      Employee Email
                    </label>
                    <div className="input-icon-wrap">
                      <i className="bi bi-envelope"></i>
                      <input
                        type="text"
                        className="form-control"
                        id="employeeEmail"
                        placeholder="name@digispheretech.in"
                        value={employeeEmail}
                        onChange={(e) => setEmployeeEmail(e.target.value)}
                        autoComplete="username"
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-signin employee-signin"
                      disabled={employeeLoading}
                    >
                      {employeeLoading ? "Signing in..." : "Sign In"}
                    </button>
                  </form>
                </>
              )}

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





// import { useState } from "react"; 
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { login } from "../api/authApi";
// import { saveToken } from "../utils/authStorage";
// import logo from "../../../assets/digiLog-logo.png"
 
// import "./Login.css";
 
// export default function Login() {
//   const [empId, setEmpId] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
 
//   const navigate = useNavigate();
 
//   const handleSubmit = async (e) => {
//     e.preventDefault();
 
//     if (!empId.trim() || !password.trim()) {
//       setError("Please enter both your Employee ID/Email and password.");
//       return;
//     }
 
//     const payload = {
//       email: empId.trim(),
//       password,
//     };
 
//     setLoading(true);
//     try {
//       const response = await login(payload);
 
//       if (response.statusCode === 200) {
//         toast.success(response.message);
 
//         saveToken(response.data.token);
//         navigate("/dashboard", { replace: true });
//       } else {
//         toast.error(response.message);
//       }
//     } catch (error) {
//       console.error("Signin Error:", error);
 
//       toast.error(
//         error.response?.data?.message ||
//           "Invalid credentials. Please try again.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };
 
//   return (
//     <div className="auth-shell">
//       <div className="container-fluid p-0 h-100">
//         <div className="row g-0 h-100">
//           {/* LEFT: brand panel */}
//           <div className="col-lg-6 d-none d-lg-flex brand-panel">
//             <div className="brand-mark">
//               <img src={logo} alt="digiLog Logo" className="brand-logo" />
//               <div className="txt">
//                 <span>Attendance System</span>
//               </div>
//             </div>
 
//             <div className="brand-mid">
//               <h1>Office attendance, tracked the smart way.</h1>
//               <p>
//                 Punch in, view your history, and keep every check-in accurate 
//               </p>
 
//               <div className="scan-motif">
//                 <div className="scan-ring">
//                   <i className="bi bi-fingerprint"></i>
//                   <div className="scan-line"></div>
//                 </div>
//                 <div className="scan-copy">
//                   <strong>Biometric-ready</strong>
//                   <span>Fast, verified check-ins</span>
//                 </div>
//               </div>
//             </div>
 
//             <div className="brand-foot">
//               &copy; 2026 Digisphere Tech Private Limited
//             </div>
//           </div>
 
//           {/* RIGHT: sign-in form */}
//           <div className="col-12 col-lg-6 form-panel">
//             <div className="form-wrap">
//               <h2>Welcome back</h2>
//               <p className="sub">
//                 Sign in with your employee credentials to continue.
//               </p>
 
//               {error && (
//                 <div className="alert alert-danger py-2 px-3 mb-3" role="alert">
//                   {error}
//                 </div>
//               )}
 
//               <form onSubmit={handleSubmit} noValidate>
//                 <label className="form-label" htmlFor="empId">
//                   Employee Email
//                 </label>
//                 <div className="input-icon-wrap">
//                   <i className="bi bi-person"></i>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="empId"
//                     placeholder="name@digispheretech.in"
//                     value={empId}
//                     onChange={(e) => setEmpId(e.target.value)}
//                     autoComplete="username"
//                   />
//                 </div>
 
//                 <label className="form-label" htmlFor="password">
//                   Password
//                 </label>
//                 <div className="input-icon-wrap">
//                   <i className="bi bi-lock"></i>
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     className="form-control"
//                     id="password"
//                     placeholder="Enter your password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     autoComplete="current-password"
//                   />
//                   <button
//                     type="button"
//                     className="toggle-eye"
//                     onClick={() => setShowPassword((s) => !s)}
//                     aria-label={
//                       showPassword ? "Hide password" : "Show password"
//                     }
//                   >
//                     {showPassword ? <FaEyeSlash /> : <FaEye />}
//                   </button>
//                 </div>
 
//                 <div className="remember-row">
//                   <div className="d-flex align-items-center">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id="rememberMe"
//                       checked={rememberMe}
//                       onChange={(e) => setRememberMe(e.target.checked)}
//                     />
//                     <label className="form-check-label" htmlFor="rememberMe">
//                       Keep me signed in
//                     </label>
//                   </div>
//                 </div>
 
//                 <button
//                   type="submit"
//                   className="btn btn-signin"
//                   disabled={loading}
//                 >
//                   {loading ? "Signing in..." : "Sign In"}
//                 </button>
//               </form>
 
//               <div className="form-foot">
//                 Having trouble signing in? Contact your admin.
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
 
 