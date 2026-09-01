import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import DepartmentManagement from "../features/departments/pages/DepartmentManagement";
import DepartmentEmployees from "../features/departments/pages/DepartmentEmployees";
import EmployeeManagement from "../features/employees/pages/EmployeeManagement";
import EmployeeDetails from "../features/employees/pages/EmployeeDetails";
import BiometricEnrollment from "../features/biometric/pages/BiometricEnrollment";
import AttendanceHistory from "../features/biometric/pages/AttendanceHistory";
import Dashboard from "../features/dashboard/pages/Dashboard";
import Reports from "../features/reports/pages/Reports";
import Login from "../features/auth/pages/Login";
import ProtectedRoute from "./ProtectedRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route element={<ProtectedRoute/>}>
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/employees" element={<EmployeeManagement />} />

        <Route path="/departments" element={<DepartmentManagement />} />

        <Route path="/departments/:departmentId/employees" element={<DepartmentEmployees />} />

        <Route path="/employees" element={<EmployeeManagement />} />
        <Route path="/employees/:id" element={<EmployeeDetails />} />

        <Route path="/biometrics" element={<BiometricEnrollment/>} />

        <Route path="/attendance/history" element={<AttendanceHistory />} />

        <Route path="/reports" element={<Reports/>} />
      </Route>
      </Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
