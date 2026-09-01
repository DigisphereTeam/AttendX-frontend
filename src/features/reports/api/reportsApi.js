import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../lib/axios";
 
const REPORTS_ENDPOINTS = {
  GET_REPORTS: "/dashboard/reports",
};
 
export const getReports = async (params = {}) => {
  const { data } = await axiosInstance.get(REPORTS_ENDPOINTS.GET_REPORTS, {
    params,
  });
 
  return data;
};
 
export const useReports = (params = {}) => {
  return useQuery({
    queryKey: ["reports", params],
    queryFn: () => getReports(params),
  });
};