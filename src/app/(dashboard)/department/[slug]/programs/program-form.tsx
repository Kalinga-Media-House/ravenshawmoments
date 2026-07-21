'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { createProgram, updateProgram } from '@/actions/department/program.actions';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useDepartmentAdmin } from '../context';

const programSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  degree_level: z.enum(['Undergraduate', 'Postgraduate', 'Doctorate', 'Diploma']),
  duration_years: z.coerce.number().min(1, 'Must be at least 1 year').max(10, 'Max 10 years'),
  total_seats: z.coerce.number().min(1, 'Must be at least 1 seat').max(1000, 'Max 1000 seats'),
});

type ProgramFormValues = z.infer<typeof programSchema>;

export function ProgramForm({
  slug,
  departmentId,
  initialData,
  trigger
}: {
  slug: string;
  departmentId: string;
  initialData?: any;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const adminCtx = useDepartmentAdmin();
  
  // Resolve correct departmentId - either from props or context
  const dId = departmentId || adminCtx?.departmentId;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProgramFormValues>({
    // @ts-ignore
    resolver: zodResolver(programSchema),
    defaultValues: {
      name: initialData?.name || '',
      degree_level: initialData?.degree_level || 'Undergraduate',
      duration_years: initialData?.duration_years || 3,
      total_seats: initialData?.total_seats || 60,
    },
  });

  const onSubmit = (data: ProgramFormValues) => {
    startTransition(async () => {
      const result = initialData
        // @ts-ignore
        ? await updateProgram(initialData.id, { ...data, departmentId: dId })
        // @ts-ignore
        : await createProgram({ ...data, departmentId: dId, slug });
        
      if (result.success) {
        toast.success(initialData ? 'Program updated' : 'Program created');
        setOpen(false);
        reset();
      } else {
        // @ts-ignore
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
            Add Program
          </button>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1A1214] border border-[#2D1F23] rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#2D1F23] flex justify-between items-center">
              <h2 className="text-lg font-semibold text-[#F5E6EA]">
                {initialData ? 'Edit Program' : 'Create Program'}
              </h2>
              <button 
                onClick={() => setOpen(false)}
                className="text-[#8B7078] hover:text-[#F5E6EA] transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* @ts-ignore */}
            <form onSubmit={handleSubmit(onSubmit as any)} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#8B7078] mb-1">Program Name</label>
                <input
                  {...register('name')}
                  className="w-full bg-[#0F0A0B] border border-[#2D1F23] rounded-lg px-3 py-2 text-sm text-[#F5E6EA] focus:outline-none focus:border-[#7C2D3E] transition-colors"
                  placeholder="e.g. B.Sc. Computer Science"
                />
                {errors.name && <p className="text-[#9B3A4D] text-xs mt-1">{errors.name.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#8B7078] mb-1">Degree Level</label>
                <select
                  {...register('degree_level')}
                  className="w-full bg-[#0F0A0B] border border-[#2D1F23] rounded-lg px-3 py-2 text-sm text-[#F5E6EA] focus:outline-none focus:border-[#7C2D3E] transition-colors"
                >
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="Doctorate">Doctorate</option>
                  <option value="Diploma">Diploma</option>
                </select>
                {errors.degree_level && <p className="text-[#9B3A4D] text-xs mt-1">{errors.degree_level.message}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#8B7078] mb-1">Duration (Years)</label>
                  <input
                    type="number"
                    {...register('duration_years')}
                    className="w-full bg-[#0F0A0B] border border-[#2D1F23] rounded-lg px-3 py-2 text-sm text-[#F5E6EA] focus:outline-none focus:border-[#7C2D3E] transition-colors"
                  />
                  {errors.duration_years && <p className="text-[#9B3A4D] text-xs mt-1">{errors.duration_years.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#8B7078] mb-1">Total Seats</label>
                  <input
                    type="number"
                    {...register('total_seats')}
                    className="w-full bg-[#0F0A0B] border border-[#2D1F23] rounded-lg px-3 py-2 text-sm text-[#F5E6EA] focus:outline-none focus:border-[#7C2D3E] transition-colors"
                  />
                  {errors.total_seats && <p className="text-[#9B3A4D] text-xs mt-1">{errors.total_seats.message}</p>}
                </div>
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
                  {initialData ? 'Update Program' : 'Create Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
