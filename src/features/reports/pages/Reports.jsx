import React, { useState, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiActivity,
} from "react-icons/fi";

import StatCard from "../../../components/StatCard/StatCard";
import DataTable from "../../../components/DataTable/DataTable";
import Avatar from "../../../components/Avatar/Avatar";
import Badge from "../../../components/Badge/Badge";
import TableToolbar from "../../../components/TableToolbar/TableToolbar";
import TablePagination from "../../../components/TablePagination/TablePagination";

import "./Reports.css";

dayjs.extend(customParseFormat);
ChartJS.register(ArcElement, Tooltip, Legend);

const mockEmployees = [
  { id: 1, name: "Rahul Sharma", empId: "EMP001", dept: "Engineering" },
  { id: 2, name: "Ananya Gupta", empId: "EMP002", dept: "Human Resources" },
  { id: 3, name: "Priya Menon", empId: "EMP003", dept: "Sales & Marketing" },
  { id: 4, name: "Siddharth Verma", empId: "EMP004", dept: "Engineering" },
  { id: 5, name: "Rohan Kulkarni", empId: "EMP005", dept: "Engineering" },
  { id: 6, name: "Neha Kapoor", empId: "EMP006", dept: "Human Resources" },
  { id: 7, name: "Vikram Mehta", empId: "EMP007", dept: "Sales & Marketing" },
  { id: 8, name: "Pooja Hegde", empId: "EMP008", dept: "Engineering" },
  { id: 9, name: "Amitav Ghosh", empId: "EMP009", dept: "Human Resources" },
  { id: 10, name: "Divya Nair", empId: "EMP010", dept: "Sales & Marketing" },
];

const mockDepartments = [
  { id: 101, name: "Engineering" },
  { id: 102, name: "Human Resources" },
  { id: 103, name: "Sales & Marketing" },
];

const mockAttendanceData = [
  { id: 1, empId: 1, date: "2026-08-01", status: "Present", punchIn: "9:00 AM", punchOut: "5:00 PM" },
  { id: 2, empId: 2, date: "2026-08-01", status: "Late", punchIn: "9:45 AM", punchOut: "5:00 PM" },
  { id: 3, empId: 3, date: "2026-08-01", status: "Absent", punchIn: "", punchOut: "" },
  { id: 4, empId: 4, date: "2026-08-01", status: "Present", punchIn: "8:55 AM", punchOut: "5:00 PM" },
  { id: 5, empId: 5, date: "2026-08-01", status: "Present", punchIn: "9:00 AM", punchOut: "5:00 PM" },
  { id: 6, empId: 6, date: "2026-08-01", status: "Late", punchIn: "9:30 AM", punchOut: "5:00 PM" },
  { id: 7, empId: 7, date: "2026-08-01", status: "Absent", punchIn: "", punchOut: "" },
  { id: 8, empId: 8, date: "2026-08-01", status: "Present", punchIn: "9:10 AM", punchOut: "5:15 PM" },
  { id: 9, empId: 9, date: "2026-08-01", status: "Present", punchIn: "8:50 AM", punchOut: "5:00 PM" },
  { id: 10, empId: 10, date: "2026-08-01", status: "Late", punchIn: "9:50 AM", punchOut: "5:30 PM" },
];

const parseDurationInHours = (punchIn, punchOut, dateStr) => {
  if (!punchIn || !punchOut) return 0;
  const baseDate = dateStr || "2026-08-01";
  const inTime = dayjs(`${baseDate} ${punchIn}`, "YYYY-MM-DD h:mm A");
  let outTime = dayjs(`${baseDate} ${punchOut}`, "YYYY-MM-DD h:mm A");

  if (!inTime.isValid() || !outTime.isValid()) return 0;
  
  // Handle overnight shifts where punchOut time occurs after midnight
  if (outTime.isBefore(inTime)) {
    outTime = outTime.add(1, "day");
  }

  const diffMins = outTime.diff(inTime, "minute");
  return Math.max(0, diffMins / 60);
};

export default function Reports({
  attendanceData = mockAttendanceData,
  employees = mockEmployees,
  departments = mockDepartments,
}) {
  const [reportMode, setReportMode] = useState("monthly");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("2026-08-01");
  const [selectedMonth, setSelectedMonth] = useState("2026-08");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedEmp, setSelectedEmp] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  // Filter attendance records based on mode and active select inputs
  const filteredAttendance = useMemo(() => {
    return attendanceData.filter((record) => {
      const emp = employees.find((e) => e.id === record.empId);
      if (!emp) return false;

      if (reportMode === "daily") {
        if (record.date !== selectedDate) return false;
      } else {
        if (!record.date.startsWith(selectedMonth)) return false;
      }

      if (selectedDept && emp.dept !== selectedDept) return false;
      if (selectedEmp && record.empId !== Number(selectedEmp)) return false;

      return true;
    });
  }, [
    attendanceData,
    employees,
    reportMode,
    selectedDate,
    selectedMonth,
    selectedDept,
    selectedEmp,
  ]);

  // Compute table rows based on filtered attendance and search scope
  const allTableData = useMemo(() => {
    const searchLower = searchQuery.trim().toLowerCase();

    const relevantEmployees = employees.filter((e) => {
      if (selectedEmp && e.id !== Number(selectedEmp)) return false;
      if (selectedDept && e.dept !== selectedDept) return false;
      if (searchLower && !e.name.toLowerCase().includes(searchLower)) {
        return false;
      }
      return true;
    });

    return relevantEmployees.map((emp) => {
      const empRecs = filteredAttendance.filter((a) => a.empId === emp.id);
      
      let pCount = 0;
      let lCount = 0;
      let aCount = 0;
      let totalHrs = 0;

      empRecs.forEach((a) => {
        if (a.status === "Present") pCount++;
        else if (a.status === "Late") lCount++;
        else if (a.status === "Absent") aCount++;

        totalHrs += parseDurationInHours(a.punchIn, a.punchOut, a.date);
      });

      return {
        id: emp.id,
        name: emp.name,
        dept: emp.dept,
        present: pCount,
        late: lCount,
        absent: aCount,
        hoursNumeric: totalHrs,
        hours: totalHrs.toFixed(1),
      };
    });
  }, [employees, selectedEmp, selectedDept, searchQuery, filteredAttendance]);

  // Consolidate metrics directly from the calculated dataset to avoid redundant iterations
  const stats = useMemo(() => {
    let present = 0;
    let late = 0;
    let absent = 0;
    let totalHours = 0;

    allTableData.forEach((row) => {
      present += row.present;
      late += row.late;
      absent += row.absent;
      totalHours += row.hoursNumeric;
    });

    return {
      present,
      late,
      absent,
      hours: totalHours.toFixed(1),
    };
  }, [allTableData]);

  const reportsPieData = useMemo(() => {
    return {
      labels: ["Present", "Late", "Absent"],
      datasets: [
        {
          data: [stats.present, stats.late, stats.absent],
          backgroundColor: ["#12B76A", "#F79009", "#F04438"],
          borderColor: ["#ffffff", "#ffffff", "#ffffff"],
          borderWidth: 2,
        },
      ],
    };
  }, [stats]);

  // Reset page position when filters modify total count boundary
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedDept,
    selectedEmp,
    selectedDate,
    selectedMonth,
    reportMode,
  ]);

  const totalRecords = allTableData.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;

  const paginatedTableData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return allTableData.slice(startIndex, startIndex + pageSize);
  }, [allTableData, currentPage, pageSize]);

  const columns = [
    {
      key: "name",
      header: "EMPLOYEE",
      render: (row) => (
        <div className="employee-info">
          <Avatar name={row.name} size="small" />
          <span>{row.name}</span>
        </div>
      ),
    },
    {
      key: "dept",
      header: "DEPARTMENT",
      render: (row) => <Badge variant="info">{row.dept}</Badge>,
    },
    { key: "present", header: "PRESENT" },
    { key: "late", header: "LATE" },
    { key: "absent", header: "ABSENT" },
    {
      key: "hours",
      header: "HRS",
      render: (row) => <strong>{row.hours}</strong>,
    },
  ];

  const toolbarFilters = [
    {
      type: "search",
      name: "search",
      placeholder: "Search employee...",
    },
    ...(reportMode === "daily"
      ? [
          {
            type: "date",
            name: "date",
          },
        ]
      : [
          {
            type: "month",
            name: "month",
          },
        ]),
    {
      type: "select",
      name: "dept",
      placeholder: "All Departments",
      options: departments.map((d) => ({ label: d.name, value: d.name })),
    },
    {
      type: "select",
      name: "emp",
      placeholder: "All Employees",
      options: employees.map((e) => ({ label: e.name, value: String(e.id) })),
    },
  ];

  const toolbarValues = {
    search: searchQuery,
    date: selectedDate,
    month: selectedMonth,
    dept: selectedDept,
    emp: selectedEmp,
  };

  const handleToolbarChange = (name, value) => {
    if (name === "search") setSearchQuery(value);
    if (name === "date") setSelectedDate(value);
    if (name === "month") setSelectedMonth(value);
    if (name === "dept") setSelectedDept(value);
    if (name === "emp") setSelectedEmp(value);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedDept("");
    setSelectedEmp("");
    setSelectedDate("2026-08-01");
    setSelectedMonth("2026-08");
  };

  return (
    <div className="reports-container">
      {/* 1. HEADER & TOGGLE MODE */}
      <div className="reports-header">
        <div>
          <h2>Reports</h2>
          <p className="sub-heading">
            Daily / Monthly reports with employee and department filters
          </p>
        </div>
        <div className="toggle-group" role="tablist" aria-label="Report Mode">
          <button
            type="button"
            role="tab"
            aria-selected={reportMode === "daily"}
            className={`toggle-btn ${reportMode === "daily" ? "active" : ""}`}
            onClick={() => setReportMode("daily")}
          >
            Daily
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={reportMode === "monthly"}
            className={`toggle-btn ${reportMode === "monthly" ? "active" : ""}`}
            onClick={() => setReportMode("monthly")}
          >
            Monthly
          </button>
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
        <div className="chart-panel">
          <div className="pie-wrapper">
            <Pie
              data={reportsPieData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: { usePointStyle: true, boxWidth: 8 },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="table-panel">
          <div className="table-content-area">
            <DataTable
              columns={columns}
              data={paginatedTableData}
              rowKey="id"
              emptyMessage="No matching records found."
            />
          </div>
          <TablePagination
            page={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            pageSize={pageSize}
            onPrevious={() =>
              setCurrentPage((prev) => Math.max(prev - 1, 1))
            }
            onNext={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          />
        </div>
      </div>
    </div>
  );
}