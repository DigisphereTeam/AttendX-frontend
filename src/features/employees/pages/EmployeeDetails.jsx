import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

// Import your exact reusable components
import Avatar from "../../../components/Avatar/Avatar";
import Badge from "../../../components/Badge/Badge";
import StatCard from "../../../components/StatCard/StatCard";
import DataTable from "../../../components/DataTable/DataTable";

// Import mock data source
import { employees as mockEmployees } from "../data/employeeData";

const MOCK_ATTENDANCE_HISTORY = [
  { id: 1, date: "2026-08-18", punchIn: "9:47 AM", punchOut: "5:00 PM", hrs: "7.2", status: "Present" },
  { id: 2, date: "2026-08-17", punchIn: "10:34 AM", punchOut: "6:51 PM", hrs: "8.3", status: "Late" },
  { id: 3, date: "2026-08-14", punchIn: "9:09 AM", punchOut: "5:03 PM", hrs: "7.9", status: "Present" },
  { id: 4, date: "2026-08-13", punchIn: "9:41 AM", punchOut: "5:07 PM", hrs: "7.4", status: "Present" },
  { id: 5, date: "2026-08-12", punchIn: "10:24 AM", punchOut: "5:52 PM", hrs: "7.5", status: "Late" },
  { id: 6, date: "2026-08-11", punchIn: "9:54 AM", punchOut: "6:22 PM", hrs: "8.5", status: "Present" },
];

const EmployeeDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve selected employee from state or fallback search
  const employee = useMemo(() => {
    if (location.state?.selectedEmployee) {
      return location.state.selectedEmployee;
    }
    return mockEmployees?.find((emp) => String(emp.id) === String(id)) || {
      name: "Rahul Sharma",
      employeeId: "EMP-1001",
      designation: "Senior Software Engineer",
      department: "Engineering",
      phone: "9876543210",
      status: "Active",
      fingerprintRegistered: true,
    };
  }, [location.state, id]);

  // Attendance History Table Column Specs
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

  if (!employee) {
    return (
      <div className="p-4 text-center">
        <h5>Employee not found</h5>
        <button
          type="button"
          className="btn btn-primary mt-2"
          onClick={() => navigate("/employees")}
        >
          Return to Employee List
        </button>
      </div>
    );
  }

  return (
    <div className="employee-details-container p-4 bg-light min-vh-100">
      {/* Top Header replacing Select Dropdown with Direct Name and ID */}
      <div className="department-employees-header mb-4">
        <h1 >
          {employee.name} ({employee.employeeId})
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
        {/* Left Section: Exact Profile Card Matching UI */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 rounded-4 p-4 shadow-sm align-items-center text-center bg-white">
            {/* Avatar Component */}
            <Avatar name={employee.name} size="large" />

            {/* Name and Designation */}
            <h4 className="fw-bold mt-3 mb-1 text-dark">{employee.name}</h4>
            <p className="text-muted small mb-3">{employee.designation}</p>

            {/* Department Badge */}
            <Badge variant="info">{employee.department}</Badge>

            {/* Divider Line */}
            <div className="w-100 border-top mt-4 pt-3 text-start">
              {/* Employee ID */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted small">Employee ID</span>
                <span className="fw-bold text-dark">{employee.employeeId}</span>
              </div>

              {/* Phone */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted small">Phone</span>
                <span className="fw-bold text-dark">{employee.phone}</span>
              </div>

              {/* Status Badge */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted small">Status</span>
                <Badge variant={employee.status === "Active" ? "success" : "danger"}>
                  {employee.status}
                </Badge>
              </div>

              {/* Fingerprint Status Badge */}
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted small">Fingerprint</span>
                <Badge variant={employee.fingerprintRegistered ? "info" : "default"}>
                  {employee.fingerprintRegistered ? "Registered" : "Not Registered"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Stat Cards and Attendance History */}
        <div className="col-12 col-lg-8 d-flex flex-column gap-4">
          {/* Stat Cards Grid using StatCard Component */}
          <div className="row g-3">
            <div className="col-4">
              <StatCard title="Present" value="8" />
            </div>
            <div className="col-4">
              <StatCard title="Late" value="2" />
            </div>
            <div className="col-4">
              <StatCard title="Absent" value="0" />
            </div>
          </div>

          {/* Attendance History Card using DataTable Component */}
          <div className="card border-0 rounded-4 p-4 shadow-sm bg-white">
            <h5 className="fw-bold text-dark mb-3">Attendance History</h5>
            <DataTable
              columns={attendanceColumns}
              data={MOCK_ATTENDANCE_HISTORY}
              rowKey="id"
              emptyMessage="No attendance history found."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;