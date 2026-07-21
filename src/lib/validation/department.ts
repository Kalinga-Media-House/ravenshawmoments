import { z } from "zod";
import { uuidSchema, slugSchema } from "./common";

export const createDepartmentSchema = z.object({
  name: z.string().min(3).max(255),
  slug: slugSchema,
  shortName: z.string().max(50).optional(),
  establishedYear: z.number().int().min(1868).max(new Date().getFullYear()).optional(),
  vision: z.string().max(2000).optional(),
  mission: z.string().max(2000).optional(),
  academicExcellence: z.string().max(2000).optional(),
  isActive: z.boolean().default(true),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();

export const departmentSettingsSchema = z.object({
  themeColor: z.string().max(30).optional(),
  layoutStyle: z.string().max(30).optional(),
  isAcceptingAdmissions: z.boolean().optional(),
  showFacultyProfiles: z.boolean().optional(),
  showStudentProfiles: z.boolean().optional(),
  customCss: z.string().optional(),
});
