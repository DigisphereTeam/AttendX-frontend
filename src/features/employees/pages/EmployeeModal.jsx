import { FiX, FiChevronDown } from "react-icons/fi";
// import "./DepartmentModal.css";

const EmployeeModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  departmentOptions = [],
  isEditing = false,
}) => {
  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(event) => event.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>{isEditing ? "Edit Employee" : "Add Employee"}</h2>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FiX />
          </button>
        </div>

        {/* Form Body */}
        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="modal-content-scroll">
            {/* Employee ID */}
            <div className="form-group">
              <label htmlFor="employeeId">Employee ID</label>
              <input
                id="employeeId"
                name="employeeId"
                type="text"
                placeholder="e.g. EMP-1013"
                value={formData?.employeeId || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={formData?.name || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Department Dropdown */}
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <div className="select-wrapper">
                <select
                  id="department"
                  name="department"
                  value={formData?.department || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select Department
                  </option>
                  {departmentOptions.map((dept) => (
                    <option key={dept.value || dept.id} value={dept.value || dept.name}>
                      {dept.label || dept.name}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="select-icon" />
              </div>
            </div>

            {/* Designation */}
            <div className="form-group">
              <label htmlFor="designation">Designation</label>
              <input
                id="designation"
                name="designation"
                type="text"
                placeholder="e.g. Software Engineer"
                value={formData?.designation || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone */}
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="e.g. 9876543210"
                maxLength={10}
                value={formData?.phone || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Status Dropdown */}
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <div className="select-wrapper">
                <select
                  id="status"
                  name="status"
                  value={formData?.status || "Active"}
                  onChange={handleChange}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <FiChevronDown className="select-icon" />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="btn-primary">
              {isEditing ? "Save Changes" : "Save Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;