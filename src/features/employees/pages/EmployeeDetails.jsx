import { useState, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import Avatar from "../../../components/Avatar/Avatar";
import Badge from "../../../components/Badge/Badge";
import StatCard from "../../../components/StatCard/StatCard";
import DataTable from "../../../components/DataTable/DataTable";
import TablePagination from "../../../components/TablePagination/TablePagination";
import { useEmployees, useEmployeeAttendance } from "../api/employeeApi"; // Check path

const PAGE_SIZE = 5;

const EmployeeDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);

  // 1. Fetch full employee profile list
  const { data: employeesData, isLoading: isEmployeeLoading } = useEmployees();

  // 2. Fetch monthly attendance
  const { data: attendanceData, isLoading: isAttendanceLoading } = useEmployeeAttendance(id);

  const {
    employeeName: attendanceEmpName,
    employeeId: attendanceEmpId,
    summary = { present: 0, late: 0, absent: 0 },
    attendanceList = [],
  } = attendanceData || {};

  // 3. Robust Employee Data Fallback Chain
  const employee = useMemo(() => {
    // Route State First
    if (location.state?.selectedEmployee) {
      return location.state.selectedEmployee;
    }

    // Search inside employees API response (with Type Coercion)
    const foundEmp = employeesData?.employees?.find(
      (emp) => String(emp.id) === String(id) || String(emp.employeeId) === `EMP-${id}`
    );

    if (foundEmp) return foundEmp;

    // Direct Attendance API response fallback
    if (attendanceEmpName || attendanceEmpId) {
      return {
        name: attendanceEmpName || "N/A",
        employeeId: attendanceEmpId ? `EMP-${attendanceEmpId}` : `EMP-${id}`,
        designation: "N/A",
        departmentName: "Unassigned",
        phone: "N/A",
        status: "Active",
        fingerprintRegistered: false,
      };
    }

    return null;
  }, [location.state, employeesData, id, attendanceEmpName, attendanceEmpId]);

  const attendanceColumns = useMemo(
    () => [
      { key: "date", header: "DATE" },
      { key: "punchIn", header: "PUNCH IN" },
      { key: "punchOut", header: "PUNCH OUT" },
      { key: "hrs", header: "HRS" },
      {
        key: "status",
        header: "STATUS",
        render: (row) => {
          const variant =
            row.status === "Present"
              ? "success"
              : row.status === "Late"
              ? "warning"
              : "danger";
          return <Badge variant={variant}>{row.status}</Badge>;
        },
      },
    ],
    []
  );

  const totalRecords = attendanceList.length;
  const totalPages = Math.ceil(totalRecords / PAGE_SIZE) || 1;

  const paginatedAttendanceHistory = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return attendanceList.slice(startIndex, startIndex + PAGE_SIZE);
  }, [attendanceList, currentPage]);

  if (isEmployeeLoading && isAttendanceLoading) {
    return (
      <div className="p-5 text-center bg-light min-vh-100">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-2 text-muted">Loading details...</p>
      </div>
    );
  }

  return (
    <div className="employee-details-container p-4 bg-light min-vh-100">
      {/* Top Header */}
      <div className="department-employees-header mb-4">
        <h1>
          {employee?.name || attendanceEmpName || "Employee"} (
          {employee?.employeeId || (id ? `EMP-${id}` : "")})
        </h1>
        <button
          type="button"
          className="department-back-button"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft />
          Back to Departments
        </button>
      </div>

      <div className="row g-4">
        {/* Left Section: Profile Card */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 rounded-4 p-4 shadow-sm align-items-center text-center bg-white">
            <Avatar name={employee?.name || attendanceEmpName || "User"} size="large" />
            <h4 className="fw-bold mt-3 mb-1 text-dark">
              {employee?.name || attendanceEmpName || "N/A"}
            </h4>
            <p className="text-muted small mb-3">{employee?.designation || "N/A"}</p>
            <Badge variant="info">
              {employee?.departmentName || employee?.department || "Unassigned"}
            </Badge>

            <div className="w-100 border-top mt-4 pt-3 text-start">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted small">Employee ID</span>
                <span className="fw-bold text-dark">
                  {employee?.employeeId || (id ? `EMP-${id}` : "N/A")}
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted small">Phone</span>
                <span className="fw-bold text-dark">{employee?.phone || "N/A"}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted small">Status</span>
                <Badge variant={employee?.status === "Active" ? "success" : "danger"}>
                  {employee?.status || "Active"}
                </Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted small">Fingerprint</span>
                <Badge variant={employee?.fingerprintRegistered ? "info" : "default"}>
                  {employee?.fingerprintRegistered ? "Registered" : "Not Registered"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Stat Cards and Table */}
        <div className="col-12 col-lg-8 d-flex flex-column gap-4">
          <div className="row g-3">
            <div className="col-4">
              <StatCard title="Present" value={String(summary.present ?? 0)} />
            </div>
            <div className="col-4">
              <StatCard title="Late" value={String(summary.late ?? 0)} />
            </div>
            <div className="col-4">
              <StatCard title="Absent" value={String(summary.absent ?? 0)} />
            </div>
          </div>

          <div className="card border-0 rounded-4 p-4 shadow-sm bg-white overflow-hidden">
            <h5 className="fw-bold text-dark mb-3">Attendance History</h5>
            {isAttendanceLoading ? (
              <div className="text-center py-4 text-muted">Loading attendance...</div>
            ) : (
              <>
                <DataTable
                  columns={attendanceColumns}
                  data={paginatedAttendanceHistory}
                  rowKey="id"
                  emptyMessage="No attendance history found."
                />
                <TablePagination
                  page={currentPage}
                  totalPages={totalPages}
                  totalRecords={totalRecords}
                  pageSize={PAGE_SIZE}
                  onPrevious={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;