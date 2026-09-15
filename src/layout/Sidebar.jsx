import { NavLink } from "react-router-dom";
import { FiBarChart2, FiCalendar, FiDollarSign, FiGrid, FiLayers, FiRepeat, FiUsers, FiX } from "react-icons/fi";
import { FaCalendarTimes, FaClipboardCheck, FaFingerprint } from "react-icons/fa";
import logo from "../assets/logo-digi.png";

const navigation = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: FiGrid,
  },
  {
    label: "Employee Management",
    path: "/employees",
    icon: FiUsers,
  },
  {
    label: "Department Management",
    path: "/departments",
    icon: FiLayers,
  },
  // {
  //   label: "Biometric Enrollment",
  //   path: "/biometrics",
  //   icon: FaFingerprint,
  // },
  {
    label: "Attendance History",
    path: "/attendance-history",
    icon: FaClipboardCheck,
  },
   {
    label: "Leave Management",
    path: "/leave-management",
    icon: FaCalendarTimes,
  },
  {
    label: "My Leaves",
    path: "/leaves",
    icon: FaCalendarTimes,
  },
   {
    label: "Shift Management",
    path: "/shifts",
    icon: FiRepeat,
  },
   {
    label: "Expenditure",
    path: "/expenditure",
    icon: FiDollarSign,
  },
  {
    label: "Calendar",
    path: "/calendar",
    icon: FiCalendar,
  },
  {
    label: "Reports",
    path: "/reports",
    icon: FiBarChart2,
  },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      <aside className={`app-sidebar ${isOpen ? "show" : ""}`}>
        <div className="sidebar-header">
          <div className="brand">
            <img src={logo} alt="Digilog-logo" className="brand-logo " />
          </div>

          <button
            type="button"
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <FiX />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end
                onClick={onClose}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <Icon className="sidebar-link-icon" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div style={{ textAlign: "center" }}>© 2026 Digisphere</div>
        </div>
      </aside>

      <div
        className={`sidebar-overlay ${isOpen ? "show" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
    </>
  );
};

export default Sidebar;
