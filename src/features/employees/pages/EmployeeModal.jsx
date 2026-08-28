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
  isSubmitting = false,
}) => {
  if (!isOpen) return null;

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
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>{isEditing ? "Edit Employee" : "Add Employee"}</h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close modal"
          >
            <FiX />
          </button>
        </div>

        {/* Form Body */}
        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="modal-content-scroll">
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
                disabled={isSubmitting}
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
                  disabled={isSubmitting}
                  required
                >
                  <option value="" disabled>
                    Select Department
                  </option>
                  {departmentOptions.map((dept) => (
                    <option
                      key={dept.value || dept.id}
                      value={dept.value || dept.id}
                    >
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Save Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;
