import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import axiosInstance from "../../../lib/axios";

const fetchExpenditures = async () => {
  const response = await axiosInstance.get("/expenditure/list");
  return response.data?.data || [];
};

export const useExpenditures = () => {
  return useQuery({
    queryKey: ["expenditures"],
    queryFn: fetchExpenditures,
  });
};

const addExpenditure = async (data) => {
  const response = await axiosInstance.post("/expenditure/add", data);
  return response.data;
};

export const useAddExpenditure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addExpenditure,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["expenditures"] });
      toast.success(response?.message || "Expenditure added successfully!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to add expenditure");
    },
  });
};


const updateExpenditure = async ({ id, data }) => {
  const response = await axiosInstance.put(`/expenditure/${id}`, data);
  return response.data;
};

export const useUpdateExpenditure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateExpenditure,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["expenditures"] });
      toast.success(response?.message || "Expenditure updated successfully!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update expenditure");
    },
  });
};


const deleteExpenditure = async (id) => {
  const response = await axiosInstance.delete(`/expenditure/${id}`);
  return response.data;
};

export const useDeleteExpenditure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExpenditure,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["expenditures"] });
      toast.success(response?.message || "Expenditure deleted successfully!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete expenditure");
    },
  });
};