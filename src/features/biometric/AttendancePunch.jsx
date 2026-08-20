import { useState, useMemo, useCallback } from 'react';
import DataTable from '../../components/DataTable/DataTable';
import { mockAttendanceLogs, mockEmployees } from './mockBiometricData';


export default function AttendancePunch({ employees = mockEmployees, 
  attendanceLogs = mockAttendanceLogs, 
  onPunch = () => "Punch registered successfully" }) {
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [resultMsg, setResultMsg] = useState(null);

  const registeredEmployees = useMemo(
    () => employees.filter((e) => e.fingerprint && e.status === 'Active'),
    [employees]
  );

  const handleSimulateScan = useCallback(() => {
    if (!selectedEmpId) return;
    setIsScanning(true);
    setResultMsg(null);

    setTimeout(() => {
      setIsScanning(false);
      const res = onPunch(Number(selectedEmpId));
      setResultMsg(res);
    }, 1200);
  }, [selectedEmpId, onPunch]);

  const columns = useMemo(
    () => [
      {
        header: 'EMPLOYEE',
        accessorKey: 'name',
        cell: (info) => (
          <div className="d-flex align-items-center gap-2">
            <div className="rounded bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
              {info.getValue().slice(0, 2).toUpperCase()}
            </div>
            <span className="fw-semibold">{info.getValue()}</span>
          </div>
        ),
      },
      { header: 'DEPT', accessorKey: 'dept' },
      { header: 'PUNCH IN', accessorKey: 'punchIn' },
      { header: 'PUNCH OUT', accessorKey: 'punchOut', cell: (info) => info.getValue() || '—' },
      {
        header: 'STATUS',
        accessorKey: 'status',
        cell: (info) => (
          <span className={`badge rounded-pill ${info.getValue() === 'Late' ? 'bg-warning-subtle text-warning' : 'bg-success-subtle text-success'}`}>
            {info.getValue()}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="row g-3">
      {/* Simulation Device Column */}
      <div className="col-lg-5">
        <div className="card p-3 text-center h-100">
          <h6 className="fw-bold mb-1" style={{ color: '#0A2647' }}>Biometric Attendance Device</h6>
          <p className="text-muted small mb-3">Employees scan their registered fingerprint to punch in/out</p>

          <div
            className={`mx-auto rounded-circle d-flex align-items-center justify-content-center my-3 ${
              isScanning ? 'border border-info border-3' : 'border border-dashed'
            }`}
            style={{ width: '150px', height: '150px', background: '#F0FBFD' }}
          >
            <i className={`bi bi-fingerprint display-3 ${isScanning ? 'text-info' : 'text-secondary'}`}></i>
          </div>

          <div className="text-start mt-2">
            <label className="form-label small fw-bold">Simulate Fingerprint Scan From</label>
            <select
              className="form-select mb-2"
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(e.target.value)}
            >
              <option value="">-- Select Employee --</option>
              {registeredEmployees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} ({e.empId}) — {e.dept}
                </option>
              ))}
            </select>
            <button
              className="btn btn-navy w-100 fw-semibold text-white"
              style={{ backgroundColor: '#0A2647' }}
              onClick={handleSimulateScan}
              disabled={isScanning || !selectedEmpId}
            >
              <i className="bi bi-fingerprint me-1"></i> Scan Fingerprint
            </button>
          </div>

          <div className="alert alert-light border mt-3 text-start small mb-0">
            {resultMsg ? (
              <div>
                <i className="bi bi-check-circle-fill text-success me-1"></i> {resultMsg}
              </div>
            ) : (
              <div>
                <i className="bi bi-info-circle me-1"></i> Awaiting fingerprint scan...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Log Table Column */}
      <div className="col-lg-7">
        <div className="card p-3 h-100">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h6 className="fw-bold mb-0" style={{ color: '#0A2647' }}>Today's Attendance Log</h6>
              <span className="text-muted small">{new Date().toDateString()}</span>
            </div>
            <span className="badge bg-success-subtle text-success rounded-pill px-3">
              {attendanceLogs.length} punches
            </span>
          </div>
          <DataTable columns={columns} data={attendanceLogs} />
        </div>
      </div>
    </div>
  );
}