import { useState, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import Avatar from "../../../components/Avatar/Avatar";
import Badge from "../../../components/Badge/Badge";
import StatCard from "../../../components/StatCard/StatCard";
import DataTable from "../../../components/DataTable/DataTable";
import TablePagination from "../../../components/TablePagination/TablePagination";
import { useEmployees, useEmployeeAttendance } from "../api/employeeApi";

const PAGE_SIZE = 5;

const EmployeeDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);

  // 1. Fetch data
  const { data: employeesData, isLoading: isEmployeeLoading } = useEmployees();
  const { data: attendanceData, isLoading: isAttendanceLoading } = useEmployeeAttendance(id);

  const {
    employeeName: attendanceEmpName,
    employeeId: attendanceEmpId,
    summary = { present: 0, late: 0, absent: 0 },
    attendanceList = [],
  } = attendanceData || {};

 // Clean, minimal resolution logic
const employee = useMemo(() => {
  const cleanId = String(id).replace(/^EMP-/i, "").trim();

  // 1. Search inside employees API response (already mapped by select)
  const foundEmp = employeesData?.employees?.find(
    (emp) =>
      String(emp.id) === cleanId ||
      String(emp.employeeId).toUpperCase() === String(id).toUpperCase()
  );

  if (foundEmp) return foundEmp;

  // 2. Fallback to route state if user navigated directly with state
  if (location.state?.selectedEmployee) {
    return location.state.selectedEmployee;
  }

  // 3. Last fallback: basic object from Attendance API
  if (attendanceEmpName || attendanceEmpId) {
    return {
      name: attendanceEmpName,
      employeeId: attendanceEmpId ? `EMP-${attendanceEmpId}` : `EMP-${id}`,
      designation: "N/A",
      departmentName: "Unassigned",
      phone: "N/A",
      status: "Active",
      fingerprintRegistered: false,
    };
  }

  return null;
}, [employeesData, id, location.state, attendanceEmpName, attendanceEmpId]);

  // Extract variables with defaults for clean JSX
  const {
  name = "N/A",
  employeeId: displayId = id ? `EMP-${id}` : "N/A",
  designation = "N/A",
  departmentName = "Unassigned",
  phone = "N/A",
  status = "Active",
  fingerprintRegistered = false,
} = employee || {};

  // Table Columns
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

  // Pagination Logic
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
          {name} ({displayId})
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
            <Avatar name={name} size="large" />
            <h4 className="fw-bold mt-3 mb-1 text-dark">{name}</h4>
            <p className="text-muted small mb-3">{designation}</p>
            <Badge variant="info">{departmentName}</Badge>

            <div className="w-100 border-top mt-4 pt-3 text-start">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted small">Employee ID</span>
                <span className="fw-bold text-dark">{displayId}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted small">Phone</span>
                <span className="fw-bold text-dark">{phone}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted small">Status</span>
                <Badge variant={status === "Active" ? "success" : "danger"}>
                  {status}
                </Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted small">Fingerprint</span>
                <Badge variant={fingerprintRegistered ? "info" : "default"}>
                  {fingerprintRegistered ? "Registered" : "Not Registered"}
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