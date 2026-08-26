import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../lib/axios";

const EMPLOYEE_ENDPOINTS = {
  GET_ALL: "/employee/getemployees",
};

// Raw API Fetcher
export const getEmployees = async () => {
  const { data } = await axiosInstance.get(EMPLOYEE_ENDPOINTS.GET_ALL);
  return data;
};

// Hooks
export const useEmployees = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
    select: (response) => {
      const rawList = response?.data || [];

      return rawList.map((emp) => ({
        id: emp.employee_id,
        employeeId: `EMP-${emp.employee_id}`,
        name: emp.employee_name || "N/A",
        departmentId: emp.department_id,
        departmentName: emp.department_name || (emp.department_id ? `Dept #${emp.department_id}` : "Unassigned"),   
        designation: emp.designation || "N/A",
        phone: emp.mobile_number || "N/A",
        status: emp.status ? emp.status.charAt(0).toUpperCase() + emp.status.slice(1) : "Inactive",
        fingerprintRegistered: Boolean(emp.device_user_id),
        raw: emp,
      }));
    },
  });
};