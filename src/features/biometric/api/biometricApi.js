import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../lib/axios";

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
        // Fallback: punchIn or date property
        const targetDateStr = item.punchIn || item.date;
        const dateObj = targetDateStr ? new Date(targetDateStr) : null;

        let formattedDate = "N/A";
        if (dateObj && !isNaN(dateObj.getTime())) {
          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, "0");
          const day = String(dateObj.getDate()).padStart(2, "0");
          formattedDate = `${year}-${month}-${day}`;
        }

        const formatTime = (timeStr) => {
          if (!timeStr) return "—";
          const d = new Date(timeStr);
          return isNaN(d.getTime())
            ? "—"
            : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
        };

        return {
          id: `${item.employeeId}-${index}`,
          date: formattedDate,
          empId: item.employeeId,
          empName: item.employeeName || "N/A",
          dept: item.department || "Unassigned",
          punchIn: formatTime(item.punchIn),
          punchOut: formatTime(item.punchOut),
          workingHours: item.workingHours || "—",
          status: item.status || "Present",
        };
      });

      // Client-side fallback filter if the backend doesn't filter departments natively
      if (filters.dept) {
        return formattedList.filter(
          (item) => item.dept.toLowerCase() === filters.dept.toLowerCase()
        );
      }

      return formattedList;
    },
  });
};