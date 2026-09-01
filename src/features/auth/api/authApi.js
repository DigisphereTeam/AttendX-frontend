import axiosInstance from "../../../lib/axios";
 
const AUTH_ENDPOINTS = {
  LOGIN: "/user/login",
};
 
export const login = async (payload) => {
  const { data } = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, payload);
 
  return data;
};