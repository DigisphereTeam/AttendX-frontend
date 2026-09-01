import { z } from "zod";

export const employeeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Employee name is required"),

  department: z
    .string()
    .min(1, "Department is required"),

  designation: z
    .string()
    .trim()
    .min(1, "Designation is required"),

  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),

  status: z
    .string()
    .min(1, "Status is required"),
});