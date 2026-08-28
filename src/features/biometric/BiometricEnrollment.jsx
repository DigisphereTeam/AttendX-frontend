import { useState, useMemo, useCallback } from "react";
import Avatar from "../../components/Avatar/Avatar";
import Badge from "../../components/Badge/Badge";
import "./BiometricEnrollment.css";
import { useEmployees } from "../employees/api/employeeApi";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

export default function BiometricEnrollment({ onUpdateEmployee = () => {} }) {
  const { data: employees=[], isLoading, isError } = useEmployees();

  const [localOverrides, setLocalOverrides] = useState({});
  const [selectedEmpId, setSelectedEmpId] = useState(null);
  const [search, setSearch] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

const mergedEmployees = useMemo(() => {

  const list = employees?.employees || [];

  return list.map((emp) => ({
    ...emp,
    fingerprint: localOverrides[emp.id] ?? emp.fingerprint,
  }));
}, [employees, localOverrides]);

  const selectedEmp = useMemo(
    () => mergedEmployees.find((e) => e.id === selectedEmpId),
    [mergedEmployees, selectedEmpId],
  );

  const filteredEmployees = useMemo(() => {
    return mergedEmployees.filter(
      (e) =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.empId.toLowerCase().includes(search.toLowerCase()),
    );
  }, [mergedEmployees, search]);

  const handleSelectEmployee = useCallback((id) => {
    setSelectedEmpId(id);
    setActiveStep(0);
    setIsScanning(false);
  }, []);

  const handleStartScan = useCallback(() => {
    if (!selectedEmpId) return;

    setIsScanning(true);
    setActiveStep(1);

    const steps = [1, 2, 3, 4];

    steps.forEach((step, idx) => {
      setTimeout(
        () => {
          setActiveStep(step);

          if (step === 4) {
            setIsScanning(false);

            setLocalOverrides((prev) => ({
              ...prev,
              [selectedEmpId]: true,
            }));

            onUpdateEmployee(selectedEmpId, {
              fingerprint: true,
            });
          }
        },
        (idx + 1) * 750,
      );
    });
  }, [selectedEmpId, onUpdateEmployee]);

  if (isLoading) {
    return <LoadingSpinner message="Loading Employees" fullPage />;
  }
  if (isError)
    return (
      <div className="p-4 text-center text-danger">
        Failed to fetch employees.
      </div>
    );

  return (
    <div className="row g-3 biometric-enrollment">
      {/* Header */}
      <div className="department-content-header">
        <div>
          <h1>Biometric Enrollment</h1>
          <p>
            Register and manage unique physical fingerprints for secure system
            access.
          </p>
        </div>
      </div>

      {/* Left Column: Employee Selection List */}
      <div className="col-lg-5">
        <div className="card p-3 h-100 be-card">
          <h6 className="fw-bold mb-1" style={{ color: "#0A2647" }}>
            Select Employee
          </h6>
          <p className="text-muted small mb-3">
            Choose an employee to enroll their fingerprint
          </p>
          <input
            type="text"
            className="form-control mb-3 be-input"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div
            className="d-flex flex-column gap-2 overflow-auto"
            style={{ maxHeight: "420px" }}
          >
            {filteredEmployees.map((emp) => (
              <div
                key={emp.id}
                onClick={() => handleSelectEmployee(emp.id)}
                className={`be-emp-item ${
                  selectedEmpId === emp.id ? "be-emp-item--active" : ""
                }`}
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
                <Badge variant={emp.fingerprint ? "info" : "danger"}>
                  {emp.fingerprint ? "Registered" : "Not Registered"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Enrollment Device Area */}
      <div className="col-lg-7">
        <div className="card p-3 h-100 be-card">
          <h6 className="fw-bold mb-1" style={{ color: "#0A2647" }}>
            Fingerprint Enrollment Device
          </h6>
          <p className="text-muted small mb-3">
            Simulated biometric scanner — click Register to begin
          </p>

          {!selectedEmp ? (
            <div className="text-center py-5 text-muted my-auto">
              <i className="bi bi-fingerprint display-1 text-light"></i>
              <p className="mt-2 mb-0">
                Select an employee from the list to begin enrollment
              </p>
            </div>
          ) : (
            <div>
              {/* Target Banner */}
              <div className="be-target-banner">
                <div className="d-flex align-items-center gap-3">
                  <Avatar name={selectedEmp.name} size="medium" />
                  <div>
                    <div className="fw-bold" style={{ color: "#0A2647" }}>
                      {selectedEmp.name}
                    </div>
                    <div className="small text-muted">
                      {selectedEmp.employeeId} • {selectedEmp.departmentName} •{" "}
                      {selectedEmp.designation}
                    </div>
                  </div>
                </div>
                <Badge variant={selectedEmp.fingerprint ? "info" : "danger"}>
                  {selectedEmp.fingerprint
                    ? "Fingerprint Registered"
                    : "Not Registered"}
                </Badge>
              </div>

              <div className="row g-3 align-items-center">
                {/* Visual Ring Animation */}
                <div className="col-md-6 text-center">
                  <div
                    className={`scanner-ring ${isScanning ? "scanning" : ""} ${
                      activeStep === 4 ? "success" : ""
                    }`}
                  >
                    <i
                      className={`bi bi-fingerprint fp-icon ${
                        isScanning ? "scanning" : ""
                      } ${activeStep === 4 ? "success" : ""}`}
                    ></i>
                    <div
                      className={`scan-line ${isScanning ? "active" : ""}`}
                    ></div>
                  </div>
                  <div className="fw-bold mt-3" style={{ color: "#0A2647" }}>
                    {isScanning
                      ? "Scanning in progress..."
                      : activeStep === 4
                        ? "Enrollment Successful!"
                        : "Ready to scan"}
                  </div>
                  <div className="small text-muted">
                    {isScanning
                      ? "Do not remove finger from sensor"
                      : "Place finger on the sensor to begin enrollment"}
                  </div>
                </div>

                {/* Device Console */}
                <div className="col-md-6">
                  <div className="be-device-panel">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold small">
                        <i className="bi bi-cpu-fill me-1"></i> Device:
                        FP-SCAN-2200
                      </span>
                      <span className="led led-green"></span>
                    </div>
                    <div className="tiny text-white-50">
                      Device ID:{" "}
                      <span className="text-white">DGST-BIO-0417</span>
                    </div>
                    <div className="tiny text-white-50">
                      Firmware: <span className="text-white">v3.2.1</span>
                    </div>
                    <div className="tiny text-white-50 mb-3">
                      Connection:{" "}
                      <span className="text-white">USB • Stable</span>
                    </div>

                    <div className="border-top border-secondary pt-2 mb-3">
                      <div className="tiny fw-bold mb-1 text-white-50">
                        Enrollment Steps
                      </div>
                      <ol
                        className="ps-3 tiny mb-0 text-white-50"
                        style={{ fontSize: "11px" }}
                      >
                        <li
                          style={{
                            color: activeStep >= 1 ? "#fff" : "inherit",
                          }}
                        >
                          Place finger on scanner
                        </li>
                        <li
                          style={{
                            color: activeStep >= 2 ? "#fff" : "inherit",
                          }}
                        >
                          Capture fingerprint sample (3x)
                        </li>
                        <li
                          style={{
                            color: activeStep >= 3 ? "#fff" : "inherit",
                          }}
                        >
                          Generate biometric template
                        </li>
                        <li
                          style={{
                            color: activeStep >= 4 ? "#fff" : "inherit",
                          }}
                        >
                          Save to employee record
                        </li>
                      </ol>
                    </div>

                    <button
                      className="btn btn-info scan-btn text-white btn-sm mt-auto w-100 fw-semibold be-btn"
                      disabled={isScanning}
                      onClick={handleStartScan}
                    >
                      <i className="bi bi-fingerprint me-1"></i>
                      {selectedEmp.fingerprint
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
