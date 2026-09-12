import { useState, useMemo } from "react";
import Avatar from "../../../components/Avatar/Avatar";
import DataTable from "../../../components/DataTable/DataTable";
import TablePagination from "../../../components/TablePagination/TablePagination";
import TableToolbar from "../../../components/TableToolbar/TableToolbar";
import CommonModal from "../../../components/CommonModal/CommonModal";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import "./ShiftManagement.css";
import Button from "../../../components/Button/Button";

// Shift Options Definition
const SHIFT_OPTIONS = [
  { label: "General (9:30 AM – 6:00 PM)", value: "General", time: "9:30 AM – 6:00 PM" },
  { label: "1st Shift (7:00 AM – 3:00 PM)", value: "1st shift", time: "7:00 AM – 3:00 PM" },
  { label: "2nd Shift (3:00 PM – 11:00 PM)", value: "2nd shift", time: "3:00 PM – 11:00 PM" },
  { label: "3rd Shift (11:00 PM – 7:00 AM)", value: "3rd shift", time: "11:00 PM – 7:00 AM" },
];

// Employee Options List for Modal Form
const EMPLOYEE_OPTIONS = [
  { id: "EMP-1001", name: "Sarah Jenkins", avatarSrc: "https://i.pravatar.cc/150?img=1", department: "Engineering" },
  { id: "EMP-1002", name: "Marcus Vance", avatarSrc: "", department: "Support" },
  { id: "EMP-1003", name: "Elena Rostova", avatarSrc: "https://i.pravatar.cc/150?img=5", department: "Design" },
  { id: "EMP-1004", name: "David Chen", avatarSrc: "", department: "Engineering" },
  { id: "EMP-1005", name: "Aisha Patel", avatarSrc: "https://i.pravatar.cc/150?img=9", department: "Operations" },
  { id: "EMP-1006", name: "Robert Taylor", avatarSrc: "", department: "Support" },
];

const INITIAL_SHIFTS = [
  {
    id: 1,
    employeeId: "EMP-1001",
    employeeName: "Sarah Jenkins",
    avatarSrc: "https://i.pravatar.cc/150?img=1",
    department: "Engineering",
    shiftType: "General",
    shiftTime: "9:30 AM – 6:00 PM",
    fromDate: "2026-09-15",
    toDate: "2026-09-15",
  },
  {
    id: 2,
    employeeId: "EMP-1002",
    employeeName: "Marcus Vance",
    avatarSrc: "",
    department: "Support",
    shiftType: "1st shift",
    shiftTime: "7:00 AM – 3:00 PM",
    fromDate: "2026-09-15",
    toDate: "2026-09-15",
  },
  {
    id: 3,
    employeeId: "EMP-1003",
    employeeName: "Elena Rostova",
    avatarSrc: "https://i.pravatar.cc/150?img=5",
    department: "Design",
    shiftType: "2nd shift",
    shiftTime: "3:00 PM – 11:00 PM",
    fromDate: "2026-09-16",
    toDate: "2026-09-16",
  },
  {
    id: 4,
    employeeId: "EMP-1004",
    employeeName: "David Chen",
    avatarSrc: "",
    department: "Engineering",
    shiftType: "3rd shift",
    shiftTime: "11:00 PM – 7:00 AM",
    fromDate: "2026-09-16",
    toDate: "2026-09-16",
  },
  {
    id: 5,
    employeeId: "EMP-1005",
    employeeName: "Aisha Patel",
    avatarSrc: "https://i.pravatar.cc/150?img=9",
    department: "Operations",
    shiftType: "General",
    shiftTime: "9:30 AM – 6:00 PM",
    fromDate: "2026-09-17",
    toDate: "2026-09-17",
  },
  {
    id: 6,
    employeeId: "EMP-1006",
    employeeName: "Robert Taylor",
    avatarSrc: "",
    department: "Support",
    shiftType: "1st shift",
    shiftTime: "7:00 AM – 3:00 PM",
    fromDate: "2026-09-17",
    toDate: "2026-09-17",
  },
];

const DEFAULT_FILTERS = {
  search: "",
  department: "",
  shiftType: "",
  date: "",
};

const EMPTY_FORM = {
  id: null,
  employeeId: "",
  department: "",
  fromDate: "",
  toDate: "",
  shiftType: "General",
};

const PAGE_SIZE = 5;

const ShiftManagement = () => {
  const [shifts, setShifts] = useState(INITIAL_SHIFTS);
  const [filterValues, setFilterValues] = useState(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toolbar filters configuration
  const toolbarFilters = [
    {
      name: "search",
      type: "search",
      placeholder: "Search employee or ID...",
    },
    {
      name: "department",
      type: "select",
      placeholder: "All Departments",
      options: [
        { label: "Engineering", value: "Engineering" },
        { label: "Support", value: "Support" },
        { label: "Design", value: "Design" },
        { label: "Operations", value: "Operations" },
      ],
    },
    {
      name: "shiftType",
      type: "select",
      placeholder: "All Shift Types",
      options: SHIFT_OPTIONS.map((s) => ({ label: s.label, value: s.value })),
    },
    {
      name: "date",
      type: "date",
    },
  ];

  // Filter Handlers
  const handleFilterChange = (name, value) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilterValues(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  // Compute Filtered Shifts
  const filteredShifts = useMemo(() => {
    return shifts.filter((item) => {
      const matchesSearch =
        !filterValues.search ||
        item.employeeName
          .toLowerCase()
          .includes(filterValues.search.toLowerCase()) ||
        item.employeeId
          .toLowerCase()
          .includes(filterValues.search.toLowerCase());

      const matchesDept =
        !filterValues.department || item.department === filterValues.department;

      const matchesType =
        !filterValues.shiftType || item.shiftType === filterValues.shiftType;

      const matchesDate =
        !filterValues.date ||
        item.fromDate === filterValues.date ||
        item.toDate === filterValues.date;

      return matchesSearch && matchesDept && matchesType && matchesDate;
    });
  }, [shifts, filterValues]);

  // Pagination Math
  const totalRecords = filteredShifts.length;
  const totalPages = Math.ceil(totalRecords / PAGE_SIZE) || 1;

  const paginatedShifts = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredShifts.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredShifts, currentPage]);

  // Modal Control Handlers
  const handleOpenCreateModal = () => {
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (shift) => {
    setFormData({
      id: shift.id,
      employeeId: shift.employeeId,
      department: shift.department,
      fromDate: shift.fromDate,
      toDate: shift.toDate,
      shiftType: shift.shiftType,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(EMPTY_FORM);
  };

  const handleEmployeeChange = (empId) => {
    const selectedEmp = EMPLOYEE_OPTIONS.find((e) => e.id === empId);
    setFormData((prev) => ({
      ...prev,
      employeeId: empId,
      department: selectedEmp ? selectedEmp.department : prev.department,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const empInfo = EMPLOYEE_OPTIONS.find((e) => e.id === formData.employeeId);
    const shiftInfo = SHIFT_OPTIONS.find((s) => s.value === formData.shiftType);

    setTimeout(() => {
      if (formData.id) {
        // Edit Mode
        setShifts((prev) =>
          prev.map((item) =>
            item.id === formData.id
              ? {
                  ...item,
                  employeeId: formData.employeeId,
                  employeeName: empInfo ? empInfo.name : item.employeeName,
                  avatarSrc: empInfo ? empInfo.avatarSrc : item.avatarSrc,
                  department: formData.department,
                  shiftType: formData.shiftType,
                  shiftTime: shiftInfo ? shiftInfo.time : "",
                  fromDate: formData.fromDate,
                  toDate: formData.toDate,
                }
              : item
          )
        );
      } else {
        // Create Mode
        const newShift = {
          id: Date.now(),
          employeeId: formData.employeeId,
          employeeName: empInfo ? empInfo.name : "Unknown Employee",
          avatarSrc: empInfo ? empInfo.avatarSrc : "",
          department: formData.department,
          shiftType: formData.shiftType,
          shiftTime: shiftInfo ? shiftInfo.time : "",
          fromDate: formData.fromDate,
          toDate: formData.toDate,
        };
        setShifts((prev) => [newShift, ...prev]);
      }

      setIsSubmitting(false);
      handleCloseModal();
    }, 400);
  };

  // Columns Configuration for DataTable
  const columns = [
    {
      key: "employeeName",
      header: "Employee",
      render: (row) => (
        <div className="shift-employee-cell">
          <Avatar name={row.employeeName} src={row.avatarSrc} size="medium" />
          <div className="shift-employee-info">
            <span className="shift-employee-name">{row.employeeName}</span>
            <span className="shift-employee-id">{row.employeeId}</span>
          </div>
        </div>
      ),
    },
    {
      key: "department",
      header: "Department",
    },
    {
      key: "shiftType",
      header: "Shift Type",
      render: (row) => (
        <div>
          <span className="shift-type-name">{row.shiftType}</span>
          <div className="shift-time-subtext">{row.shiftTime}</div>
        </div>
      ),
    },
    {
      key: "dates",
      header: "Duration",
      render: (row) => (
        <span className="shift-timing-text">
          {row.fromDate} {row.toDate && row.fromDate !== row.toDate ? ` to ${row.toDate}` : ""}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "cell-right",
      cellClassName: "cell-right",
      render: (row) => (
        <div className="shift-actions-cell">
          <button
            type="button"
            className="shift-action-btn edit-btn"
            onClick={() => handleOpenEditModal(row)}
            title="Edit Shift"
          >
            <FiEdit2 />
          </button>
          <button
            type="button"
            className="shift-action-btn delete-btn"
            onClick={() =>
              setShifts((prev) => prev.filter((item) => item.id !== row.id))
            }
            title="Delete Shift"
          >
            <FiTrash2 />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="shift-management-container">
      {/* Header Banner */}
      <div className="shift-header">
        <div>
          <h1 className="shift-title">Shift Management</h1>
          <p className="shift-subtitle">Manage and assign employee shifts</p>
        </div>

        <Button
          icon={FiPlus}
          onClick={handleOpenCreateModal}
        >
          
          <span>New Shift</span>
        </Button>
      </div>

      {/* Toolbar Filter Section */}
      <div className="shift-toolbar-container">
        <TableToolbar
          filters={toolbarFilters}
          values={filterValues}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
        />
      </div>

      {/* Main Data Table & Pagination */}
      <div className="shift-table-card">
        <DataTable
          columns={columns}
          data={paginatedShifts}
          rowKey="id"
          loading={loading}
          emptyMessage="No shifts found matching your criteria."
        />

        <TablePagination
          page={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          pageSize={PAGE_SIZE}
          onPrevious={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          onNext={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        />
      </div>

      {/* CommonModal Integration for Assigning / Editing Shifts */}
      <CommonModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={formData.id ? "Edit Shift" : "Assign New Shift"}
        subtitle={
          formData.id
            ? "Update existing shift schedule and details"
            : "Select employee, duration, and shift timings"
        }
        primaryLabel={formData.id ? "Update Shift" : "Assign Shift"}
        secondaryLabel="Cancel"
        onSecondaryClick={handleCloseModal}
        formId="shift-form"
        isSubmitting={isSubmitting}
        maxWidth="540px"
      >
        <form id="shift-form" onSubmit={handleFormSubmit} className="shift-form">
          {/* Employee Dropdown */}
          <div className="form-group">
            <label className="form-label">Employee *</label>
            <select
              className="form-control"
              value={formData.employeeId}
              onChange={(e) => handleEmployeeChange(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Employee
              </option>
              {EMPLOYEE_OPTIONS.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.id})
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div className="form-group">
            <label className="form-label">Department *</label>
            <select
              className="form-control"
              value={formData.department}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, department: e.target.value }))
              }
              required
            >
              <option value="" disabled>
                Select Department
              </option>
              <option value="Engineering">Engineering</option>
              <option value="Support">Support</option>
              <option value="Design">Design</option>
              <option value="Operations">Operations</option>
            </select>
          </div>

          {/* From Date & To Date (Grid Row) */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">From Date *</label>
              <input
                type="date"
                className="form-control"
                value={formData.fromDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, fromDate: e.target.value }))
                }
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">To Date *</label>
              <input
                type="date"
                className="form-control"
                value={formData.toDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, toDate: e.target.value }))
                }
                required
              />
            </div>
          </div>

          {/* Shifts Dropdown */}
          <div className="form-group">
            <label className="form-label">Shift Timing *</label>
            <select
              className="form-control"
              value={formData.shiftType}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, shiftType: e.target.value }))
              }
              required
            >
              {SHIFT_OPTIONS.map((shift) => (
                <option key={shift.value} value={shift.value}>
                  {shift.label}
                </option>
              ))}
            </select>
          </div>
        </form>
      </CommonModal>
    </div>
  );
};

export default ShiftManagement;