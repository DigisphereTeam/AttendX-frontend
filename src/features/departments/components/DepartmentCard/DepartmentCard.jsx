import { FiEye, FiMoreVertical } from "react-icons/fi";
import { Link } from "react-router-dom";

import "./DepartmentCard.css";

const DepartmentCard = ({
  department,
  onMenuClick,
}) => {
  const {
    id,
    name,
    head,
    totalEmployees,
    activeEmployees,
    fingerprintRegistered,
  } = department;

  return (
    <div className="department-card">
      <div className="department-card-header">
        <div>
          <h3>{name}</h3>
          <p>Head: {head}</p>
        </div>

        <button
          type="button"
          className="department-card-menu"
          onClick={() => onMenuClick?.(department)}
          aria-label={`Actions for ${name}`}
        >
          <FiMoreVertical />
        </button>
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