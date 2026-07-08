// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/teachers/TeacherGrid.tsx
// Purpose   : Responsive grid layout for departmental faculty roster
// =============================================================================

import React from "react";
import { DepartmentTeacher } from "@/types/department";
import { TeacherCard } from "./TeacherCard";
import { EmptyDepartmentState } from "../shared/EmptyDepartmentState";

export interface TeacherGridProps {
  teachers: DepartmentTeacher[];
  onSelectTeacher?: (teacher: DepartmentTeacher) => void;
}

export const TeacherGrid: React.FC<TeacherGridProps> = ({ teachers, onSelectTeacher }) => {
  if (teachers.length === 0) {
    return (
      <EmptyDepartmentState
        title="Faculty Roster Empty"
        description="No faculty members have been assigned to this department yet."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {teachers.map((teacher) => (
        <TeacherCard
          key={teacher.id}
          teacher={teacher}
          onClick={() => onSelectTeacher?.(teacher)}
        />
      ))}
    </div>
  );
};
