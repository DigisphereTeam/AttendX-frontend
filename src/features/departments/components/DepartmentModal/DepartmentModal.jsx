import { FiX } from "react-icons/fi";
import "./DepartmentModal.css";
import Button from "../../../../components/Button/Button";

const DepartmentModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isEditing,
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
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal-container"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2>
            {isEditing ? "Edit Department" : "Add Department"}
          </h2>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <FiX />
          </button>
        </div>

        <form
          className="modal-body"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="deptName">
              Department Name
            </label>

            <input
              id="deptName"
              name="name"
              type="text"
              placeholder="e.g. Human Resources"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="deptHead">
              Department Head
            </label>

            <input
              id="deptHead"
              name="head"
              type="text"
              placeholder="e.g. Priya Menon"
              value={formData.head}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-footer">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
            >
              {isEditing ? "Save Changes" : "Save Department"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentModal;