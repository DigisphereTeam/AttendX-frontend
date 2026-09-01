import React, { useState, useMemo, useEffect } from "react";
 
import { FiCheckCircle, FiXCircle, FiClock, FiActivity } from "react-icons/fi";
 
import { useReports } from "../api/reportsApi";
 
import StatCard from "../../../components/StatCard/StatCard";
import DataTable from "../../../components/DataTable/DataTable";
import Avatar from "../../../components/Avatar/Avatar";
import Badge from "../../../components/Badge/Badge";
import TableToolbar from "../../../components/TableToolbar/TableToolbar";
import TablePagination from "../../../components/TablePagination/TablePagination";
 
import "./Reports.css";
 
const getCurrentMonth = () => {
  const now = new Date();
 
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
 
  return `${year}-${month}`;
};
 
export default function Reports() {
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
 
  const [currentPage, setCurrentPage] = useState(1);
 
  const pageSize = 5;
 
  const [debouncedSearch, setDebouncedSearch] = useState("");
 
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 400);
 
    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);
 
  const reportParams = useMemo(
    () => ({
      search: debouncedSearch,
      month: selectedMonth,
    }),
    [searchQuery, selectedMonth],
  );
 
  const {
    data: response,
    isLoading,
    isFetching ,
    isError,
    error,
  } = useReports(reportParams);
 
  /*
   * API response:
   *
   * {
   *   statusCode: 200,
   *   data: {
   *     filters: {},
   *     summary: {},
   *     employees: []
   *   }
   * }
   */
  const reportData = response?.data;
 
  const summary = reportData?.summary || {};
 
  const employees = reportData?.employees || [];
 
  /*
   * Reset pagination whenever search/month changes.
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedMonth]);
 
  /*
   * API already returns the required summary values.
   * No frontend calculation is required.
   */
  const stats = {
    present: summary.present || 0,
    absent: summary.absent || 0,
    late: summary.late || 0,
    hours: summary.totalWorkingHours || "0.0",
  };
 
  /*
   * Pagination
   */
  const totalRecords = employees.length;
 
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
 
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
 
    return employees.slice(startIndex, startIndex + pageSize);
  }, [employees, currentPage]);
 
  /*
   * Table columns
   */
  const columns = [
    {
      key: "employeeName",
      header: "EMPLOYEE",
      render: (row) => (
        <div className="employee-info">
          <Avatar name={row.employeeName} size="small" />
          <span>{row.employeeName}</span>
        </div>
      ),
    },
 
    {
      key: "department",
      header: "DEPARTMENT",
      render: (row) => <Badge variant="info">{row.department}</Badge>,
    },
 
    {
      key: "present",
      header: "PRESENT",
    },
 
    {
      key: "late",
      header: "LATE",
    },
 
    {
      key: "absent",
      header: "ABSENT",
    },
 
    {
      key: "hours",
      header: "HRS",
      render: (row) => <strong>{row.hours}</strong>,
    },
  ];
 
  /*
   * Toolbar
   *
   * Search = col-4
   * Month = col-4
   */
  const toolbarFilters = [
    {
      type: "search",
      name: "search",
      placeholder: "Search employee...",
      col: 4,
    },
 
    {
      type: "month",
      name: "month",
      col: 4,
    },
  ];
 
  const toolbarValues = {
    search: searchQuery,
    month: selectedMonth,
  };
 
  /*
   * Toolbar change handler
   */
  const handleToolbarChange = (name, value) => {
    if (name === "search") {
      setSearchQuery(value);
    }
 
    if (name === "month") {
      setSelectedMonth(value);
    }
  };
 
  /*
   * Clear filters
   */
  const handleClearFilters = () => {
    setSearchQuery("");
        setDebouncedSearch("");
    setSelectedMonth("2026-08");
        setSelectedMonth(getCurrentMonth());
  };
 
  /*
   * Initial loading only.
   *
   * IMPORTANT:
   * We do NOT replace the entire page with a loading screen
   * when searching or changing month.
   *
   * This keeps the search input mounted, so cursor/focus
   * does not jump after every API request.
   */
  if (isLoading && !response) {
    return (
      <div className="reports-container">
        <div className="text-center py-5">Loading reports...</div>
      </div>
    );
  }
 
  /*
   * Error state
   */
  if (isError && !response) {
    return (
      <div className="reports-container">
        <div className="text-center py-5">
          Failed to load reports.
          <br />
          {error?.response?.data?.message || "Something went wrong."}
        </div>
      </div>
    );
  }
 
  return (
    <div className="reports-container">
      {/* 1. HEADER & TOGGLE MODE */}
      <div className="reports-header">
        <div>
          <h2>Reports</h2>
          <p className="sub-heading">
            Monthly attendance reports with employee search
          </p>
        </div>
      </div>
 
      {/* 2. TOOLBAR */}
      <div className="toolbar-section">
        <TableToolbar
          filters={toolbarFilters}
          values={toolbarValues}
          onChange={handleToolbarChange}
          onClear={handleClearFilters}
        />
      </div>
 
      {/* Optional small loading indicator.
          The input itself remains mounted. */}
      {isFetching && (
        <div className="reports-loading-indicator">Loading...</div>
      )}
 
      {/* 3. METRICS STAT CARDS */}
      <div className="metrics-grid">
        <StatCard title="Present" value={stats.present} icon={FiCheckCircle} />
 
        <StatCard title="Absent" value={stats.absent} icon={FiXCircle} />
 
        <StatCard title="Late" value={stats.late} icon={FiClock} />
 
        <StatCard
          title="Total Working Hours"
          value={stats.hours}
          icon={FiActivity}
        />
      </div>
 
      {/* 4. PIE CHART & DATA TABLE */}
      <div className="reports-data-grid">
        <div className="table-panel">
          <div className="table-content-area">
            <DataTable
              columns={columns}
              data={paginatedEmployees}
              rowKey="employeeId"
              emptyMessage="No matching records found."
            />
          </div>
          <TablePagination
            page={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            pageSize={pageSize}
            onPrevious={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            onNext={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          />
        </div>
      </div>
    </div>
  );
}
 
 