import  { useState, useMemo, useCallback } from 'react';
import { mockHistoryData, mockDepartments, mockEmployees } from './mockBiometricData';
import Avatar from '../../components/Avatar/Avatar';
import Badge from '../../components/Badge/Badge';
import TableToolbar from '../../components/TableToolbar/TableToolbar';
import DataTable from '../../components/DataTable/DataTable';
import TablePagination from '../../components/TablePagination/TablePagination';

export default function AttendanceHistory({
  historyData = mockHistoryData,
  departments = mockDepartments,
  employees = mockEmployees,
}) {
  const [filterValues, setFilterValues] = useState({
    empId: '',
    dept: '',
    status: '',
    startDate: '',
    endDate: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleFilterChange = useCallback((name, value) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilterValues({
      empId: '',
      dept: '',
      status: '',
      startDate: '',
      endDate: '',
    });
    setCurrentPage(1);
  }, []);

  // Configure filters specifically for your TableToolbar component structure
  const filterConfig = useMemo(
    () => [
      {
        name: 'empId',
        type: 'select',
        placeholder: 'All Employees',
        options: employees.map((e) => ({
          label: `${e.name} (${e.empId})`,
          value: String(e.id),
        })),
      },
      {
        name: 'dept',
        type: 'select',
        placeholder: 'All Departments',
        options: departments.map((d) => ({
          label: d.name,
          value: d.name,
        })),
      },
      {
        name: 'status',
        type: 'select',
        placeholder: 'All Status',
        options: [
          { label: 'Present', value: 'Present' },
          { label: 'Late', value: 'Late' },
          { label: 'Absent', value: 'Absent' },
        ],
      },
      {
        name: 'startDate',
        type: 'date',
      },
      {
        name: 'endDate',
        type: 'date',
      },
    ],
    [employees, departments]
  );

  const filteredHistory = useMemo(() => {
    const { empId, dept, status, startDate, endDate } = filterValues;

    return (historyData || []).filter((item) => {
      const emp = employees?.find((e) => e.id === item.empId);

      if (empId && item.empId !== Number(empId)) return false;
      if (dept && (item.dept || emp?.dept) !== dept) return false;
      if (status && item.status !== status) return false;
      if (startDate && item.date < startDate) return false;
      if (endDate && item.date > endDate) return false;

      return true;
    });
  }, [historyData, employees, filterValues]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredHistory.slice(start, start + pageSize);
  }, [filteredHistory, currentPage, pageSize]);

  // Column definitions utilizing your DataTable render schema
  const columns = useMemo(
    () => [
      {
        key: 'date',
        header: 'DATE',
      },
      {
        key: 'empName',
        header: 'EMPLOYEE',
        render: (row) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Avatar name={row.empName} size="small" />
            <span style={{ fontWeight: 500, color: '#101828' }}>{row.empName}</span>
          </div>
        ),
      },
      {
        key: 'dept',
        header: 'DEPARTMENT',
        render: (row) => (
          <Badge variant="info">{row.dept}</Badge>
        ),
      },
      {
        key: 'punchIn',
        header: 'PUNCH IN',
        render: (row) => row.punchIn || '—',
      },
      {
        key: 'punchOut',
        header: 'PUNCH OUT',
        render: (row) => row.punchOut || '—',
      },
      {
        key: 'workingHours',
        header: 'WORKING HRS',
        render: (row) => row.workingHours || '—',
      },
      {
        key: 'status',
        header: 'STATUS',
        render: (row) => {
          let variant = 'success';
          if (row.status === 'Late') variant = 'warning';
          if (row.status === 'Absent') variant = 'danger';

          return <Badge variant={variant}>{row.status}</Badge>;
        },
      },
    ],
    []
  );

  return (
    <div className="attendance-history-card">
      <div className="card-header">
        <h2 className="card-title">Attendance History</h2>
        <p className="card-subtitle">
          Employee-wise and department-wise attendance records
        </p>
      </div>

      <TableToolbar
        filters={filterConfig}
        values={filterValues}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      <DataTable
        columns={columns}
        data={paginatedData}
        rowKey="id"
        emptyMessage="No attendance records found matching your filters."
      />

      {filteredHistory.length > 0 && (
        <TablePagination
          totalItems={filteredHistory.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}