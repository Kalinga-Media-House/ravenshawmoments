import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function DepartmentNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8">
      <div className="max-w-md text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#7C2D3E]/10 border border-[#7C2D3E]/20">
          <FileQuestion size={32} className="text-[#9B3A4D]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-[#F5E6EA]">Department Not Found</h2>
          <p className="text-sm text-[#8B7078]">
            The department you are looking for does not exist or has been archived.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#7C2D3E] to-[#9B3A4D] px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
