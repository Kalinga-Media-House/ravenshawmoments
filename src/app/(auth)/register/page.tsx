"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { RegisterSchema, RegisterFormValues } from "@/features/shared/validation/auth";
import { signUpAction } from "@/app/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      isRavenshawvian: "Yes",
      role: "student",
    },
    mode: "onChange",
  });

  const { formState: { isSubmitting, errors, isValid }, handleSubmit, register, watch, trigger } = form;

  const isRavenshawvian = watch("isRavenshawvian");
  const role = watch("role");

  const handleNextStep = async () => {
    // Validate Step 1 before proceeding
    const step1Valid = await trigger(["fullName", "email", "password", "confirmPassword"]);
    if (step1Valid) {
      setStep(2);
    }
  };

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const res = await signUpAction(data);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Registration successful! Please verify your email.");
        router.push("/verify-email");
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="p-8 bg-card border shadow-2xl rounded-3xl backdrop-blur-sm max-h-[85vh] overflow-y-auto w-full max-w-2xl mx-auto"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Create an Account</h2>
        <p className="text-muted-foreground text-sm">Join the Ravenshaw Moments ecosystem.</p>
      </div>

      <div className="flex items-center justify-center mb-8 gap-2">
        <div className={`h-2 rounded-full flex-1 transition-all ${step === 1 ? 'bg-primary' : 'bg-primary/20'}`} />
        <div className={`h-2 rounded-full flex-1 transition-all ${step === 2 ? 'bg-primary' : 'bg-primary/20'}`} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  {...register("fullName")}
                  className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary outline-none"
                  placeholder="John Doe"
                />
                {errors.fullName && <p className="text-destructive text-xs mt-1">{errors.fullName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <input
                  {...register("email")}
                  type="email"
                  className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary outline-none"
                  placeholder="name@example.com"
                />
                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary outline-none"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary outline-none"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-destructive text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <button
              type="button"
              onClick={handleNextStep}
              className="w-full mt-6 bg-primary text-primary-foreground py-3 rounded-xl font-bold flex items-center justify-center hover:bg-primary/90 transition-all"
            >
              Next Step <ChevronRight className="ml-2 w-5 h-5" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium mb-2">Are you a Ravenshawvian?</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="radio" value="Yes" {...register("isRavenshawvian")} className="text-primary focus:ring-primary" />
                  Yes
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" value="No" {...register("isRavenshawvian")} className="text-primary focus:ring-primary" />
                  No
                </label>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {isRavenshawvian === "Yes" ? (
                <motion.div key="yes" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Your Role</label>
                    <select {...register("role")} className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary outline-none">
                      <option value="student">Student</option>
                      <option value="alumni">Alumni</option>
                      <option value="teacher">Teacher</option>
                    </select>
                  </div>

                  {(role === "student" || role === "alumni") && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Level</label>
                        <select {...register("level")} className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary outline-none">
                          <option value="">Select Level...</option>
                          <option value="+2">+2 (Higher Secondary)</option>
                          <option value="UG">Undergraduate (UG)</option>
                          <option value="PG">Postgraduate (PG)</option>
                          <option value="PhD">Doctorate (PhD)</option>
                        </select>
                        {errors.level && <p className="text-destructive text-xs mt-1">{errors.level.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Batch Year (Entry - Exit)</label>
                        <input {...register("batch")} placeholder="e.g. 2020-2023" className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary outline-none" />
                        {errors.batch && <p className="text-destructive text-xs mt-1">{errors.batch.message}</p>}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Department</label>
                      <select {...register("department")} className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary outline-none">
                        <option value="">Select Department...</option>
                        <option value="Botany">Botany</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Physics">Physics</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="English">English</option>
                        <option value="Economics">Economics</option>
                        <option value="Commerce">Commerce</option>
                        <option value="Zoology">Zoology</option>
                        <option value="History">History</option>
                        <option value="Political Science">Political Science</option>
                        {/* Will populate full list dynamically later */}
                      </select>
                      {errors.department && <p className="text-destructive text-xs mt-1">{errors.department.message}</p>}
                    </div>
                    {role === "student" && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Hostel (Optional)</label>
                        <select {...register("hostel")} className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary outline-none">
                          <option value="">Day Scholar (None)</option>
                          <option value="EAST HOSTEL">EAST HOSTEL</option>
                          <option value="WEST HOSTEL">WEST HOSTEL</option>
                          <option value="Parija">Parija</option>
                          <option value="Kathajodi">Kathajodi</option>
                        </select>
                      </div>
                    )}
                    {role === "alumni" && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Current Profession (Optional)</label>
                        <input {...register("currentProfession")} placeholder="Software Engineer" className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary outline-none" />
                      </div>
                    )}
                  </div>

                  {role === "student" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Gender</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2"><input type="radio" value="male" {...register("gender")} className="text-primary focus:ring-primary" /> Male</label>
                        <label className="flex items-center gap-2"><input type="radio" value="female" {...register("gender")} className="text-primary focus:ring-primary" /> Female</label>
                        <label className="flex items-center gap-2"><input type="radio" value="other" {...register("gender")} className="text-primary focus:ring-primary" /> Other</label>
                      </div>
                      {errors.gender && <p className="text-destructive text-xs mt-1">{errors.gender.message}</p>}
                    </div>
                  )}

                  {role === "teacher" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Designation</label>
                        <select {...register("designation")} className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary outline-none">
                          <option value="">Select Designation...</option>
                          <option value="Assistant Professor">Assistant Professor</option>
                          <option value="Associate Professor">Associate Professor</option>
                          <option value="Professor">Professor</option>
                          <option value="Guest Faculty">Guest Faculty</option>
                        </select>
                        {errors.designation && <p className="text-destructive text-xs mt-1">{errors.designation.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Joining Year</label>
                        <input {...register("joiningYear")} placeholder="e.g. 2015" className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary outline-none" />
                        {errors.joiningYear && <p className="text-destructive text-xs mt-1">{errors.joiningYear.message}</p>}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div key="no" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">University / College Name</label>
                    <input {...register("universityName")} placeholder="e.g. Utkal University" className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary outline-none" />
                    {errors.universityName && <p className="text-destructive text-xs mt-1">{errors.universityName.message}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Your Role</label>
                      <select {...register("role")} className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary outline-none">
                        <option value="student">Student</option>
                        <option value="alumni">Alumni</option>
                        <option value="teacher">Teacher</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Level</label>
                      <select {...register("level")} className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary outline-none">
                        <option value="">Select Level...</option>
                        <option value="+2">+2 (Higher Secondary)</option>
                        <option value="UG">Undergraduate (UG)</option>
                        <option value="PG">Postgraduate (PG)</option>
                        <option value="PhD">Doctorate (PhD)</option>
                      </select>
                      {errors.level && <p className="text-destructive text-xs mt-1">{errors.level.message}</p>}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-4 border-t">
              <label className="flex items-start gap-3">
                <input type="checkbox" {...register("termsAccepted")} className="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary" />
                <span className="text-sm text-muted-foreground">
                  I agree to the <Link href="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
                </span>
              </label>
              {errors.termsAccepted && <p className="text-destructive text-xs mt-1">{errors.termsAccepted.message}</p>}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 bg-muted text-foreground py-3 rounded-xl font-bold flex items-center justify-center hover:bg-muted/80 transition-all"
              >
                <ChevronLeft className="mr-2 w-5 h-5" /> Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="w-2/3 bg-primary text-primary-foreground py-3 rounded-xl font-bold flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : "Complete Registration"}
              </button>
            </div>
          </motion.div>
        )}
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Sign In
        </Link>
      </div>
    </motion.div>
  );
}