import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../lib/axios";

const DEPARTMENT_ENDPOINTS = {
  GET_ALL: "/department/getDepartmentEmployeeCounts",
  CREATE: "/department/adddepartment",
  UPDATE: (id) => `/department/updatedepartment/${id}`,
  DELETE: (id) => `/department/deletedepartment/${id}`,
  GET_EMP_BY_ID: (id) => `/department/departments/${id}`,
};

// Raw API Fetcher
export const getDepartments = async () => {
  const { data } = await axiosInstance.get(DEPARTMENT_ENDPOINTS.GET_ALL);
  return data;
};

export const createDepartment = async (payload) => {
    const { data } = await axiosInstance.post(DEPARTMENT_ENDPOINTS.CREATE,payload)
    return data
}

export const updateDepartment = async (id,payload) => {
    const {data} = await axiosInstance.put(DEPARTMENT_ENDPOINTS.UPDATE(id),payload)
    return data
}

export const deleteDepartment = async (id) => {
    const {data} = await axiosInstance.delete(DEPARTMENT_ENDPOINTS.DELETE(id))
    return data
}

export const getEmployeesByDepartment = async (id) => {
    const {data} = await axiosInstance.get(DEPARTMENT_ENDPOINTS.GET_EMP_BY_ID(id)) 
    return data
}

// Hooks
export const useDepartments = () => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
    select: (response) => {
      const rawList = response?.data || [];

      return rawList.map((dept) => ({
        id: dept.department_id,
        departmentId: `DEPT-${dept.department_id}`,
        name: dept.department_name || "N/A",
        head: dept.department_head || "Unassigned",
        totalEmployees: dept.total_employees ?? 6,
        activeEmployees: dept.active_employees ?? 4,
        fingerprintRegistered: dept.fingerprint_registered ?? 2,
        raw: dept,
      }));
    },
  });
};

export const useCreateDepartment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createDepartment,
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey:["departments"]})
        }
    })
}

export const useUpdateDepartment = () =>{
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({id,payload})=> updateDepartment(id,payload),
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey:["departments"]})
        }
    })
}

export const useDeleteDepartment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:(id)=> deleteDepartment(id),
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey:["departments"]})
        }
    })
}

export const useEmployeesByDepartment = (id) => {
    return useQuery({
        queryKey: ["employees","departments",id],
        queryFn: ()=>getEmployeesByDepartment(id),
        enabled: Boolean(id),
        select: (response)=>{
            const rawList = response?.data || [];
            return rawList.map((emp)=>({
                id: emp.employee_id,
                employeeId: `EMP-${emp.employee_id}`,
                name: emp.employee_name || "N/A",
                designation: emp.designation || "N/A",
                status: emp.status || "Active",
                fingerprint: emp.enrolled ? "Registered" : "Not Registered",
                raw: emp
            }))    
        }

    })
}