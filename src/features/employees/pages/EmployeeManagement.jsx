import { useMemo, useState, useCallback } from "react";
import { FiEdit2, FiEye, FiPlus, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaUserCheck, FaUserTimes, FaFingerprint } from "react-icons/fa";

import Avatar from "../../../components/Avatar/Avatar";
import Badge from "../../../components/Badge/Badge";
import DataTable from "../../../components/DataTable/DataTable";
import StatCard from "../../../components/StatCard/StatCard";
import TablePagination from "../../../components/TablePagination/TablePagination";
import TableToolbar from "../../../components/TableToolbar/TableToolbar";

import EmployeeModal from "./EmployeeModal";
import { useEmployees } from "../api/employeeApi";

import "./EmployeeManagement.css";

const PAGE_SIZE = 5;

const INITIAL_FORM_STATE = {
  employeeId: "",
  name: "",
  department: "",
  designation: "",
  phone: "",
  status: "Active",
};

const INITIAL_FILTERS = {
  search: "",
  department: "",
  status: "",
  fingerprint: "",
};

const EmployeeManagement = () => {
  const navigate = useNavigate();

  const { data: employees = [], isLoading, isError, error } = useEmployees();

  // Component States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employeeForm, setEmployeeForm] = useState(INITIAL_FORM_STATE);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(1);

  // Department Select Options
  const departmentOptions = useMemo(() => {
    const departments = [
      ...new Set(employees.map((e) => e.departmentName).filter((d) => d && d !== "Unassigned")),
    ];
    return departments.map((dept) => ({ label: dept, value: dept }));
  }, [employees]);

  // Statistics Calculation
  const statistics = useMemo(() => {
    return {
      total: employees.length,
      active: employees.filter((e) => e.status.toLowerCase() === "active").length,
      inactive: employees.filter((e) => e.status.toLowerCase() !== "active").length,
      fingerprintRegistered: employees.filter((e) => e.fingerprintRegistered).length,
    };
  }, [employees]);

  // Filtered & Paginated Employees
  const filteredEmployees = useMemo(() => {
    const query = filters.search.trim().toLowerCase();

    return employees.filter((employee) => {
      const matchesSearch =
        !query ||
        employee.name.toLowerCase().includes(query) ||
        employee.employeeId.toLowerCase().includes(query);

      const matchesDept =
        !filters.department || employee.departmentName === filters.department;

      const matchesStatus =
        !filters.status || employee.status.toLowerCase() === filters.status.toLowerCase();

      const matchesFingerprint =
        !filters.fingerprint ||
        (filters.fingerprint === "registered"
          ? employee.fingerprintRegistered
          : !employee.fingerprintRegistered);

      return matchesSearch && matchesDept && matchesStatus && matchesFingerprint;
    });
  }, [employees, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / PAGE_SIZE));

  const paginatedEmployees = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return filteredEmployees.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredEmployees, page]);

  // Handlers
  const handleOpenAddEmployee = () => {
    setEditingEmployee(null);
    setEmployeeForm({
      ...INITIAL_FORM_STATE,
      employeeId: `EMP-${1013 + employees.length}`,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditEmployee = useCallback((employee) => {
    setEditingEmployee(employee);
    setEmployeeForm({
      employeeId: employee.employeeId,
      name: employee.name,
      department: employee.departmentName,
      designation: employee.designation,
      phone: employee.phone,
      status: employee.status,
    });
    setIsModalOpen(true);
  }, []);

  const handleCloseEmployeeModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleSaveEmployee = (formData) => {
    console.log("Saving employee payload:", formData);
    handleCloseEmployeeModal();
  };

  const handleViewEmployee = useCallback(
    (employee) => {
      navigate(`/employees/${employee.id}`, {
        state: { selectedEmployee: employee.raw },
      });
    },
    [navigate]
  );

  const handleDeleteEmployee = useCallback((id) => {
    console.log("Deleting employee ID:", id);
  }, []);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS);
    setPage(1);
  };

  // Table Columns Definition
  const columns = useMemo(
    () => [
      {
        key: "employee",
        header: "Employee",
        render: (employee) => (
          <div className="employee-table-name">
            <Avatar name={employee.name} />
            <span className="employee-name">{employee.name}</span>
          </div>
        ),
      },
      {
        key: "employeeId",
        header: "Emp ID",
      },
      {
        key: "department",
        header: "Department",
        render: (employee) => (
          <Badge variant="info">{employee.departmentName}</Badge>
        ),
      },
      {
        key: "designation",
        header: "Designation",
      },
      {
        key: "phone",
        header: "Phone",
      },
      {
        key: "status",
        header: "Status",
        render: (employee) => (
          <Badge
            variant={
              employee.status.toLowerCase() === "active" ? "success" : "danger"
            }
          >
            {employee.status}
          </Badge>
        ),
      },
      {
        key: "fingerprint",
        header: "Fingerprint",
        render: (employee) => (
          <Badge
            variant={employee.fingerprintRegistered ? "info" : "default"}
          >
            {employee.fingerprintRegistered ? "Registered" : "Not Registered"}
          </Badge>
        ),
      },
      {
        key: "actions",
        header: "Actions",
        render: (employee) => (
          <div className="employee-table-actions">
            <button
              type="button"
              className="employee-action-button"
              onClick={() => handleViewEmployee(employee)}
              title="View employee"
              aria-label="View employee"
            >
              <FiEye />
            </button>
            <button
              type="button"
              className="employee-action-button"
              onClick={() => handleOpenEditEmployee(employee)}
              title="Edit employee"
              aria-label="Edit employee"
            >
              <FiEdit2 />
            </button>
            <button
              type="button"
              className="employee-action-button employee-delete-button"
              onClick={() => handleDeleteEmployee(employee.id)}
              title="Delete employee"
              aria-label="Delete employee"
            >
              <FiTrash2 />
            </button>
          </div>
        ),
      },
    ],
    [handleViewEmployee, handleOpenEditEmployee, handleDeleteEmployee]
  );

  const toolbarFilters = useMemo(
    () => [
      { name: "search", type: "search", placeholder: "Search by name or employee ID..." },
      { name: "department", type: "select", placeholder: "All Departments", options: departmentOptions },
      {
        name: "status",
        type: "select",
        placeholder: "All Status",
        options: [
          { label: "Active", value: "Active" },
          { label: "Inactive", value: "Inactive" },
        ],
      },
      {
        name: "fingerprint",
        type: "select",
        placeholder: "All Fingerprint",
        options: [
          { label: "Registered", value: "registered" },
          { label: "Not Registered", value: "not_registered" },
        ],
      },
    ],
    [departmentOptions]
  );

  if (isError) {
    return (
      <div className="employee-management">
        <div className="error-card">Failed to fetch data: {error?.message}</div>
      </div>
    );
  }

  return (
    <div className="employee-management">
      {/* Page Header */}
      <div className="department-content-header">
        <div>
          <h1>Employee Management</h1>
          <p>Manage your organization's employee records.</p>
        </div>
        <button
          type="button"
          className="department-add-button"
          onClick={handleOpenAddEmployee}
        >
          <FiPlus /> Add Employee
        </button>
      </div>

      {/* Statistics */}
      <div className="row g-3 employee-statistics">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Total Employees" value={statistics.total} icon={FaUsers} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Active Employees" value={statistics.active} icon={FaUserCheck} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Inactive Employees" value={statistics.inactive} icon={FaUserTimes} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="FP Registered" value={statistics.fingerprintRegistered} icon={FaFingerprint} />
        </div>
      </div>

      {/* Employee Content Card */}
      <div className="employee-content-card">
        <TableToolbar
          filters={toolbarFilters}
          values={filters}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
        />

        <DataTable
          columns={columns}
          data={paginatedEmployees}
          rowKey="id"
          loading={isLoading}
          emptyMessage="No employees found."
        />

        <TablePagination
          page={page}
          totalPages={totalPages}
          totalRecords={filteredEmployees.length}
          pageSize={PAGE_SIZE}
          onPrevious={() => setPage((prev) => Math.max(prev - 1, 1))}
          onNext={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        />
      </div>

      {/* Employee Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={handleCloseEmployeeModal}
        onSubmit={handleSaveEmployee}
        formData={employeeForm}
        setFormData={setEmployeeForm}
        departmentOptions={departmentOptions}
        isEditing={Boolean(editingEmployee)}
      />
    </div>
  );
};

export default EmployeeManagement;