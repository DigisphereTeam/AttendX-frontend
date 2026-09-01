import { useState, useMemo, useCallback } from "react";
import Avatar from "../../../components/Avatar/Avatar";
import Badge from "../../../components/Badge/Badge";
import "./BiometricEnrollment.css";
import { useEmployees } from "../../employees/api/employeeApi";
import { useConfirmEnrollment, useEnrollFinger } from "../api/biometricApi";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";

const FINGER_OPTIONS = [
  { value: 0, label: "Right Thumb" },
  { value: 1, label: "Right Index" },
  { value: 2, label: "Right Middle" },
  { value: 5, label: "Left Thumb" },
  { value: 6, label: "Left Index" },
];

const HARDWARE_TIMEOUT_MS = 15000; // 15-second scan window before prompting retry

export default function BiometricEnrollment() {
  const { data, isLoading, isError } = useEmployees();
  const employees = data?.employees || [];

  const enrollFingerMutation = useEnrollFinger();
  const confirmEnrollmentMutation = useConfirmEnrollment();

  // Dynamic Device Config & Finger State
  const [deviceIp, setDeviceIp] = useState("192.168.0.101");
  const [devicePort, setDevicePort] = useState(4370);
  const [fingerIndex, setFingerIndex] = useState(0);

  // UI Selection & Workflow State
  const [selectedEmpId, setSelectedEmpId] = useState(null);
  const [search, setSearch] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isTimedOut, setIsTimedOut] = useState(false);

  const isScanning =
    enrollFingerMutation.isPending || confirmEnrollmentMutation.isPending;

  const selectedEmp = useMemo(
    () => employees.find((e) => e.id === selectedEmpId),
    [employees, selectedEmpId]
  );

  const filteredEmployees = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return employees;

    return employees.filter((e) => {
      const nameMatch = e.name?.toLowerCase().includes(query);
      const codeMatch = e.employeeId?.toLowerCase().includes(query);
      return nameMatch || codeMatch;
    });
  }, [employees, search]);

  const handleSelectEmployee = useCallback((id) => {
    setSelectedEmpId(id);
    setActiveStep(0);
    setErrorMessage("");
    setIsTimedOut(false);
  }, []);

  // Helper promise for scan window timeout guard
  const waitWithTimeout = (ms) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error("SCAN_TIMEOUT")), ms);
    });
  };

  // Main Hardware Scan Workflow
  const handleStartScan = async () => {
    if (!selectedEmp) return;

    setErrorMessage("");
    setIsTimedOut(false);
    setActiveStep(1);

    const payloadConfig = {
      device_ip: deviceIp,
      device_port: Number(devicePort),
      finger_index: Number(fingerIndex),
    };

    try {
      // Step 1: Put eSSL Device into Enrollment Mode
      await enrollFingerMutation.mutateAsync({
        ...payloadConfig,
        user_id: String(selectedEmp.id),
      });

      setActiveStep(2);

      // Step 2: Enforce hardware scan window delay with timeout guard
      await Promise.race([
        new Promise((res) => setTimeout(res, 4000)),
        waitWithTimeout(HARDWARE_TIMEOUT_MS),
      ]);

      setActiveStep(3);

      // Step 3: Confirm template & save to DB
      await confirmEnrollmentMutation.mutateAsync({
        ...payloadConfig,
        employee_id: selectedEmp.id,
      });

      setActiveStep(4);
    } catch (err) {
      setActiveStep(0);
      if (err.message === "SCAN_TIMEOUT") {
        setIsTimedOut(true);
        setErrorMessage("Hardware operation timed out. Fingerprint was not captured on time.");
      } else {
        setErrorMessage(
          err?.response?.data?.message || err?.message || "Enrollment failed. Ensure device IP & Port are correct."
        );
      }
    }
  };

  if (isLoading) return <LoadingSpinner message="Loading Employees" fullPage />;
  if (isError) {
    return (
      <div className="p-4 text-center text-danger">Failed to fetch employees.</div>
    );
  }

  return (
    <div className="row g-3 biometric-enrollment">
      <div className="department-content-header">
        <div>
          <h1>Biometric Enrollment</h1>
          <p>Register physical fingerprints via eSSL hardware scanners.</p>
        </div>
      </div>

      {/* Left Column: Employee List */}
      <div className="col-lg-5">
        <div className="card p-3 h-100 be-card">
          <h6 className="fw-bold mb-1" style={{ color: "#0A2647" }}>Select Employee</h6>
          <p className="text-muted small mb-3">Choose an employee to enroll</p>
          <input
            type="text"
            className="form-control mb-3 be-input"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="d-flex flex-column gap-2 overflow-auto" style={{ maxHeight: "450px" }}>
            {filteredEmployees.map((emp) => (
              <div
                key={emp.id}
                onClick={() => handleSelectEmployee(emp.id)}
                className={`be-emp-item ${selectedEmpId === emp.id ? "be-emp-item--active" : ""}`}
              >
                <div className="d-flex align-items-center gap-2">
                  <Avatar name={emp.name} size="small" />
                  <div>
                    <div className="fw-semibold small">{emp.name}</div>
                    <div className="text-muted" style={{ fontSize: "11px" }}>
                      {emp.employeeId} • {emp.departmentName}
                    </div>
                  </div>
                </div>
                <Badge variant={emp.fingerprintRegistered ? "info" : "danger"}>
                  {emp.fingerprintRegistered ? "Registered" : "Not Registered"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Device Console & Setup */}
      <div className="col-lg-7">
        <div className="card p-3 h-100 be-card">
          <h6 className="fw-bold mb-1" style={{ color: "#0A2647" }}>
            Device Settings & Target Finger
          </h6>
          <p className="text-muted small mb-3">Configure hardware scanner target and finger position</p>

          {/* Dynamic Settings Inputs */}
          <div className="p-2 mb-3 rounded bg-light border">
            <div className="row g-2 align-items-center">
              <div className="col-md-4">
                <label className="form-label mb-0 tiny fw-bold">Device IP</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={deviceIp}
                  onChange={(e) => setDeviceIp(e.target.value)}
                  disabled={isScanning}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label mb-0 tiny fw-bold">Port</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={devicePort}
                  onChange={(e) => setDevicePort(e.target.value)}
                  disabled={isScanning}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label mb-0 tiny fw-bold">Finger Index</label>
                <select
                  className="form-select form-select-sm"
                  value={fingerIndex}
                  onChange={(e) => setFingerIndex(Number(e.target.value))}
                  disabled={isScanning}
                >
                  {FINGER_OPTIONS.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Error Banner with Retry */}
          {errorMessage && (
            <div className="alert alert-danger py-2 small mb-3 d-flex justify-content-between align-items-center">
              <span>{errorMessage}</span>
              <button className="btn btn-sm btn-outline-danger ms-2" onClick={handleStartScan}>
                Retry
              </button>
            </div>
          )}

          {!selectedEmp ? (
            <div className="text-center py-5 text-muted my-auto">
              <i className="bi bi-fingerprint display-1 text-light"></i>
              <p className="mt-2 mb-0">Select an employee from the list to begin enrollment</p>
            </div>
          ) : (
            <div>
              {/* Target Employee Banner */}
              <div className="be-target-banner mb-3">
                <div className="d-flex align-items-center gap-3">
                  <Avatar name={selectedEmp.name} size="medium" />
                  <div>
                    <div className="fw-bold" style={{ color: "#0A2647" }}>{selectedEmp.name}</div>
                    <div className="small text-muted">
                      {selectedEmp.employeeId} • {selectedEmp.departmentName}
                    </div>
                  </div>
                </div>
                <Badge variant={selectedEmp.fingerprintRegistered ? "info" : "danger"}>
                  {selectedEmp.fingerprintRegistered ? "Registered" : "Not Registered"}
                </Badge>
              </div>

              <div className="row g-3 align-items-center">
                {/* Ring Animation */}
                <div className="col-md-6 text-center">
                  <div className={`scanner-ring ${isScanning ? "scanning" : ""} ${activeStep === 4 ? "success" : ""}`}>
                    <i className={`bi bi-fingerprint fp-icon ${isScanning ? "scanning" : ""} ${activeStep === 4 ? "success" : ""}`}></i>
                    <div className={`scan-line ${isScanning ? "active" : ""}`}></div>
                  </div>
                  <div className="fw-bold mt-3" style={{ color: "#0A2647" }}>
                    {isScanning
                      ? "Awaiting Hardware Scan..."
                      : activeStep === 4
                      ? "Enrollment Successful!"
                      : isTimedOut
                      ? "Scan Timed Out"
                      : "Ready to scan"}
                  </div>
                  <div className="small text-muted">
                    {isScanning
                      ? "Place target finger on sensor 3 times."
                      : isTimedOut
                      ? "Press Retry button to try again."
                      : "Click button below to start enrollment."}
                  </div>
                </div>

                {/* Device Console */}
                <div className="col-md-6">
                  <div className="be-device-panel">
                    <div className="fw-bold small mb-2 text-white">
                      <i className="bi bi-cpu-fill me-1"></i> Target: {deviceIp}:{devicePort}
                    </div>

                    <div className="border-top border-secondary pt-2 mb-3">
                      <div className="tiny fw-bold mb-1 text-white-50">Progress Steps</div>
                      <ol className="ps-3 tiny mb-0 text-white-50" style={{ fontSize: "11px" }}>
                        <li style={{ color: activeStep >= 1 ? "#fff" : "inherit" }}>Trigger enroll mode</li>
                        <li style={{ color: activeStep >= 2 ? "#fff" : "inherit" }}>Place finger on sensor (3x)</li>
                        <li style={{ color: activeStep >= 3 ? "#fff" : "inherit" }}>Generate biometric template</li>
                        <li style={{ color: activeStep >= 4 ? "#fff" : "inherit" }}>Sync database record</li>
                      </ol>
                    </div>

                    <button
                      className="btn btn-info scan-btn text-white btn-sm mt-auto w-100 fw-semibold be-btn"
                      disabled={isScanning}
                      onClick={handleStartScan}
                    >
                      <i className="bi bi-fingerprint me-1"></i>
                      {isScanning
                        ? "Enrolling..."
                        : isTimedOut
                        ? "Retry Enrollment"
                        : selectedEmp.fingerprintRegistered
                        ? "Re-Register Fingerprint"
                        : "Register Fingerprint"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}