import { NavLink } from "react-router-dom";
import {
  FiBarChart2,
  FiClock,
  FiGrid,
  FiLayers,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";

const navigation = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: FiGrid,
      },
    ],
  },
  {
    label: "Workforce",
    items: [
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
    ],
  },
  {
    label: "Biometric & Attendance",
    items: [
      {
        label: "Biometric Enrollment",
        path: "/biometrics",
        icon: FiUser,
      },
      // {
      //   label: "Attendance",
      //   path: "/attendance",
      //   icon: FiClock,
      // },
      {
        label: "Attendance History",
        path: "/attendance/history",
        icon: FiClock,
      },
    ],
  },
  {
    label: "Insights",
    items: [
      {
        label: "Reports",
        path: "/reports",
        icon: FiBarChart2,
      },
    ],
  },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      <aside className={`app-sidebar ${isOpen ? "show" : ""}`}>
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-logo">D</div>
            <div className="brand-text">
              <strong>DigiLog</strong>
              <span>By Digisphere Tech</span>
            </div>
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
          {navigation.map((section) => (
            <div className="nav-section" key={section.label}>
              <div className="nav-section-label">{section.label}</div>

              {section.items.map((item) => {
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
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div>© 2026 Digisphere Tech</div>
          {/* <div>Attendance Suite v1.0</div> */}
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