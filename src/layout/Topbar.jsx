
import { useEffect, useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiMenu,
  FiChevronDown,
  FiLogOut,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { clearAuth } from "../features/auth/utils/authStorage";
const Topbar = ({ onMenuClick, currentPath }) => {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();

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

      setCurrentTime(now.toLocaleTimeString("en-IN"));
    };

    updateDateTime();

    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    // Clear token and user information
    clearAuth();

    // Close profile dropdown
    setProfileOpen(false);

    // Navigate to Sign In page
    navigate("/login");
  };

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
      </div>

      <div className="topbar-right">
        {/* Date & Time */}
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

        {/* Admin Profile */}
        <div className="admin-profile-wrapper">
          <button
            type="button"
            className="admin-profile"
            onClick={() => setProfileOpen((prev) => !prev)}
          >
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

            <FiChevronDown
              className={`admin-profile-arrow ${
                profileOpen ? "open" : ""
              }`}
            />
          </button>

          {/* Logout Dropdown */}
          {profileOpen && (
            <div className="admin-profile-menu">
              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;

