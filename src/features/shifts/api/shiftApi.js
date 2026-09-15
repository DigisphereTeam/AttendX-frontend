import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../lib/axios";
import toast from "react-hot-toast";

const SHIFT_ENDPOINTS = {
  GET_ALL: "/shift/getshifts",
  ADD: "/shift/addshifts",
  UPDATE: (id) => `/shift/updateshifts/${id}`,
  DELETE: (id) => `/shift/deleteshifts/${id}`,
};

export const getShifts = async () => {
  const { data } = await axiosInstance.get(SHIFT_ENDPOINTS.GET_ALL);
  return data;
};

export const useShifts = () => {
  return useQuery({
    queryKey: ["shifts"],
    queryFn: getShifts,
    select: (response) => {
      const rawList = response?.data || [];

      return rawList.map((shift) => ({
        id: shift.shift_id,
        shiftType: shift.shift_type || "",
        fromTime: shift.start_time ? shift.start_time.slice(0, 5) : "",
        toTime: shift.end_time ? shift.end_time.slice(0, 5) : "",
        raw: shift,
      }));
    },
  });
};

export const addShift = async (newShiftData) => {
  const { data } = await axiosInstance.post(SHIFT_ENDPOINTS.ADD, newShiftData);
  return data;
};

export const useAddShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addShift,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      toast.success(response?.message || "Shift added successfully!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to add shift");
    },
  });
};

export const updateShift = async ({ id, data }) => {
  const response = await axiosInstance.put(SHIFT_ENDPOINTS.UPDATE(id), data);
  return response.data;
};

export const useUpdateShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateShift,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      toast.success(response?.message || "Shift updated successfully!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update shift");
    },
  });
};

export const deleteShift = async (id) => {
  const { data } = await axiosInstance.delete(SHIFT_ENDPOINTS.DELETE(id));
  return data;
};

export const useDeleteShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteShift,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      toast.success(response?.message || "Shift deleted successfully!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete shift");
    },
  });
};