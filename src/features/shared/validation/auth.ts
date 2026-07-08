import { z } from "zod";

export const RegisterSchema = z
  .object({
    fullName: z.string().min(2, "Full Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm Password must be at least 8 characters"),
    isRavenshawvian: z.enum(["Yes", "No"]),

    // Role (Always required for Yes, mapped as "student | alumni | teacher" for No)
    role: z.enum(["student", "alumni", "teacher"]),

    // If Yes -> Student or Alumni or Teacher
    level: z.enum(["+2", "UG", "PG", "PhD"]).optional(),
    department: z.string().optional(),
    batch: z.string().optional(),
    hostel: z.string().optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    currentProfession: z.string().optional(),
    designation: z.string().optional(),
    joiningYear: z.string().optional(),

    // If No ->
    universityName: z.string().optional(),

    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms and Privacy Policy",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }

    if (data.isRavenshawvian === "Yes") {
      if (!data.department) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["department"],
          message: "Department is required for Ravenshawvians",
        });
      }

      if (data.role === "student" || data.role === "alumni") {
        if (!data.level) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["level"],
            message: "Level is required",
          });
        }
        if (!data.batch) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["batch"],
            message: "Batch is required",
          });
        }
      }

      if (data.role === "student" && !data.gender) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["gender"],
          message: "Gender is required for students",
        });
      }

      if (data.role === "teacher") {
        if (!data.designation) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["designation"],
            message: "Designation is required for teachers",
          });
        }
        if (!data.joiningYear) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["joiningYear"],
            message: "Joining Year is required for teachers",
          });
        }
      }
    } else {
      // isRavenshawvian === "No"
      if (!data.universityName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["universityName"],
          message: "University / College Name is required",
        });
      }
      if (!data.level) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["level"],
          message: "Level is required",
        });
      }
    }
  });

export type RegisterFormValues = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().default(false).optional(),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;
