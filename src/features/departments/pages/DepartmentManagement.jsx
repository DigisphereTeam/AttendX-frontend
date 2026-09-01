import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";

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
import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog";

const DepartmentManagement = () => {
  const { data: departments = [], isLoading, isError } = useDepartments();
  const createDepartmentMutation = useCreateDepartment();
  const updateDepartmentMutation = useUpdateDepartment();
  const deleteDepartmentMutation = useDeleteDepartment();

  const [selectedDepartmentForDelete, setSelectedDepartmentForDelete] =
    useState(null);
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

  const handleDelete = (department) => {
    setSelectedDepartmentForDelete(department);
  };
  const handleConfirmDelete = () => {
    if (!selectedDepartmentForDelete) return;

    deleteDepartmentMutation.mutate(selectedDepartmentForDelete.id, {
      onSuccess: () => {
        toast.success("Department deleted successfully!");
        setSelectedDepartmentForDelete(null);
      },
      onError: (err) => {
        toast.error(
          err?.response?.data?.message || "Failed to delete department.",
        );
      },
    });
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
            toast.success("Department updated successfully!");
            setIsModalOpen(false);
            setSelectedDepartment(null);
          },
          onError: (err) => {
            toast.error(
              err?.response?.data?.message || "Failed to update department.",
            );
          },
        },
      );
    } else {
      createDepartmentMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Department created successfully!");
          setIsModalOpen(false);
        },
        onError: (err) => {
          toast.error(
            err?.response?.data?.message || "Failed to create department.",
          );
        },
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDepartment(null);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading Departments" fullPage />;
  }

  if (isError) {
    return (
      <div className="department-management">Failed to load departments.</div>
    );
  }

  const isSubmitting =
    createDepartmentMutation.isPending || updateDepartmentMutation.isPending;

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

      <ConfirmDialog
        show={Boolean(selectedDepartmentForDelete)}
        title="Delete Department"
        message={`Are you sure you want to delete ${selectedDepartmentForDelete?.name || "this department"}?`}
        confirmText="Delete Department"
        variant="danger"
        isLoading={deleteDepartmentMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setSelectedDepartmentForDelete(null)}
      />
    </div>
  );
};

export default DepartmentManagement;
