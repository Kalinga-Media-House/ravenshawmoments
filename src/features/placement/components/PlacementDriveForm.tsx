'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createDriveAction, updateDriveAction } from '../actions/placement.actions';
import { toast } from 'sonner';

export function PlacementDriveForm({ companies = [], initialData = null }: { companies: any[], initialData?: any }) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const driveData = {
      company_id: formData.get('company_id') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      job_type: formData.get('job_type') as string,
      salary_package: formData.get('salary_package') as string,
      min_cgpa: parseFloat(formData.get('min_cgpa') as string) || 0,
      max_backlogs: parseInt(formData.get('max_backlogs') as string) || 0,
      status: formData.get('status') as string,
      application_deadline: formData.get('application_deadline') as string || null,
    };

    startTransition(async () => {
      let result;
      if (initialData?.id) {
        result = await updateDriveAction(initialData.id, driveData);
      } else {
        result = await createDriveAction(driveData);
      }

      if (result.success) {
        toast.success(initialData ? 'Drive updated successfully' : 'Drive created successfully');
        if (!initialData) {
          (e.target as HTMLFormElement).reset();
        }
      } else {
        toast.error(result.error || 'Failed to save drive');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Company</label>
          <select 
            name="company_id" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            defaultValue={initialData?.company_id || ""}
            required
          >
            <option value="" disabled>Select a company</option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Title / Role</label>
          <Input name="title" defaultValue={initialData?.title} required placeholder="Software Engineer" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Job Type</label>
          <select 
            name="job_type" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            defaultValue={initialData?.job_type || "full_time"}
            required
          >
            <option value="full_time">Full Time</option>
            <option value="internship">Internship</option>
            <option value="contract">Contract</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Salary Package</label>
          <Input name="salary_package" defaultValue={initialData?.salary_package} placeholder="12 LPA" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Min CGPA</label>
          <Input type="number" step="0.1" name="min_cgpa" defaultValue={initialData?.min_cgpa} placeholder="7.0" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Max Backlogs</label>
          <Input type="number" name="max_backlogs" defaultValue={initialData?.max_backlogs} placeholder="0" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <select 
            name="status" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            defaultValue={initialData?.status || "draft"}
            required
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="registration_open">Registration Open</option>
            <option value="registration_closed">Registration Closed</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Application Deadline</label>
          <Input type="datetime-local" name="application_deadline" defaultValue={initialData?.application_deadline ? new Date(initialData.application_deadline).toISOString().slice(0, 16) : ""} />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea name="description" defaultValue={initialData?.description} rows={5} placeholder="Job details and requirements..." />
      </div>

      <Button type="submit" disabled={isPending} className="w-full bg-[#800000] hover:bg-red-900 text-white">
        {isPending ? 'Saving...' : (initialData ? 'Update Drive' : 'Create Drive')}
      </Button>
    </form>
  );
}
