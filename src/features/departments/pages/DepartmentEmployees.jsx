import { useMemo } from "react";
import { FiArrowLeft, FiUserCheck, FiUsers } from "react-icons/fi";

import { useNavigate, useParams } from "react-router-dom";

import Avatar from "../../../components/Avatar/Avatar";
import Badge from "../../../components/Badge/Badge";
import DataTable from "../../../components/DataTable/DataTable";
import StatCard from "../../../components/StatCard/StatCard";
import TablePagination from "../../../components/TablePagination/TablePagination";

import { departments } from "../data/departmentData";
import { departmentEmployees } from "../data/departmentEmployeeData";

import "./DepartmentEmployees.css";
import { FaFingerprint } from "react-icons/fa";

const DepartmentEmployees = () => {
  const navigate = useNavigate();
  const { departmentId } = useParams();

  const department = departments.find(
    (item) => String(item.id) === departmentId,
  );

  const employees = useMemo(
    () =>
      departmentEmployees.filter(
        (employee) => String(employee.departmentId) === departmentId,
      ),
    [departmentId],
  );

  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (employee) => employee.status === "Active",
  ).length;

  const fingerprintRegistered = employees.filter(
    (employee) => employee.fingerprint === "Registered",
  ).length;

  const columns = [
    {
      key: "employee",
      header: "Employee",
      width: "30%",
      render: (employee) => (
        <div className="department-employee-cell">
          <Avatar name={employee.name} />

          <div>
            <span className="department-employee-name">{employee.name}</span>
          </div>
        </div>
      ),
    },
    {
      key: "employeeId",
      header: "Emp ID",
      width: "18%",
    },
    {
      key: "designation",
      header: "Designation",
      width: "22%",
    },
    {
      key: "status",
      header: "Status",
      width: "15%",
      render: (employee) => (
        <Badge variant={employee.status === "Active" ? "success" : "danger"}>
          {employee.status}
        </Badge>
      ),
    },
    {
      key: "fingerprint",
      header: "Fingerprint",
      width: "15%",
      render: (employee) => (
        <Badge
          variant={employee.fingerprint === "Registered" ? "info" : "default"}
        >
          {employee.fingerprint}
        </Badge>
      ),
    },
  ];

  if (!department) {
    return (
      <div className="department-employees-empty">
        <h2>Department not found</h2>

        <button type="button" onClick={() => navigate("/departments")}>
          Back to Departments
        </button>
      </div>
    );
  }

  return (
    <div className="department-employees">
      <div className="department-employees-header">
        <h1>Department Employees</h1>

        <button
          type="button"
          className="department-back-button"
          onClick={() => navigate("/departments")}
        >
          <FiArrowLeft />
          Back to Departments
        </button>
      </div>

      <div className="department-employee-stats">
        <StatCard
          title="Total Employees"
          value={totalEmployees}
          icon={FiUsers}
        />

        <StatCard title="Active" value={activeEmployees} icon={FiUserCheck} />

        <StatCard
          title="FP Registered"
          value={fingerprintRegistered}
          icon={FaFingerprint}
        />
      </div>

      <div className="department-employee-table-section">

        <DataTable columns={columns} data={employees} />

        <TablePagination
          page={1}
          totalPages={1}
          totalRecords={employees.length}
          pageSize={10}
          onPrevious={() => {}}
          onNext={() => {}}
        />
      </div>
    </div>
  );
};

export default DepartmentEmployees;
