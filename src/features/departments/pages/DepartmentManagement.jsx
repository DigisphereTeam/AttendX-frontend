import { useState } from "react";
import { FiPlus } from "react-icons/fi";

import DepartmentCard from "../components/DepartmentCard/DepartmentCard";
import DepartmentModal from "../components/DepartmentModal/DepartmentModal";
import {
  useCreateDepartment,
  useDeleteDepartment,
  useDepartments,
  useUpdateDepartment,
} from "../api/departmentApi";

import "./DepartmentManagement.css";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";

const DepartmentManagement = () => {
  const { data: departments = [], isLoading, isError } = useDepartments();
  const createDepartmentMutation = useCreateDepartment();
  const updateDepartmentMutation = useUpdateDepartment();
  const deleteDepartmentMutation = useDeleteDepartment();

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
    if (window.confirm("Are you sure you want to delete this department!")){
      deleteDepartmentMutation.mutate(id)
    }
  };

  const handleFormSubmit = (data) => {
    const payload = {
      department_name: data.name,
      department_head: data.head,
    };

    if (selectedDepartment) {
      updateDepartmentMutation.mutate(
        { id: selectedDepartment.id, payload },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setSelectedDepartment(null);
          },
        }
      );
    } else {
      createDepartmentMutation.mutate(payload, {
        onSuccess: () => {
          setIsModalOpen(false);
        },
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDepartment(null);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading Departments" fullPage/>;
  }

  if (isError) {
    return <div className="department-management">Failed to load departments.</div>;
  }

  const isSubmitting = createDepartmentMutation.isPending || updateDepartmentMutation.isPending

  return (
    <div className="department-management">
      <div className="department-content-header">
        <div>
          <h1>Department Management</h1>
          <p>Manage departments and view department-wise employees</p>
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
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default DepartmentManagement;