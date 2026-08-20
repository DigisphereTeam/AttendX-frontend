import { useState, useEffect, useRef } from "react";
import { FiEye, FiMoreVertical, FiEdit2, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./DepartmentCard.css";

const DepartmentCard = ({ department, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const {
    id,
    name,
    head,
    totalEmployees = 0,
    activeEmployees = 0,
    fingerprintRegistered = 0,
  } = department;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="department-card">
      <div className="department-card-header">
        <div>
          <h3>{name}</h3>
          <p>Head: {head}</p>
        </div>

        <div className="menu-container" ref={menuRef}>
          <button
            type="button"
            className="department-card-menu"
            onClick={() => setShowMenu((prev) => !prev)}
            aria-label={`Actions for ${name}`}
          >
            <FiMoreVertical />
          </button>

          {showMenu && (
            <div className="department-menu-dropdown">
              <button
                type="button"
                className="menu-item"
                onClick={() => {
                  setShowMenu(false);
                  onEdit?.(department);
                }}
              >
                <FiEdit2 /> Edit
              </button>
              <button
                type="button"
                className="menu-item delete"
                onClick={() => {
                  setShowMenu(false);
                  onDelete?.(id);
                }}
              >
                <FiTrash2 /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="department-card-stats">
        <div className="department-stat">
          <strong>{totalEmployees}</strong>
          <span>Total</span>
        </div>

        <div className="department-stat department-stat-active">
          <strong>{activeEmployees}</strong>
          <span>Active</span>
        </div>

        <div className="department-stat department-stat-fingerprint">
          <strong>{fingerprintRegistered}</strong>
          <span>FP Reg.</span>
        </div>
      </div>

      <Link
        to={`/departments/${id}/employees`}
        className="department-card-view"
      >
        <FiEye />
        <span>View Employees</span>
      </Link>
    </div>
  );
};

export default DepartmentCard;