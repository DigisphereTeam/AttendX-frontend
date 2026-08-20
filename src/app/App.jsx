import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import DepartmentManagement from "../features/departments/pages/DepartmentManagement";
import DepartmentEmployees from "../features/departments/pages/DepartmentEmployees";
import EmployeeManagement from "../features/employees/pages/EmployeeManagement";
import EmployeeDetails from "../features/employees/pages/EmployeeDetails";
import BiometricEnrollment from "../features/biometric/BiometricEnrollment";
import AttendancePunch from "../features/biometric/AttendancePunch";
import AttendanceHistory from "../features/biometric/AttendanceHistory";
import Dashboard from "../features/dashboard/pages/Dashboard";

const ReportsPage = () => {
  return <h2>Reports</h2>;
};

const App = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/employees" element={<EmployeeManagement />} />

        <Route path="/departments" element={<DepartmentManagement />} />

        <Route path="/departments/:departmentId/employees" element={<DepartmentEmployees />} />

        <Route path="/employees" element={<EmployeeManagement />} />
        <Route path="/employees/:id" element={<EmployeeDetails />} />

        <Route path="/biometrics" element={<BiometricEnrollment/>} />

        <Route path="/attendance" element={<AttendancePunch />} />

        <Route path="/attendance/history" element={<AttendanceHistory />} />

        <Route path="/reports" element={<ReportsPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
