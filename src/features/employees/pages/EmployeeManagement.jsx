import { useMemo, useState, useCallback } from "react";
import { FiEdit2, FiEye, FiPlus, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // Fixed: Removed unused 'data' import
import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaFingerprint,
} from "react-icons/fa";

import Avatar from "../../../components/Avatar/Avatar";
import Badge from "../../../components/Badge/Badge";
import DataTable from "../../../components/DataTable/DataTable";
import StatCard from "../../../components/StatCard/StatCard";
import TablePagination from "../../../components/TablePagination/TablePagination";
import TableToolbar from "../../../components/TableToolbar/TableToolbar";

import EmployeeModal from "./EmployeeModal";
import {
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
  useEmployees,
} from "../api/employeeApi";
import { useDepartments } from "../../departments/api/departmentApi";

import "./EmployeeManagement.css";
import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import { employeeSchema } from "./employeeSchema";

const PAGE_SIZE = 10;

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

  const {data = { employees: [], counts: {} }, isLoading, isError} = useEmployees();
  const { employees = [], counts = {} } = data;
  const { data: departments = [] } = useDepartments();

  const createEmployeeMutation = useCreateEmployee();
  const updateEmployeeMutation = useUpdateEmployee();
  const deleteEmployeeMutation = useDeleteEmployee();

  const [selectedEmployeeForDelete, setSelectedEmployeeForDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employeeForm, setEmployeeForm] = useState(INITIAL_FORM_STATE);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(1);

  const departmentOptions = useMemo(() => {
    return (departments || []).map((dept) => ({
      label: dept.name,
      value: dept.id,
    }));
  }, [departments]);

  const statistics = useMemo(() => {
    return {
      total: counts?.total_employees ?? 0,
      active: counts?.active_employees ?? 0,
      inactive: counts?.inactive_employees ?? 0,
      fingerprintRegistered: counts?.fp_registered ?? 0,
    };
  }, [counts]);

  const filteredEmployees = useMemo(() => {
    const query = filters.search.trim().toLowerCase();

    return (employees || []).filter((employee) => {
      const matchesSearch =
        !query ||
        employee.name?.toLowerCase().includes(query) ||
        employee.employeeId?.toLowerCase().includes(query);

      const matchesDept =
        !filters.department ||
        String(employee.departmentId) === String(filters.department);

      const matchesStatus =
        !filters.status ||
        employee.status?.toLowerCase() === filters.status.toLowerCase();

      const matchesFingerprint =
        !filters.fingerprint ||
        (filters.fingerprint === "registered"
          ? employee.fingerprintRegistered
          : !employee.fingerprintRegistered);

      return (
        matchesSearch && matchesDept && matchesStatus && matchesFingerprint
      );
    });
  }, [employees, filters]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEmployees.length / PAGE_SIZE)
  );

  const paginatedEmployees = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return filteredEmployees.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredEmployees, page]);

  const handleOpenAddEmployee = () => {
    setEditingEmployee(null);
    setEmployeeForm(INITIAL_FORM_STATE);
    setIsModalOpen(true);
  };

  const handleOpenEditEmployee = useCallback((employee) => {
  setEditingEmployee(employee);

  setEmployeeForm({
    employeeId: String(employee.employeeId || ""),
    name: String(employee.name || ""),
    department: String(employee.departmentId || ""),
    designation: String(employee.designation || ""),
    phone: String(employee.phone || ""),
    status: String(employee.status || ""),
  });

  setIsModalOpen(true);
}, []);

  const handleCloseEmployeeModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
    setEmployeeForm(INITIAL_FORM_STATE);
  };

  const handleSaveEmployee = (formData) => {
    const result = employeeSchema.safeParse(formData);

  if (!result.success) {
    const firstError = result.error.issues[0];

    toast.error(firstError.message);

    return;
  }

  const payload = {
    employee_name: formData.name,
    department_id: Number(formData.department),
    designation: formData.designation,
    mobile_number: formData.phone,
    status: formData.status,
  };

    if (editingEmployee) {
      updateEmployeeMutation.mutate(
        { id: editingEmployee.id, payload },
        {
          onSuccess: () => {
            toast.success("Employee updated successfully!");
            handleCloseEmployeeModal();
          },
          onError: (err) => {
            toast.error(
              err?.response?.data?.message || "Failed to update employee."
            );
          },
        }
      );
    } else {
      createEmployeeMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Employee created successfully!");
          handleCloseEmployeeModal();
        },
        onError: (err) => {
          toast.error(
            err?.response?.data?.message || "Failed to create employee."
          );
        },
      });
    }
  };

  const handleViewEmployee = useCallback(
    (employee) => {
      navigate(`/employees/${employee.id}`, {
        state: { selectedEmployee: employee.raw },
      });
    },
    [navigate]
  );

  const handleOpenDeleteConfirm = useCallback((employee) => {
    setSelectedEmployeeForDelete(employee);
  }, []);

  const handleCloseDeleteConfirm = useCallback(() => {
    if (!deleteEmployeeMutation.isPending) {
      setSelectedEmployeeForDelete(null);
    }
  }, [deleteEmployeeMutation.isPending]);

  const handleConfirmDelete = useCallback(() => {
    if (!selectedEmployeeForDelete) return;

    deleteEmployeeMutation.mutate(selectedEmployeeForDelete.id, {
      onSuccess: () => {
        toast.success("Employee deleted successfully!");
        setSelectedEmployeeForDelete(null);
      },
      onError: (err) => {
        toast.error(
          err?.response?.data?.message || "Failed to delete employee."
        );
      },
    });
  }, [selectedEmployeeForDelete, deleteEmployeeMutation]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS);
    setPage(1);
  };

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
              employee.status?.toLowerCase() === "active" ? "success" : "danger"
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
          <Badge variant={employee.fingerprintRegistered ? "info" : "default"}>
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
              onClick={() => handleOpenDeleteConfirm(employee)}
              title="Delete employee"
              aria-label="Delete employee"
            >
              <FiTrash2 />
            </button>
          </div>
        ),
      },
    ],
    [
      handleViewEmployee,
      handleOpenEditEmployee,
      handleOpenDeleteConfirm,
    ]
  );

  const toolbarFilters = useMemo(
    () => [
      {
        name: "search",
        type: "search",
        placeholder: "Search by name or employee ID...",
      },
      {
        name: "department",
        type: "select",
        placeholder: "All Departments",
        options: departmentOptions,
      },
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
        <div className="error-card">Failed to fetch data</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <LoadingSpinner message="Loading Employee data" fullPage/>
    );
  }

  return (
    <div className="employee-management">
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

      <div className="row g-3 employee-statistics">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Total Employees"
            value={statistics.total}
            icon={FaUsers}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Active Employees"
            value={statistics.active}
            icon={FaUserCheck}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Inactive Employees"
            value={statistics.inactive}
            icon={FaUserTimes}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="FP Registered"
            value={statistics.fingerprintRegistered}
            icon={FaFingerprint}
          />
        </div>
      </div>

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

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={handleCloseEmployeeModal}
        onSubmit={handleSaveEmployee}
        formData={employeeForm}
        setFormData={setEmployeeForm}
        departmentOptions={departmentOptions}
        isEditing={Boolean(editingEmployee)}
        isSubmitting={
          createEmployeeMutation.isPending || updateEmployeeMutation.isPending
        }
      />

      <ConfirmDialog
        show={Boolean(selectedEmployeeForDelete)}
        isOpen={Boolean(selectedEmployeeForDelete)}
        title="Delete Employee"
        message={`Are you sure you want to delete ${selectedEmployeeForDelete?.name || "this employee"}? This action cannot be undone.`}
        confirmText="Delete Employee"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteEmployeeMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={handleCloseDeleteConfirm}
        onCancel={handleCloseDeleteConfirm}
      />
    </div>
  );
};

export default EmployeeManagement;