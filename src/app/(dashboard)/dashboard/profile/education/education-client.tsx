"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  addEducation,
  updateEducation,
  deleteEducation,
} from "@/actions/student/education.actions";
import { Plus, GraduationCap, Pencil, Trash2, Loader2, X, Building2, Calendar } from "lucide-react";

const educationSchema = z.object({
  institution: z.string().min(2, "Institution is required").max(255),
  degree: z.string().min(2, "Degree is required").max(255),
  fieldOfStudy: z.string().max(255).optional(),
  startYear: z.coerce.number().min(1900).max(new Date().getFullYear() + 5),
  endYear: z.coerce.number().min(1900).max(new Date().getFullYear() + 10).optional(),
  grade: z.string().max(50).optional(),
  description: z.string().max(1000).optional(),
  isCurrent: z.boolean().default(false),
});

type EducationFormData = z.infer<typeof educationSchema>;

interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field_of_study?: string;
  start_year: number;
  end_year?: number;
  grade?: string;
  description?: string;
  is_current?: boolean;
}

interface Props {
  profileId: string;
  initialEducation: EducationEntry[];
}

export function EducationPageClient({ profileId, initialEducation }: Props) {
  const [education, setEducation] = useState<EducationEntry[]>(initialEducation);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const form = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema) as unknown as import("react-hook-form").Resolver<EducationFormData>,
    defaultValues: {
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startYear: new Date().getFullYear(),
      endYear: undefined,
      grade: "",
      description: "",
      isCurrent: false,
    },
  });

  const openCreateForm = () => {
    form.reset({
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startYear: new Date().getFullYear(),
      endYear: undefined,
      grade: "",
      description: "",
      isCurrent: false,
    });
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (entry: EducationEntry) => {
    form.reset({
      institution: entry.institution,
      degree: entry.degree,
      fieldOfStudy: entry.field_of_study || "",
      startYear: entry.start_year,
      endYear: entry.end_year || undefined,
      grade: entry.grade || "",
      description: entry.description || "",
      isCurrent: entry.is_current || false,
    });
    setEditingId(entry.id);
    setShowForm(true);
  };

  const handleSubmit = (data: EducationFormData) => {
    startTransition(async () => {
      if (editingId) {
        const result = await updateEducation(editingId, data);
        if (result.success) {
          setEducation((prev) =>
            prev.map((e: any) =>
              e.id === editingId
                ? {
                    ...e,
                    institution: data.institution,
                    degree: data.degree,
                    field_of_study: data.fieldOfStudy,
                    start_year: data.startYear,
                    end_year: data.endYear,
                    grade: data.grade,
                    description: data.description,
                    is_current: data.isCurrent,
                  }
                : e
            )
          );
          toast.success("Education updated");
          setShowForm(false);
          setEditingId(null);
        } else {
          toast.error(result.error || "Failed to update");
        }
      } else {
        const result = await addEducation(data);
        if (result.success) {
          // @ts-ignore
          setEducation((prev) => [result.data, ...prev]);
          toast.success("Education added");
          setShowForm(false);
        } else {
          toast.error(result.error || "Failed to add");
        }
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteEducation(id);
      if (result.success) {
        setEducation((prev) => prev.filter((e) => e.id !== id));
        toast.success("Education removed");
        setDeleteTarget(null);
      } else {
        toast.error(result.error || "Failed to delete");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Education History</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your academic qualifications and education timeline
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus size={16} />
          Add Education
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              {editingId ? "Edit Education" : "Add Education"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          // @ts-ignore
          <form onSubmit={(e) => { e.preventDefault(); void form.handleSubmit(handleSubmit)(e); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Institution *
                </label>
                <input
                  {...form.register("institution")}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="Ravenshaw University"
                />
                {form.formState.errors.institution && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.institution.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Degree *</label>
                <input
                  {...form.register("degree")}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="Bachelor of Science"
                />
                {form.formState.errors.degree && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.degree.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Field of Study
                </label>
                <input
                  {...form.register("fieldOfStudy")}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="Computer Science"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Grade / CGPA</label>
                <input
                  {...form.register("grade")}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="8.5 CGPA"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Start Year *</label>
                <input
                  type="number"
                  {...form.register("startYear")}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="2020"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">End Year</label>
                <input
                  type="number"
                  {...form.register("endYear")}
                  disabled={form.watch("isCurrent")}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
                  placeholder="2024"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isCurrent"
                {...form.register("isCurrent")}
                className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
              <label htmlFor="isCurrent" className="text-sm text-foreground">
                I am currently studying here
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <textarea
                {...form.register("description")}
                rows={3}
                className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                placeholder="Activities, achievements, coursework..."
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {isPending && <Loader2 size={16} className="animate-spin" />}
                {editingId ? "Save Changes" : "Add Education"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="rounded-lg border border-input px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Education List */}
      {education.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted/20">
            <GraduationCap size={32} className="text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-foreground">No education added</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            Add your educational qualifications to build a complete academic profile.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((entry: any) => (
            <div
              key={entry.id}
              className="group rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/20 hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{entry.degree}</h3>
                    <p className="text-sm text-muted-foreground">{entry.institution}</p>
                    {entry.field_of_study && (
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {entry.field_of_study}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Calendar size={12} />
                      <span>
                        {entry.start_year} –{" "}
                        {entry.is_current
                          ? "Present"
                          : entry.end_year || "N/A"}
                      </span>
                      {entry.grade && (
                        <>
                          <span>•</span>
                          <span>{entry.grade}</span>
                        </>
                      )}
                    </div>
                    {entry.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {entry.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditForm(entry)}
                    className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(entry.id)}
                    className="rounded-md p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Delete Confirmation */}
              {deleteTarget === entry.id && (
                <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/5 p-3 flex items-center justify-between">
                  <p className="text-sm text-destructive">Delete this education entry?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDeleteTarget(null)}
                      className="rounded-md px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      disabled={isPending}
                      className="inline-flex items-center gap-1 rounded-md bg-destructive px-3 py-1 text-xs font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:opacity-50"
                    >
                      {isPending && <Loader2 size={12} className="animate-spin" />}
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
