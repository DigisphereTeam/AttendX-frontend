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

import "./EmployeeLeaves.css";

const PAGE_SIZE = 10;

const MOCK_HR_LEAVES = [
  {
    id: 1,
    employeeName: "Karthik Iyer",
    employeeCode: "ENG-4028",
    department: "Engineering",
    leaveType: "Sick Leave",
    duration: "2 days",
    dateRange: "Sep 8 – Sep 9, 2026",
    startDate: "2026-09-08",
    endDate: "2026-09-09",
    reason: "Viral fever & medical rest",
    appliedOn: "Sep 07, 2026",
    status: "Pending",
  },
  {
    id: 2,
    employeeName: "Divya Menon",
    employeeCode: "DES-1092",
    department: "Design Ops",
    leaveType: "Casual Leave",
    duration: "1 day",
    dateRange: "Sep 10, 2026",
    startDate: "2026-09-10",
    endDate: "2026-09-10",
    reason: "Personal work",
    appliedOn: "Sep 08, 2026",
    status: "Pending",
  },
  {
    id: 3,
    employeeName: "Priya Nair",
    employeeCode: "FIN-2104",
    department: "Finance",
    leaveType: "Earned Leave",
    duration: "3 days",
    dateRange: "Sep 15 – Sep 17, 2026",
    startDate: "2026-09-15",
    endDate: "2026-09-17",
    reason: "Family event",
    appliedOn: "Sep 05, 2026",
    status: "Rejected",
  },
  {
    id: 4,
    employeeName: "Vikram Sen",
    employeeCode: "OPS-8901",
    department: "Operations",
    leaveType: "Casual Leave",
    duration: "1 day",
    dateRange: "Sep 2, 2026",
    startDate: "2026-09-02",
    endDate: "2026-09-02",
    reason: "Medical appointment",
    appliedOn: "Aug 30, 2026",
    status: "Approved",
  },
  {
    id: 5,
    employeeName: "Anita Rao",
    employeeCode: "HR-0034",
    department: "Human Capital",
    leaveType: "Sick Leave",
    duration: "2 days",
    dateRange: "Aug 28 – Aug 29, 2026",
    startDate: "2026-08-28",
    endDate: "2026-08-29",
    reason: "Severe migraine",
    appliedOn: "Aug 27, 2026",
    status: "Approved",
  },
];

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
  const [leaves, setLeaves] = useState(MOCK_HR_LEAVES);

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

  // --- Actions for HR: Approve or Reject ---
  const handleApprove = (id) => {
    setLeaves((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Approved" } : item))
    );
  };

  const handleReject = (id) => {
    setLeaves((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Rejected" } : item))
    );
  };

  // --- Data Computation ---
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
        leave.employeeName.toLowerCase().includes(search) ||
        leave.employeeCode.toLowerCase().includes(search) ||
        leave.department.toLowerCase().includes(search) ||
        leave.leaveType.toLowerCase().includes(search);

      const matchesLeaveType =
        !filterValues.leaveType || leave.leaveType === filterValues.leaveType;

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

  // --- HR Dashboard Stat Calculations ---
  const totalRequests = leavesInSelectedFY.length;
  const pendingApprovals = leavesInSelectedFY.filter(
    (l) => l.status === "Pending"
  ).length;
  const approvedLeaves = leavesInSelectedFY.filter(
    (l) => l.status === "Approved"
  ).length;
  const rejectedLeaves = leavesInSelectedFY.filter(
    (l) => l.status === "Rejected"
  ).length;

  // --- Table Columns ---
  const columns = [
    {
      key: "employee",
      header: "EMPLOYEE",
      render: (row) => (
        <div>
          <div className="leave-title">{row.employeeName}</div>
          <div className="leave-subtext">
            {row.employeeCode} · {row.department}
          </div>
        </div>
      ),
    },
    {
      key: "leaveType",
      header: "LEAVE TYPE",
      render: (row) => <span className="text-bold">{row.leaveType}</span>,
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
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button
            type="button"
            className="action-view-btn"
            style={{ color: "#16a34a" }}
            aria-label="Approve leave"
            title="Approve"
            onClick={() => handleApprove(row.id)}
          >
            <FiCheck />
          </button>
          <button
            type="button"
            className="action-view-btn"
            style={{ color: "#dc2626" }}
            aria-label="Reject leave"
            title="Reject"
            onClick={() => handleReject(row.id)}
          >
            <FiX />
          </button>
        </div>
      ),
    },
  ];

  // --- Toolbar Filter Config ---
  const filterConfig = [
    {
      type: "search",
      name: "search",
      placeholder: "Search by employee name...",
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
  ];

  return (
    <div className="department-management">
      <div className="department-content-header">
        <div>
          <h1>Leave Management</h1>
          <p>Review, approve, and track employee leave requests.</p>
        </div>
      </div>

      <div className="leaves-stats-grid">
        <StatCard title="TOTAL REQUESTS" value={totalRequests} icon={FiCalendar} />
        <StatCard title="PENDING APPROVALS" value={pendingApprovals} icon={FiClock} />
        <StatCard title="APPROVED LEAVES" value={approvedLeaves} icon={FiCheckCircle} />
        <StatCard title="REJECTED LEAVES" value={rejectedLeaves} icon={FiXCircle} />
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
    </div>
  );
};

export default LeaveManagement;