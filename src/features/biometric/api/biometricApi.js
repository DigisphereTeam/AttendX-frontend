import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../lib/axios";
import { formatToUTCDate, formatToUTCTime } from "../../../utils/dateUtils";

// Endpoint constants
const BIOMETRIC_ENDPOINTS = {
  ENROLL_FINGER: "/device/enroll-finger",
  CONFIRM_ENROLLMENT: "/device/confirm-enrollment",
};

// Raw fetchers
export const enrollFinger = async (payload) => {
  const { data } = await axiosInstance.post(
    BIOMETRIC_ENDPOINTS.ENROLL_FINGER,
    payload
  );
  return data;
};

export const confirmEnrollment = async (payload) => {
  const { data } = await axiosInstance.post(
    BIOMETRIC_ENDPOINTS.CONFIRM_ENROLLMENT,
    payload
  );
  return data;
};

// React Query Hooks
export const useEnrollFinger = () => useMutation({ mutationFn: enrollFinger });

export const useConfirmEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

export const getDashboardAttendanceHistory = async (params) => {
  const queryParams = {
    search: params.search || undefined,
    status: params.status || undefined,
    department_id: params.dept || undefined, // Mapped department filter parameter
    department: params.dept || undefined,    // Alternative key fallback for backends expecting string name
    from_date: params.startDate || undefined,
    to_date: params.endDate || undefined,
    employee_id: params.empId || undefined,
  };

  const { data } = await axiosInstance.get("/dashboard/attendencehistory", {
    params: queryParams,
  });
  return data;
};

export const useAttendanceHistory = (filters = {}) => {
  return useQuery({
    queryKey: ["attendanceHistory", filters],
    queryFn: () => getDashboardAttendanceHistory(filters),
    select: (response) => {
      const rawList = response?.data || [];

      const formattedList = rawList.map((item, index) => {
        const targetDate = item.date || item.punchIn;

        return {
          id: `${item.employeeId}-${index}`,
          date: formatToUTCDate(targetDate),
          empId: item.employeeId,
          empName: item.employeeName || "N/A",
          dept: item.department || "Unassigned",
          punchIn: formatToUTCTime(item.punchIn),   // Outputs clean UTC time: "02:50 PM"
          punchOut: formatToUTCTime(item.punchOut), // Outputs clean UTC time or "--"
          workingHours: item.workingHours || "—",
          status: item.status || "Present",
        };
      });

      if (filters.dept) {
        return formattedList.filter(
          (item) => item.dept.toLowerCase() === filters.dept.toLowerCase()
        );
      }

      return formattedList;
    },
  });
};
