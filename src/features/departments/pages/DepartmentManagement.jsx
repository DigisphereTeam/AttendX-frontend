import { FiPlus } from "react-icons/fi";

import DepartmentCard from "../components/DepartmentCard/DepartmentCard";
import { departments } from "../data/departmentData";

import "./DepartmentManagement.css";

const DepartmentManagement = () => {
  const handleAddDepartment = () => {
    console.log("Add department");
  };

  const handleMenuClick = (department) => {
    console.log("Department actions:", department);
  };

  return (
    <div className="department-management">
      <section className="department-management-content">
        <div className="department-content-header">
          <div>
            <h1>Department Management</h1>

            <p>
              Manage departments and view department-wise employees
            </p>
          </div>

          <button
            type="button"
            className="department-add-button"
            onClick={handleAddDepartment}
          >
            <FiPlus />
            Add Department
          </button>
        </div>

        <div className="department-grid">
          {departments.map((department) => (
            <DepartmentCard
              key={department.id}
              department={department}
              onMenuClick={handleMenuClick}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default DepartmentManagement;