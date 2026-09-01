import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../lib/axios";
 
const DASHBOARD_ENDPOINTS = {
  GET_DASHBOARD: "/dashboard/getdashboard",
};
 
export const getDashboard = async () => {
  const { data } = await axiosInstance.get(DASHBOARD_ENDPOINTS.GET_DASHBOARD);
 
  return data;
};
 
 
export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });
};