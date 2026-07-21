'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { createFaculty, updateFaculty } from '@/actions/department/faculty.actions';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useDepartmentAdmin } from '../context';

const facultySchema = z.object({
  profile_id: z.string().optional(),
  name: z.string().min(2, 'Name is required'),
  designation: z.string().min(2, 'Designation is required'),
  qualification: z.string().optional(),
  research_areas: z.string().optional(),
  display_order: z.coerce.number().default(0),
});

type FacultyFormValues = z.infer<typeof facultySchema>;

export function FacultyForm({
  slug,
  initialData,
  trigger
}: {
  slug: string;
  initialData?: any;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const adminCtx = useDepartmentAdmin();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FacultyFormValues>({
    // @ts-ignore
    resolver: zodResolver(facultySchema),
    defaultValues: {
      profile_id: initialData?.profile_id || '',
      name: initialData?.name || '',
      designation: initialData?.designation || '',
      qualification: initialData?.qualification || '',
      research_areas: initialData?.research_areas || '',
      display_order: initialData?.display_order || 0,
    },
  });

  const onSubmit = (data: FacultyFormValues) => {
    startTransition(async () => {
      const result = initialData
        // @ts-ignore
        ? await updateFaculty(initialData.id, { ...data, departmentId: adminCtx?.departmentId })
        // @ts-ignore
        : await createFaculty({ ...data, departmentId: adminCtx?.departmentId, slug });
        
      if (result.success) {
        toast.success(initialData ? 'Faculty updated' : 'Faculty added');
        setOpen(false);
        reset();
      } else {
        toast.error(result.error || 'Something went wrong');
      }
    });
  };

  return (
    <>
      <div onClick={() => setOpen(true)}>
        {trigger ? (
          trigger
        ) : (
          <button className="flex items-center gap-2 bg-[#7C2D3E] hover:bg-[#9B3A4D] text-[#F5E6EA] px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-[#9B3A4D]">
            <PlusCircle className="w-4 h-4" />
            Add Faculty
          </button>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1A1214] border border-[#2D1F23] rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#2D1F23] flex justify-between items-center">
              <h2 className="text-lg font-semibold text-[#F5E6EA]">
                {initialData ? 'Edit Faculty' : 'Add Faculty'}
              </h2>
              <button 
                onClick={() => setOpen(false)}
                className="text-[#8B7078] hover:text-[#F5E6EA] transition-colors"
              >
                ✕
              </button>
            </div>
            
            // @ts-ignore
            <form onSubmit={handleSubmit(onSubmit as any)} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-[#8B7078] mb-1">Name</label>
                  <input
                    {...register('name')}
                    className="w-full bg-[#0F0A0B] border border-[#2D1F23] rounded-lg px-3 py-2 text-sm text-[#F5E6EA] focus:outline-none focus:border-[#7C2D3E] transition-colors"
                    placeholder="Dr. Jane Doe"
                  />
                  {errors.name && <p className="text-[#9B3A4D] text-xs mt-1">{errors.name.message}</p>}
                </div>
                
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-[#8B7078] mb-1">Designation</label>
                  <input
                    {...register('designation')}
                    className="w-full bg-[#0F0A0B] border border-[#2D1F23] rounded-lg px-3 py-2 text-sm text-[#F5E6EA] focus:outline-none focus:border-[#7C2D3E] transition-colors"
                    placeholder="Professor"
                  />
                  {errors.designation && <p className="text-[#9B3A4D] text-xs mt-1">{errors.designation.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8B7078] mb-1">Qualification</label>
                <textarea
                  {...register('qualification')}
                  rows={2}
                  className="w-full bg-[#0F0A0B] border border-[#2D1F23] rounded-lg px-3 py-2 text-sm text-[#F5E6EA] focus:outline-none focus:border-[#7C2D3E] transition-colors resize-none"
                  placeholder="Ph.D. in Computer Science"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8B7078] mb-1">Research Areas</label>
                <textarea
                  {...register('research_areas')}
                  rows={2}
                  className="w-full bg-[#0F0A0B] border border-[#2D1F23] rounded-lg px-3 py-2 text-sm text-[#F5E6EA] focus:outline-none focus:border-[#7C2D3E] transition-colors resize-none"
                  placeholder="Machine Learning, AI, Data Science"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8B7078] mb-1">Display Order</label>
                <input
                  type="number"
                  {...register('display_order')}
                  className="w-full bg-[#0F0A0B] border border-[#2D1F23] rounded-lg px-3 py-2 text-sm text-[#F5E6EA] focus:outline-none focus:border-[#7C2D3E] transition-colors"
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-[#F5E6EA] bg-[#2D1F23] hover:bg-[#2D1F23]/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#F5E6EA] bg-[#7C2D3E] hover:bg-[#9B3A4D] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {initialData ? 'Update Faculty' : 'Add Faculty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
