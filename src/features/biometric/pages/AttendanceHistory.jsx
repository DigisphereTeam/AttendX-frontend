import { useState, useMemo, useCallback } from "react";
import Avatar from "../../../components/Avatar/Avatar";
import Badge from "../../../components/Badge/Badge";
import TableToolbar from "../../../components/TableToolbar/TableToolbar";
import DataTable from "../../../components/DataTable/DataTable";
import TablePagination from "../../../components/TablePagination/TablePagination";
import { useAttendanceHistory } from "../api/biometricApi";

export default function AttendanceHistory({ departments = [] }) {
  const [filterValues, setFilterValues] = useState({
    search: "",
    dept: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch API history data (search will map directly to ?search= in backend)
  const { data: historyList = [], isLoading } = useAttendanceHistory(filterValues);

  const handleFilterChange = useCallback((name, value) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilterValues({
      search: "",
      dept: "",
      status: "",
      startDate: "",
      endDate: "",
    });
    setCurrentPage(1);
  }, []);

  const filterConfig = useMemo(
    () => [
      {
        name: "search",
        type: "search",
        placeholder: "Search employee...",
      },
      {
        name: "dept",
        type: "select",
        placeholder: "All Departments",
        options: departments.map((d) => ({
          label: d.name || d.department_name,
          value: d.name || d.department_name,
        })),
      },
      {
        name: "status",
        type: "select",
        placeholder: "All Status",
        options: [
          { label: "Present", value: "Present" },
          { label: "Late", value: "Late" },
          { label: "Absent", value: "Absent" },
        ],
      },
      {
        name: "startDate",
        type: "date",
      },
      {
        name: "endDate",
        type: "date",
      },
    ],
    [departments]
  );

  const totalRecords = historyList.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return historyList.slice(start, start + pageSize);
  }, [historyList, currentPage, pageSize]);

  const columns = useMemo(
    () => [
      { key: "date", header: "DATE" },
      {
        key: "empName",
        header: "EMPLOYEE",
        render: (row) => (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Avatar name={row.empName} size="small" />
            <span style={{ fontWeight: 500, color: "#101828" }}>
              {row.empName}
            </span>
          </div>
        ),
      },
      {
        key: "dept",
        header: "DEPARTMENT",
        render: (row) => <Badge variant="info">{row.dept}</Badge>,
      },
      {
        key: "punchIn",
        header: "PUNCH IN",
        render: (row) => row.punchIn || "—",
      },
      {
        key: "punchOut",
        header: "PUNCH OUT",
        render: (row) => row.punchOut || "—",
      },
      {
        key: "workingHours",
        header: "WORKING HRS",
        render: (row) => row.workingHours || "—",
      },
      {
        key: "status",
        header: "STATUS",
        render: (row) => {
          let variant = "success";
          if (row.status === "Late") variant = "warning";
          if (row.status === "Absent") variant = "danger";

          return <Badge variant={variant}>{row.status}</Badge>;
        },
      },
    ],
    []
  );

  return (
    <div className="attendance-history-card">
      <div className="department-content-header">
        <div>
          <h1>Attendance History</h1>
          <p>Employee-wise and department-wise attendance records</p>
        </div>
      </div>

      <TableToolbar
        filters={filterConfig}
        values={filterValues}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {isLoading ? (
        <div className="text-center py-5 text-muted">
          <div className="spinner-border text-primary me-2" role="status" />
          Loading attendance history...
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={paginatedData}
            rowKey="id"
            emptyMessage="No attendance records found matching your query."
          />

          {totalRecords > 0 && (
            <TablePagination
              page={currentPage}
              totalPages={totalPages}
              totalRecords={totalRecords}
              pageSize={pageSize}
              onPrevious={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            />
          )}
        </>
      )}
    </div>
  );
}