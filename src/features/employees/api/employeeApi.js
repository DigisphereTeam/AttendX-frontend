import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../lib/axios";

const EMPLOYEE_ENDPOINTS = {
  GET_ALL: "/employee/getemployees",
  CREATE: "/employee/addemployeewithdevice",
  UPDATE: (id) => `/employee/edit-employee-with-device/${id}`,
  DELETE: (id) => `/employee/delete-employee-with-device/${id}`,
};

export const getEmployees = async () => {
  const { data } = await axiosInstance.get(EMPLOYEE_ENDPOINTS.GET_ALL);
  return data;
};

export const createEmployee = async (payload) => {
  const { data } = await axiosInstance.post(EMPLOYEE_ENDPOINTS.CREATE, payload);
  return data;
};

export const updateEmployee = async ({ id, payload }) => {
  const { data } = await axiosInstance.put(EMPLOYEE_ENDPOINTS.UPDATE(id), payload);
  return data;
};

export const deleteEmployee = async (id) => {
  const { data } = await axiosInstance.delete(EMPLOYEE_ENDPOINTS.DELETE(id) , {data:{}} );
  return data;
};

// Hooks
export const useEmployees = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
    select: (response) => {
      const rawList = response?.employees || [];
      const counts = response?.counts || {
        total_employees:0,
        active_employees:0,
        inactive_employees:0,
        fp_registered:0,
        fp_not_registered:0,
      }

      const employees = rawList.map((emp) => ({
        id: emp.employee_id,
        employeeId: `EMP-${emp.employee_id}`,
        name: emp.employee_name || "N/A",
        departmentId: emp.department_id,
        departmentName: emp.department_name || (emp.department_id ? `Dept #${emp.department_id}` : "Unassigned"),
        designation: emp.designation || "N/A",
        phone: emp.mobile_number || "N/A",
        status: emp.status ? emp.status.charAt(0).toUpperCase() + emp.status.slice(1) : "Inactive",
        fingerprintRegistered: emp.fingerprint_status?.toLowerCase().trim() === "registered",
        raw: emp,
      }));
      return{ employees, counts}
    },
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};