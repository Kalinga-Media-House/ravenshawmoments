// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/students/StudentGrid.tsx
// Purpose   : Multi-column student directory grid layout
// =============================================================================

import React from "react";
import { DepartmentStudent } from "@/types/department";
import { StudentCard } from "./StudentCard";
import { EmptyDepartmentState } from "../shared/EmptyDepartmentState";

export interface StudentGridProps {
  students: DepartmentStudent[];
  onSelectStudent?: (student: DepartmentStudent) => void;
}

export const StudentGrid: React.FC<StudentGridProps> = ({ students, onSelectStudent }) => {
  if (students.length === 0) {
    return (
      <EmptyDepartmentState
        title="No Students Listed"
        description="There are currently no students displayed in this departmental directory."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {students.map((student) => (
        <StudentCard
          key={student.id}
          student={student}
          onClick={() => onSelectStudent?.(student)}
        />
      ))}
    </div>
  );
};
