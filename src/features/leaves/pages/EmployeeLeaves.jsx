import { useState, useMemo } from "react";
import {
  FiPlus,
  FiEdit2,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiCheck,
} from "react-icons/fi";

import StatCard from "../../../components/StatCard/StatCard";
import TableToolbar from "../../../components/TableToolbar/TableToolbar";
import DataTable from "../../../components/DataTable/DataTable";
import Badge from "../../../components/Badge/Badge";
import TablePagination from "../../../components/TablePagination/TablePagination";
import CommonModal from "../../../components/CommonModal/CommonModal";
import Button from "../../../components/Button/Button";

import {
  getCurrentFinancialYear,
  generateFinancialYears,
  getFinancialYearRange,
} from "../../../utils/financialYear";

import "./EmployeeLeaves.css";

const PAGE_SIZE = 10;
const TOTAL_LEAVE_QUOTA = 30;

const LEAVE_TYPES = [
  { id: "Optional Holidays", name: "Optional Holidays" },
  { id: "Sick Leave", name: "Sick Leave" },
  { id: "Casual Leave", name: "Casual Leave" },
];

const LEAVE_CATEGORY_BY_TYPE = {
  "Optional Holidays": "Optional Holiday",
  "Sick Leave": "Medical",
  "Casual Leave": "Personal Time",
};

const INITIAL_FORM_STATE = {
  leaveType: "Optional Holidays",
  startDate: "",
  endDate: "",
  dayType: "full",
  reason: "",
};

const MOCK_LEAVES = [
  {
    id: 1,
    leaveType: "Sick Leave",
    category: "Medical",
    duration: "2 days",
    dateRange: "Jul 20 – Jul 21, 2026",
    startDate: "2026-07-20",
    endDate: "2026-07-21",
    dayType: "full",
    reason: "Viral fever & medical rest",
    appliedOn: "Jul 20, 2026",
    status: "Approved",
  },
  {
    id: 2,
    leaveType: "Casual Leave",
    category: "Personal Time",
    duration: "1 day",
    dateRange: "Aug 14, 2026",
    startDate: "2026-08-14",
    endDate: "2026-08-14",
    dayType: "full",
    reason: "Personal bank work",
    appliedOn: "Aug 10, 2026",
    status: "Approved",
  },
  {
    id: 3,
    leaveType: "Optional Holidays",
    category: "Optional Holiday",
    duration: "1 day",
    dateRange: "Sep 05, 2026",
    startDate: "2026-09-05",
    endDate: "2026-09-05",
    dayType: "full",
    reason: "Festival holiday",
    appliedOn: "Sep 01, 2026",
    status: "Pending",
  },
];

const formatDate = (date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

const getBadgeVariant = (status) => {
  switch (status) {
    case "Approved":
      return "info";
    case "Pending":
      return "warning";
    case "Rejected":
      return "danger";
    default:
      return "default";
  }
};

const EmployeeLeaves = () => {
  const [leaves, setLeaves] = useState(MOCK_LEAVES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const currentFY = useMemo(() => getCurrentFinancialYear(), []);
  const financialYearOptions = useMemo(() => generateFinancialYears(5), []);

  const [filterValues, setFilterValues] = useState({
    search: "",
    leaveType: "",
    status: "",
    financialYear: currentFY,
  });
  const [page, setPage] = useState(1);

  const handleFilterChange = (name, value) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilterValues({
      search: "",
      leaveType: "",
      status: "",
      financialYear: currentFY,
    });
    setPage(1);
  };

  // --- Modal Handlers ---
  const handleOpenAdd = () => {
    setSelectedLeave(null);
    setFormData(INITIAL_FORM_STATE);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (leaveRow) => {
    setSelectedLeave(leaveRow);
    setFormData({
      leaveType: leaveRow.leaveType || "Optional Holidays",
      startDate: leaveRow.startDate || "",
      endDate: leaveRow.endDate || "",
      dayType: leaveRow.dayType || "full",
      reason: leaveRow.reason || "",
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedLeave(null);
    setFormData(INITIAL_FORM_STATE);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "reason" && value.length > 300) return;

    setFormData((prev) => {
      const nextForm = { ...prev, [name]: value };
      // Ensure end date is not earlier than start date
      if (name === "startDate" && prev.endDate && new Date(value) > new Date(prev.endDate)) {
        nextForm.endDate = value;
      }
      return nextForm;
    });
  };

  const calculateTotalDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = end.getTime() - start.getTime();

    if (diffTime < 0) return 0;

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return formData.dayType === "half" ? diffDays * 0.5 : diffDays;
  };

  const totalDays = calculateTotalDays();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const duration = `${totalDays} ${totalDays === 1 ? "day" : "days"}`;

    const dateRange =
      formData.startDate === formData.endDate
        ? formatDate(startDate)
        : `${formatDate(startDate)} – ${formatDate(endDate)}`;

    const leaveData = {
      id: selectedLeave ? selectedLeave.id : Date.now(),
      leaveType: formData.leaveType,
      category: LEAVE_CATEGORY_BY_TYPE[formData.leaveType] || "",
      duration,
      dateRange,
      startDate: formData.startDate,
      endDate: formData.endDate,
      dayType: formData.dayType,
      reason: formData.reason,
      appliedOn: selectedLeave ? selectedLeave.appliedOn : formatDate(new Date()),
      status: selectedLeave ? selectedLeave.status : "Pending",
    };

    setLeaves((prev) =>
      selectedLeave
        ? prev.map((leave) => (leave.id === selectedLeave.id ? leaveData : leave))
        : [leaveData, ...prev]
    );

    handleModalClose();
  };

  // --- Filtering & Pagination ---
  const leavesInSelectedFY = useMemo(() => {
    const range = getFinancialYearRange(filterValues.financialYear);
    if (!range) return leaves;

    return leaves.filter(
      (leave) => leave.startDate >= range.start && leave.startDate <= range.end
    );
  }, [leaves, filterValues.financialYear]);

  const filteredLeaves = useMemo(() => {
    const search = filterValues.search.toLowerCase();

    return leavesInSelectedFY.filter((leave) => {
      const matchesSearch =
        !search ||
        leave.reason.toLowerCase().includes(search) ||
        leave.dateRange.toLowerCase().includes(search) ||
        leave.leaveType.toLowerCase().includes(search);

      const matchesLeaveType =
        !filterValues.leaveType || leave.leaveType === filterValues.leaveType;

      const matchesStatus = !filterValues.status || leave.status === filterValues.status;

      return matchesSearch && matchesLeaveType && matchesStatus;
    });
  }, [leavesInSelectedFY, filterValues.search, filterValues.leaveType, filterValues.status]);

  const paginatedLeaves = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return filteredLeaves.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredLeaves, page]);

  const totalPages = Math.max(1, Math.ceil(filteredLeaves.length / PAGE_SIZE));

  const pendingRequests = useMemo(
    () => leavesInSelectedFY.filter((l) => l.status === "Pending").length,
    [leavesInSelectedFY]
  );

  const consumedLeaves = useMemo(
    () =>
      leavesInSelectedFY
        .filter((l) => l.status === "Approved")
        .reduce((total, l) => {
          const days = parseFloat(l.duration);
          return total + (Number.isNaN(days) ? 0 : days);
        }, 0),
    [leavesInSelectedFY]
  );

  const availableBalance = Math.max(TOTAL_LEAVE_QUOTA - consumedLeaves, 0);

  const columns = useMemo(
    () => [
      {
        key: "leaveType",
        header: "LEAVE TYPE",
        render: (row) => (
          <div className="leave-type-cell">
            <div className="leave-icon-badge">
              <FiCalendar />
            </div>
            <div>
              <div className="leave-title">{row.leaveType}</div>
              <div className="leave-subtext">{row.category}</div>
            </div>
          </div>
        ),
      },
      {
        key: "duration",
        header: "DURATION",
        render: (row) => <span className="text-bold">{row.duration}</span>,
      },
      {
        key: "dateRange",
        header: "DATE RANGE",
        render: (row) => <span className="text-bold">{row.dateRange}</span>,
      },
      {
        key: "reason",
        header: "REASON / NOTES",
        render: (row) => <span className="text-muted">{row.reason}</span>,
      },
      {
        key: "appliedOn",
        header: "APPLIED ON",
        render: (row) => <span className="text-muted">{row.appliedOn}</span>,
      },
      {
        key: "status",
        header: "STATUS",
        render: (row) => (
          <Badge variant={getBadgeVariant(row.status)}>
            <span className="status-dot">●</span> {row.status}
          </Badge>
        ),
      },
      {
        key: "actions",
        header: "ACTIONS",
        render: (row) => (
          <button
            type="button"
            className="action-view-btn"
            aria-label="Edit leave"
            onClick={() => handleOpenEdit(row)}
          >
            <FiEdit2 />
          </button>
        ),
      },
    ],
    []
  );

  const filterConfig = useMemo(
    () => [
      { type: "search", name: "search", placeholder: "Search leave reason or date..." },
      {
        type: "select",
        name: "leaveType",
        placeholder: "All Leave Types",
        options: [
          { label: "Optional Holidays", value: "Optional Holidays" },
          { label: "Sick Leave", value: "Sick Leave" },
          { label: "Casual Leave", value: "Casual Leave" },
        ],
      },
      {
        type: "select",
        name: "status",
        placeholder: "All Status",
        options: [
          { label: "Pending", value: "Pending" },
          { label: "Approved", value: "Approved" },
          { label: "Rejected", value: "Rejected" },
        ],
      },
      {
        type: "select",
        name: "financialYear",
        placeholder: "Select FY",
        options: financialYearOptions,
      },
    ],
    [financialYearOptions]
  );

  return (
    <div className="department-management">
      <div className="department-content-header">
        <div>
          <h1>My Leaves</h1>
          <p>Track your leave history and submit new leave requests.</p>
        </div>

        <Button icon={FiPlus} onClick={handleOpenAdd}>
          Apply Leave
        </Button>
      </div>

      <div className="leaves-stats-grid">
        <StatCard title="TOTAL LEAVES" value={TOTAL_LEAVE_QUOTA} icon={FiCalendar} />
        <StatCard title="AVAILABLE LEAVES" value={availableBalance} icon={FiClock} />
        <StatCard title="PENDING REQUESTS" value={pendingRequests} icon={FiCheckCircle} />
        <StatCard title="CONSUMED LEAVES" value={consumedLeaves} icon={FiXCircle} />
      </div>

      <div className="leaves-table-card">
        <TableToolbar
          filters={filterConfig}
          values={filterValues}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
        />

        <DataTable columns={columns} data={paginatedLeaves} rowKey="id" />

        <TablePagination
          page={page}
          totalPages={totalPages}
          totalRecords={filteredLeaves.length}
          pageSize={PAGE_SIZE}
          onPrevious={() => setPage((p) => Math.max(p - 1, 1))}
          onNext={() => setPage((p) => Math.min(p + 1, totalPages))}
        />
      </div>

      {/* --- Reusable CommonModal --- */}
      <CommonModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={selectedLeave ? "Edit Leave Request" : "Apply for Leave"}
        subtitle={
          selectedLeave
            ? "Update your existing leave request"
            : "Submit a new leave request for approval"
        }
      >
        <form onSubmit={handleFormSubmit}>
          <div className="d-flex flex-column gap-3">
            {/* Leave Type */}
            <div>
              <label className="form-label fw-semibold small text-secondary mb-1">
                Leave Type <span className="text-danger">*</span>
              </label>

              <select
                className="form-select shadow-none"
                name="leaveType"
                value={formData.leaveType}
                onChange={handleFormChange}
                required
              >
                {LEAVE_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dates */}
            <div className="row g-3">
              <div className="col-12 col-sm-6">
                <label className="form-label fw-semibold small text-secondary mb-1">
                  Start Date <span className="text-danger">*</span>
                </label>

                <div className="position-relative">
                  <FiCalendar className="date-icon" />
                  <input
                    type="date"
                    className="form-control ps-5 shadow-none"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <label className="form-label fw-semibold small text-secondary mb-1">
                  End Date <span className="text-danger">*</span>
                </label>

                <div className="position-relative">
                  <FiCalendar className="date-icon" />
                  <input
                    type="date"
                    className="form-control ps-5 shadow-none"
                    min={formData.startDate}
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Day Type */}
            <div className="bg-light border rounded p-2 px-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div className="d-flex gap-3">
                <div className="form-check mb-0">
                  <input
                    className="form-check-input shadow-none"
                    type="radio"
                    name="dayType"
                    id="fullDay"
                    value="full"
                    checked={formData.dayType === "full"}
                    onChange={handleFormChange}
                  />
                  <label
                    className="form-check-label small fw-medium text-secondary"
                    htmlFor="fullDay"
                  >
                    Full Day
                  </label>
                </div>

                <div className="form-check mb-0">
                  <input
                    className="form-check-input shadow-none"
                    type="radio"
                    name="dayType"
                    id="halfDay"
                    value="half"
                    checked={formData.dayType === "half"}
                    onChange={handleFormChange}
                  />
                  <label
                    className="form-check-label small fw-medium text-secondary"
                    htmlFor="halfDay"
                  >
                    Half Day
                  </label>
                </div>
              </div>

              <span className="badge bg-primary-subtle text-primary fw-semibold px-2 py-1">
                Total: {totalDays}{" "}
                {totalDays === 1 ? "Working Day" : "Working Days"}
              </span>
            </div>

            {/* Reason */}
            <div>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label fw-semibold small text-secondary mb-0">
                  Reason for Leave <span className="text-danger">*</span>
                </label>

                <span className="text-muted fs-xs">
                  {formData.reason.length} / 300
                </span>
              </div>

              <textarea
                className="form-control shadow-none"
                rows={3}
                name="reason"
                placeholder="Enter details regarding your leave request..."
                value={formData.reason}
                onChange={handleFormChange}
                required
              />
            </div>
          </div>

          <div className="pt-3 d-flex justify-content-end gap-2">
            <Button type="button" variant="secondary" onClick={handleModalClose}>
              Cancel
            </Button>

            <Button type="submit" variant="primary" icon={FiCheck}>
              {selectedLeave ? "Update Request" : "Submit Request"}
            </Button>
          </div>
        </form>
      </CommonModal>
    </div>
  );
};

export default EmployeeLeaves;