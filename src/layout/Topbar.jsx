import { useEffect, useState } from "react";
import { FiCalendar, FiClock, FiMenu } from "react-icons/fi";

const pageMeta = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Welcome back, here's what's happening today.",
  },
  "/employees": {
    title: "Employee Management",
    subtitle: "Manage your organization's employee records.",
  },
  "/departments": {
    title: "Department Management",
    subtitle: "Organize employees by department.",
  },
  "/employees/profile": {
    title: "Employee Profile",
    subtitle: "View detailed employee information.",
  },
  "/biometrics": {
    title: "Biometric Enrollment",
    subtitle: "Register employee fingerprints for attendance.",
  },
  "/attendance": {
    title: "Attendance",
    subtitle: "Fingerprint-based punch in / punch out.",
  },
  "/attendance/history": {
    title: "Attendance History",
    subtitle: "Browse historical attendance records.",
  },
  "/reports": {
    title: "Reports",
    subtitle: "Daily and monthly attendance analytics.",
  },
};

const Topbar = ({ onMenuClick, currentPath }) => {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      setCurrentDate(
        now.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      );

      setCurrentTime(
        now.toLocaleTimeString("en-IN")
      );
    };

    updateDateTime();

    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const meta =
    pageMeta[currentPath] || pageMeta["/dashboard"];

  return (
    <header className="app-topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="sidebar-menu-button d-lg-none"
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <FiMenu />
        </button>

        <div>
          <h1 className="page-title">
            {meta.title}
          </h1>

          <p className="page-subtitle">
            {meta.subtitle}
          </p>
        </div>
      </div>

      <div className="topbar-right">
        <div className="live-clock d-none d-md-flex">
          <span>
            <FiCalendar />
            {currentDate}
          </span>

          <span className="clock-divider">|</span>

          <span>
            <FiClock />
            {currentTime}
          </span>
        </div>

        <div className="admin-profile">
          <div className="admin-avatar">
            AD
          </div>

          <div className="admin-info">
            <div className="admin-name">
              Admin User
            </div>

            <div className="admin-role">
              HR Administrator
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;