import { useState, useMemo } from "react";
import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiCheck,
  FiX,
} from "react-icons/fi";

import StatCard from "../../../components/StatCard/StatCard";
import TableToolbar from "../../../components/TableToolbar/TableToolbar";
import DataTable from "../../../components/DataTable/DataTable";
import Badge from "../../../components/Badge/Badge";
import TablePagination from "../../../components/TablePagination/TablePagination";

import {
  getCurrentFinancialYear,
  generateFinancialYears,
  getFinancialYearRange,
} from "../../../utils/financialYear";

import { useAllLeaves, useUpdateLeaveStatus } from "../api/leaveApi";

import "./EmployeeLeaves.css";

const PAGE_SIZE = 10;

const formatDateRange = (fromDate, toDate) => {
  if (!fromDate || !toDate) return "N/A";
  const start = new Date(fromDate).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });
  const end = new Date(toDate).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  return `${start} – ${end}`;
};

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

const LeaveManagement = () => {
  const { data: apiResponse, isLoading } = useAllLeaves();
  const updateLeaveStatusMutation = useUpdateLeaveStatus();

  const rawLeaves = apiResponse?.leaves || [];
  const dashboardStats = apiResponse?.dashboard || {};

  // --- Financial Year & Filter State ---
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

  // --- Actions for Admin: Approve or Reject ---
  const handleApprove = (leave) => {
    const leaveId = leave.leave_id || leave.id || leave._id;
    updateLeaveStatusMutation.mutate({
      leave_id: leaveId,
      leaveId: leaveId,
      status: "Approved",
    });
  };

  const handleReject = (leave) => {
    const leaveId = leave.leave_id || leave.id || leave._id;
    updateLeaveStatusMutation.mutate({
      leave_id: leaveId,
      leaveId: leaveId,
      status: "Rejected",
    });
  };

  // --- Data Computation ---
  const leavesInSelectedFY = useMemo(() => {
    const range = getFinancialYearRange(filterValues.financialYear);
    if (!range) return rawLeaves;

    return rawLeaves.filter((leave) => {
      const leaveStartDate = leave.from_date ? leave.from_date.split("T")[0] : "";
      return leaveStartDate >= range.start && leaveStartDate <= range.end;
    });
  }, [rawLeaves, filterValues.financialYear]);

  const filteredLeaves = useMemo(() => {
    const search = filterValues.search.toLowerCase();

    return leavesInSelectedFY.filter((leave) => {
      const name = leave.employee_name || "";
      const code = leave.emp_code || "";
      const leaveType = leave.leave_type || "";

      const matchesSearch =
        !search ||
        name.toLowerCase().includes(search) ||
        code.toLowerCase().includes(search) ||
        leaveType.toLowerCase().includes(search);

      const matchesLeaveType =
        !filterValues.leaveType || leave.leave_type === filterValues.leaveType;

      const matchesStatus =
        !filterValues.status || leave.status === filterValues.status;

      return matchesSearch && matchesLeaveType && matchesStatus;
    });
  }, [
    leavesInSelectedFY,
    filterValues.search,
    filterValues.leaveType,
    filterValues.status,
  ]);

  const paginatedLeaves = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return filteredLeaves.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredLeaves, page]);

  const totalPages = Math.max(1, Math.ceil(filteredLeaves.length / PAGE_SIZE));

  // --- Table Columns ---
  const columns = useMemo(
    () => [
      {
        key: "employee",
        header: "EMPLOYEE",
        render: (row) => (
          <div>
            <div className="leave-title">{row.employee_name || "N/A"}</div>
            <div className="leave-subtext">
              {row.emp_code ? `Code: ${row.emp_code}` : `ID: ${row.employee_id}`}
            </div>
          </div>
        ),
      },
      {
        key: "leave_type",
        header: "LEAVE TYPE",
        render: (row) => <span className="text-bold">{row.leave_type}</span>,
      },
      {
        key: "duration",
        header: "DURATION",
        render: (row) => (
          <span className="text-bold">
            {row.duration} {Number(row.duration) === 1 ? "day" : "days"}
          </span>
        ),
      },
      {
        key: "dateRange",
        header: "DATE RANGE",
        render: (row) => (
          <span className="text-bold">
            {formatDateRange(row.from_date, row.to_date)}
          </span>
        ),
      },
      {
        key: "description",
        header: "REASON",
        render: (row) => <span className="text-muted">{row.description || "N/A"}</span>,
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
        render: (row) => {
          const isPending = row.status === "Pending";
          const isActionDisabled = updateLeaveStatusMutation.isPending;

          return (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                type="button"
                className="action-view-btn"
                style={{
                  color: isPending ? "#16a34a" : "#cbd5e1",
                  cursor: isPending && !isActionDisabled ? "pointer" : "not-allowed",
                }}
                aria-label="Approve leave"
                title="Approve"
                disabled={!isPending || isActionDisabled}
                onClick={() => handleApprove(row)}
              >
                <FiCheck />
              </button>
              <button
                type="button"
                className="action-view-btn"
                style={{
                  color: isPending ? "#dc2626" : "#cbd5e1",
                  cursor: isPending && !isActionDisabled ? "pointer" : "not-allowed",
                }}
                aria-label="Reject leave"
                title="Reject"
                disabled={!isPending || isActionDisabled}
                onClick={() => handleReject(row)}
              >
                <FiX />
              </button>
            </div>
          );
        },
      },
    ],
    [updateLeaveStatusMutation.isPending]
  );

  // --- Toolbar Filter Config ---
  const filterConfig = useMemo(
    () => [
      {
        type: "search",
        name: "search",
        placeholder: "Search employee name or code...",
      },
      {
        type: "select",
        name: "leaveType",
        placeholder: "All Leave Types",
        options: [
          { label: "Sick Leave", value: "Sick Leave" },
          { label: "Casual Leave", value: "Casual Leave" },
          { label: "Earned Leave", value: "Earned Leave" },
          { label: "Optional Holidays", value: "Optional Holidays" },
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
          <h1>Leave Management</h1>
          <p>Review, approve, and track employee leave requests.</p>
        </div>
      </div>

      <div className="leaves-stats-grid">
        <StatCard
          title="TOTAL REQUESTS"
          value={dashboardStats.total_requests ?? 0}
          icon={FiCalendar}
        />
        <StatCard
          title="PENDING APPROVALS"
          value={dashboardStats.pending_approvals ?? 0}
          icon={FiClock}
        />
        <StatCard
          title="APPROVED LEAVES"
          value={dashboardStats.approved_leaves ?? 0}
          icon={FiCheckCircle}
        />
        <StatCard
          title="REJECTED LEAVES"
          value={dashboardStats.rejected_leaves ?? 0}
          icon={FiXCircle}
        />
      </div>

      <div className="leaves-table-card">
        <TableToolbar
          filters={filterConfig}
          values={filterValues}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
        />

        {isLoading ? (
          <div className="text-center py-5 text-muted">Loading leave requests...</div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={paginatedLeaves}
              rowKey="leave_id"
            />

            <TablePagination
              page={page}
              totalPages={totalPages}
              totalRecords={filteredLeaves.length}
              pageSize={PAGE_SIZE}
              onPrevious={() => setPage((p) => Math.max(p - 1, 1))}
              onNext={() => setPage((p) => Math.min(p + 1, totalPages))}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default LeaveManagement;