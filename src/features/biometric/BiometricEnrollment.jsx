import { useState, useMemo, useCallback } from "react";
import { mockEmployees } from "./mockBiometricData";

export default function BiometricEnrollment({
  employees = mockEmployees,
  onUpdateEmployee = () => {},
}) {
  const [selectedEmpId, setSelectedEmpId] = useState(null);
  const [search, setSearch] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const selectedEmp = useMemo(
    () => employees.find((e) => e.id === selectedEmpId),
    [employees, selectedEmpId],
  );

  const filteredEmployees = useMemo(() => {
    return employees.filter(
      (e) =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.empId.toLowerCase().includes(search.toLowerCase()),
    );
  }, [employees, search]);

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
            onUpdateEmployee(selectedEmpId, { fingerprint: true });
          }
        },
        (idx + 1) * 750,
      );
    });
  }, [selectedEmpId, onUpdateEmployee]);

  return (
    <div className="row g-3">
      {/* Left Column: Employee Selection List */}
      <div className="department-content-header">
        <div>
          <h1>Biometric Enrollment</h1>
          <p>
            Register and manage unique physical fingerprints for secure system access.
          </p>
        </div>
      </div>
      <div className="col-lg-5">
        <div className="card p-3 h-100">
          <h6 className="fw-bold mb-1" style={{ color: "#0A2647" }}>
            Select Employee
          </h6>
          <p className="text-muted small mb-3">
            Choose an employee to enroll their fingerprint
          </p>
          <input
            type="text"
            className="form-control mb-3"
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
                onClick={() => {
                  setSelectedEmpId(emp.id);
                  setActiveStep(0);
                }}
                className={`p-2 rounded border cursor-pointer d-flex align-items-center justify-content-between ${
                  selectedEmpId === emp.id
                    ? "border-primary bg-light"
                    : "bg-white"
                }`}
                style={{ cursor: "pointer" }}
              >
                <div>
                  <div className="fw-semibold small">{emp.name}</div>
                  <div className="text-muted tiny" style={{ fontSize: "11px" }}>
                    {emp.empId} • {emp.dept}
                  </div>
                </div>
                {emp.fingerprint ? (
                  <span className="badge bg-info-subtle text-info rounded-pill">
                    <i className="bi bi-check-circle-fill me-1"></i> Registered
                  </span>
                ) : (
                  <span className="badge bg-danger-subtle text-danger rounded-pill">
                    Not Registered
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Enrollment Device Area */}
      <div className="col-lg-7">
        <div className="card p-3 h-100">
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
              <div
                className="d-flex align-items-center justify-content-between p-3 rounded mb-4"
                style={{ background: "#F7F9FC" }}
              >
                <div>
                  <div className="fw-bold" style={{ color: "#0A2647" }}>
                    {selectedEmp.name}
                  </div>
                  <div className="small text-muted">
                    {selectedEmp.empId} • {selectedEmp.dept} •{" "}
                    {selectedEmp.designation}
                  </div>
                </div>
                <span
                  className={`badge rounded-pill ${selectedEmp.fingerprint ? "bg-info-subtle text-info" : "bg-danger-subtle text-danger"}`}
                >
                  {selectedEmp.fingerprint
                    ? "Fingerprint Registered"
                    : "Not Registered"}
                </span>
              </div>

              <div className="row g-3 align-items-center">
                {/* Visual Ring Animation */}
                <div className="col-md-6 text-center">
                  <div
                    className={`mx-auto rounded-circle d-flex align-items-center justify-content-center position-relative ${
                      isScanning
                        ? "border border-primary border-3"
                        : activeStep === 4
                          ? "border border-success border-3"
                          : "border border-dashed"
                    }`}
                    style={{
                      width: "160px",
                      height: "160px",
                      background: "#F0FBFD",
                    }}
                  >
                    <i
                      className={`bi bi-fingerprint display-3 ${isScanning ? "text-info" : activeStep === 4 ? "text-success" : "text-secondary"}`}
                    ></i>
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
                  <div
                    className="p-3 rounded text-white d-flex flex-column"
                    style={{
                      background: "linear-gradient(180deg,#0F3460,#0A2647)",
                      minHeight: "260px",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold small">
                        <i className="bi bi-cpu-fill me-1"></i> Device:
                        FP-SCAN-2200
                      </span>
                      <span
                        className="rounded-circle bg-success d-inline-block"
                        style={{ width: "8px", height: "8px" }}
                      ></span>
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
                      className="btn btn-info text-white btn-sm mt-auto w-100 fw-semibold"
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
