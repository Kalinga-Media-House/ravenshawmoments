"use client";

import React, { useState } from "react";
import { createComplaintAction } from "@/app/actions/hostel/complaintActions";
import { createVisitorAction } from "@/app/actions/hostel/visitorActions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function StudentHostelClient({ hostelId, initialComplaints, initialVisitors }: { hostelId: string, initialComplaints: any[], initialVisitors: any[] }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleComplaint = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const fd = new FormData(e.currentTarget);
    fd.append("hostel_id", hostelId);
    const res = await createComplaintAction(fd);
    if (res.success) {
      toast.success(res.message);
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error(res.message);
    }
    setIsLoading(false);
  };

  const handleVisitor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const fd = new FormData(e.currentTarget);
    fd.append("hostel_id", hostelId);
    const res = await createVisitorAction(fd);
    if (res.success) {
      toast.success(res.message);
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error(res.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Complaints Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-bold mb-4">Raise a Complaint</h2>
        <form onSubmit={handleComplaint} className="space-y-4">
          <input name="title" required placeholder="Issue Title" className="w-full border p-2 rounded" />
          <select name="category" className="w-full border p-2 rounded">
            <option value="electrical">Electrical</option>
            <option value="plumbing">Plumbing</option>
            <option value="carpentry">Carpentry</option>
            <option value="cleaning">Cleaning</option>
            <option value="internet">Internet</option>
            <option value="mess">Mess</option>
            <option value="discipline">Discipline</option>
            <option value="other">Other</option>
          </select>
          <select name="priority" className="w-full border p-2 rounded">
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <textarea name="description" required placeholder="Describe the issue..." className="w-full border p-2 rounded" rows={3}></textarea>
          <Button type="submit" disabled={isLoading} className="w-full">Submit Complaint</Button>
        </form>

        <div className="mt-8">
          <h3 className="font-semibold mb-2">My Complaints</h3>
          <ul className="space-y-2 text-sm">
            {initialComplaints.map(c => (
              <li key={c.id} className="p-3 bg-gray-50 rounded border flex justify-between">
                <span>{c.title}</span>
                <span className="capitalize text-gray-500">{c.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Visitors Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-bold mb-4">Request Visitor Entry</h2>
        <form onSubmit={handleVisitor} className="space-y-4">
          <input name="visitor_name" required placeholder="Visitor Name" className="w-full border p-2 rounded" />
          <input name="visitor_contact" placeholder="Contact Number" className="w-full border p-2 rounded" />
          <input name="purpose" required placeholder="Purpose of Visit" className="w-full border p-2 rounded" />
          <input type="datetime-local" name="expected_arrival" className="w-full border p-2 rounded" />
          <Button type="submit" disabled={isLoading} className="w-full">Request Entry</Button>
        </form>

        <div className="mt-8">
          <h3 className="font-semibold mb-2">My Visitors</h3>
          <ul className="space-y-2 text-sm">
            {initialVisitors.map(v => (
              <li key={v.id} className="p-3 bg-gray-50 rounded border flex justify-between">
                <span>{v.visitor_name}</span>
                <span className="capitalize text-gray-500">{v.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
