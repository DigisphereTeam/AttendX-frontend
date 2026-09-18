import { useEffect, useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiMenu,
  FiChevronDown,
  FiLogOut,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/context/AuthContext";
import Avatar from "../components/Avatar/Avatar";


const Topbar = ({ onMenuClick, currentPath }) => {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();
  const { user, role, logoutUser } = useAuth();

  // Extract display name from user object with fallbacks
  const displayName =
    user?.name ||
    user?.fullName ||
    user?.full_name ||
    user?.employee_name ||
    user?.username ||
    user?.email ||
    "User";

  // Extract user role with fallback
  const displayRole =
    role ||
    user?.role ||
    user?.user_type ||
    user?.designation ||
    "Employee";

  // Extract avatar image URL if available
  const avatarSrc = user?.profile_pic || user?.avatar || user?.image || "";

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
    // Clear context state and storage via context method
    logoutUser();

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

        {/* User Profile */}
        <div className="admin-profile-wrapper">
          <button
            type="button"
            className="admin-profile"
            onClick={() => setProfileOpen((prev) => !prev)}
          >
            <Avatar name={displayName} src={avatarSrc} size="small" />

            <div className="admin-info">
              <div className="admin-name">{displayName}</div>

              <div className="admin-role" style={{ textTransform: "capitalize" }}>
                {displayRole}
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