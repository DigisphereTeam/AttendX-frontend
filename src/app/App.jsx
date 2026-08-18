import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import DepartmentManagement from "../features/departments/pages/DepartmentManagement";


const DashboardPage = () => {
  return <h2>Dashboard</h2>;
};

const EmployeesPage = () => {
  return <h2>Employees</h2>;
};

const BiometricsPage = () => {
  return <h2>Biometrics</h2>;
};

const AttendancePage = () => {
  return <h2>Attendance</h2>;
};

const AttendanceHistoryPage = () => {
  return <h2>Attendance History</h2>;
};

const ReportsPage = () => {
  return <h2>Reports</h2>;
};

const App = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="/employees"
          element={<EmployeesPage />}
        />

        <Route
          path="/departments"
          element={<DepartmentManagement />}
        />

        <Route
          path="/employees/profile"
          element={<EmployeesPage />}
        />

        <Route
          path="/biometrics"
          element={<BiometricsPage />}
        />

        <Route
          path="/attendance"
          element={<AttendancePage />}
        />

        <Route
          path="/attendance/history"
          element={<AttendanceHistoryPage />}
        />

        <Route
          path="/reports"
          element={<ReportsPage />}
        />
      </Route>

      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
};

export default App;