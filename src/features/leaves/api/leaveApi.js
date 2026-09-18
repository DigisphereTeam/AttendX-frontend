import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import axiosInstance from "../../../lib/axios";

// 1. Fetch all leaves (Admin view)
const fetchAllLeaves = async () => {
  const response = await axiosInstance.get("/leave/getleaves");
  return response.data || { dashboard: {}, leaves: [] };
};

export const useAllLeaves = () => {
  return useQuery({
    queryKey: ["all-leaves"],
    queryFn: fetchAllLeaves,
  });
};

// 2. Fetch employee leaves (Employee view)
const fetchEmployeeLeaves = async (employeeId) => {
  if (!employeeId) return { dashboard: {}, leaves: [] };
  const response = await axiosInstance.get(
    `/leave/getleavesbyemployee?employee_id=${employeeId}`
  );
  return response.data || { dashboard: {}, leaves: [] };
};

export const useEmployeeLeaves = (employeeId) => {
  return useQuery({
    queryKey: ["employee-leaves", employeeId],
    queryFn: () => fetchEmployeeLeaves(employeeId),
    enabled: Boolean(employeeId),
  });
};

// 3. Apply for Leave
const applyLeave = async (leaveData) => {
  const response = await axiosInstance.post("/leave/applyleave", leaveData);
  return response.data;
};

export const useApplyLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyLeave,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["employee-leaves"] });
      queryClient.invalidateQueries({ queryKey: ["all-leaves"] });
      toast.success(response?.message || "Leave applied successfully!");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to apply for leave"
      );
    },
  });
};

// 4. Update Leave Status (Approve / Reject for Admin)
const updateLeaveStatus = async ({ leaveId, status }) => {
  const response = await axiosInstance.put(
    `/leave/leavestatus?leave_id=${leaveId}&status=${status}`
  );
  return response.data;
};

export const useUpdateLeaveStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLeaveStatus,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["all-leaves"] });
      queryClient.invalidateQueries({ queryKey: ["employee-leaves"] });
      toast.success(response?.message || "Leave status updated successfully!");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update leave status"
      );
    },
  });
};