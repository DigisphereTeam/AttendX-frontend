import { useState } from "react";
import { FiPlus } from "react-icons/fi";

import DepartmentCard from "../components/DepartmentCard/DepartmentCard";
import DepartmentModal from "../components/DepartmentModal/DepartmentModal";
import { departments as initialData } from "../data/departmentData";

import "./DepartmentManagement.css";

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    head: "",
  });

  const handleOpenAdd = () => {
    setSelectedDepartment(null);
    setFormData({
      name: "",
      head: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (department) => {
    setSelectedDepartment(department);

    setFormData({
      name: department.name,
      head: department.head,
    });

    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setDepartments((prev) =>
      prev.filter((department) => department.id !== id)
    );
  };

  const handleFormSubmit = (data) => {
    if (selectedDepartment) {
      setDepartments((prev) =>
        prev.map((department) =>
          department.id === selectedDepartment.id
            ? { ...department, ...data }
            : department
        )
      );
    } else {
      const newDepartment = {
        id: Date.now(),
        name: data.name,
        head: data.head,
        totalEmployees: 0,
        activeEmployees: 0,
        fingerprintRegistered: 0,
      };

      setDepartments((prev) => [...prev, newDepartment]);
    }

    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDepartment(null);
  };

  return (
    <div className="department-management">
      <div className="department-content-header">
        <div>
          <h1>Department Management</h1>

          <p>
            Manage departments and view department-wise employees
          </p>
        </div>

        <button
          type="button"
          className="department-add-button"
          onClick={handleOpenAdd}
        >
          <FiPlus />
          Add Department
        </button>
      </div>

      <div className="department-grid">
        {departments.map((department) => (
          <DepartmentCard
            key={department.id}
            department={department}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <DepartmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        formData={formData}
        setFormData={setFormData}
        isEditing={Boolean(selectedDepartment)}
      />
    </div>
  );
};

export default DepartmentManagement;