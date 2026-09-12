import { useState, useEffect, useCallback } from "react";
import { FiCheck, FiCalendar } from "react-icons/fi";
import "./LeaveModal.css";
import Button from "../Button/Button";

const LEAVE_TYPES = [
  { id: "Optional Holidays", name: "Optional Holidays" },
  { id: "Sick Leave", name: "Sick Leave" },
  { id: "Casual Leave", name: "Casual Leave" },
];

const INITIAL_FORM_STATE = {
  leaveType: "Optional Holidays",
  startDate: "",
  endDate: "",
  dayType: "full",
  reason: "",
};

const LeaveModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          leaveType: initialData.leaveType || "Optional Holidays",
          startDate: initialData.startDate || "",
          endDate: initialData.endDate || "",
          dayType: initialData.dayType || "full",
          reason: initialData.reason || "",
        });
      } else {
        setFormData(INITIAL_FORM_STATE);
      }
    }
  }, [isOpen, initialData]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "reason" && value.length > 300) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateTotalDays = () => {
    if (!formData.startDate || !formData.endDate) {
      return 0;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    const diffTime = end.getTime() - start.getTime();

    if (diffTime < 0) {
      return 0;
    }

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return formData.dayType === "half" ? diffDays * 0.5 : diffDays;
  };

  const totalDays = calculateTotalDays();

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit?.({
      ...formData,
      totalDays,
    });
  };

  return (
    <div
      className="modal fade show d-block custom-modal-backdrop"
      tabIndex="-1"
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 shadow-lg rounded-3 overflow-hidden">
          {/* Header */}
          <div className="modal-header border-bottom px-4 py-3 d-flex align-items-start justify-content-between">
            <div>
              <h5 className="modal-title fw-bold text-dark mb-0">
                {initialData ? "Edit Leave Request" : "Apply for Leave"}
              </h5>

              <small className="text-muted">
                {initialData
                  ? "Update your existing leave request"
                  : "Submit a new leave request for approval"}
              </small>
            </div>

            <button
              type="button"
              className="btn-close shadow-none"
              aria-label="Close"
              onClick={onClose}
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4 d-flex flex-column gap-3">
              {/* Leave Type */}
              <div>
                <label className="form-label fw-semibold small text-secondary mb-1">
                  Leave Type <span className="text-danger">*</span>
                </label>

                <select
                  className="form-select shadow-none"
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  required
                >
                  {LEAVE_TYPES.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <label className="form-label fw-semibold small text-secondary mb-1">
                    Start Date <span className="text-danger">*</span>
                  </label>

                  <div className="position-relative">
                    <FiCalendar className="date-icon" />

                    <input
                      type="date"
                      className="form-control ps-5 shadow-none"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <label className="form-label fw-semibold small text-secondary mb-1">
                    End Date <span className="text-danger">*</span>
                  </label>

                  <div className="position-relative">
                    <FiCalendar className="date-icon" />

                    <input
                      type="date"
                      className="form-control ps-5 shadow-none"
                      min={formData.startDate}
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Day Type */}
              <div className="bg-light border rounded p-2 px-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div className="d-flex gap-3">
                  <div className="form-check mb-0">
                    <input
                      className="form-check-input shadow-none"
                      type="radio"
                      name="dayType"
                      id="fullDay"
                      value="full"
                      checked={formData.dayType === "full"}
                      onChange={handleChange}
                    />

                    <label
                      className="form-check-label small fw-medium text-secondary"
                      htmlFor="fullDay"
                    >
                      Full Day
                    </label>
                  </div>

                  <div className="form-check mb-0">
                    <input
                      className="form-check-input shadow-none"
                      type="radio"
                      name="dayType"
                      id="halfDay"
                      value="half"
                      checked={formData.dayType === "half"}
                      onChange={handleChange}
                    />

                    <label
                      className="form-check-label small fw-medium text-secondary"
                      htmlFor="halfDay"
                    >
                      Half Day
                    </label>
                  </div>
                </div>

                <span className="badge bg-primary-subtle text-primary fw-semibold px-2 py-1">
                  Total: {totalDays}{" "}
                  {totalDays === 1 ? "Working Day" : "Working Days"}
                </span>
              </div>

              {/* Reason */}
              <div>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label fw-semibold small text-secondary mb-0">
                    Reason for Leave <span className="text-danger">*</span>
                  </label>

                  <span className="text-muted fs-xs">
                    {formData.reason.length} / 300
                  </span>
                </div>

                <textarea
                  className="form-control shadow-none"
                  rows={3}
                  name="reason"
                  placeholder="Enter details regarding your leave request..."
                  value={formData.reason}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="modal-footer border-0 pt-0 pb-4 px-4 d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>

              <Button type="submit" variant="primary" icon={FiCheck}>
                {initialData ? "Update Request" : "Submit Request"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeaveModal;