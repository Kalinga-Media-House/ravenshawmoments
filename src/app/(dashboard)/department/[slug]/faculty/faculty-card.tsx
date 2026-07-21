'use client';

import { useState, useTransition } from 'react';
import { MoreVertical, Edit2, Trash2, Shield, User } from 'lucide-react';
import { FacultyForm } from './faculty-form';
import { deleteFaculty } from '@/actions/department/faculty.actions';
import { toast } from 'sonner';

export function FacultyCard({ member, slug }: { member: any; slug: string }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this faculty member?')) {
      startTransition(async () => {
        // @ts-ignore
        const result = await deleteFaculty(member.id);
        if (result.success) {
          toast.success('Faculty removed');
        } else {
          toast.error(result.error || 'Failed to remove faculty');
        }
      });
    }
  };

  return (
    <div className="bg-[#1A1214] border border-[#2D1F23] rounded-xl overflow-hidden hover:border-[#7C2D3E]/50 transition-colors relative group">
      <div className="absolute top-3 right-3 z-10">
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-1.5 text-[#8B7078] hover:text-[#F5E6EA] bg-[#0F0A0B]/80 backdrop-blur rounded-md border border-[#2D1F23] hover:border-[#7C2D3E] transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showDropdown && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 mt-1 w-48 bg-[#1A1214] border border-[#2D1F23] rounded-lg shadow-xl z-20 py-1 overflow-hidden">
                <FacultyForm 
                  slug={slug}
                  initialData={member}
                  trigger={
                    <button className="w-full text-left px-4 py-2 text-sm text-[#F5E6EA] hover:bg-[#2D1F23] flex items-center gap-2 transition-colors">
                      <Edit2 className="w-4 h-4" />
                      Edit Details
                    </button>
                  }
                />
                
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-[#F5E6EA] hover:bg-[#2D1F23] flex items-center gap-2 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  Assign Roles
                </button>
                
                <div className="h-px bg-[#2D1F23] my-1" />
                
                <button 
                  onClick={handleDelete}
                  disabled={isPending}
                  className="w-full text-left px-4 py-2 text-sm text-[#9B3A4D] hover:bg-[#9B3A4D]/10 flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-[#2D1F23] rounded-full border-2 border-[#1A1214] shadow-lg mb-3 flex items-center justify-center overflow-hidden">
          {member.avatar_url ? (
            <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8 text-[#8B7078]" />
          )}
        </div>
        
        <h3 className="text-[#F5E6EA] font-semibold truncate w-full">{member.name}</h3>
        <p className="text-[#7C2D3E] text-sm font-medium mb-2">{member.designation}</p>
        
        {member.qualification && (
          <p className="text-[#8B7078] text-xs mb-3 line-clamp-1">{member.qualification}</p>
        )}
        
        {member.research_areas && (
          <div className="flex flex-wrap gap-1 justify-center mt-auto">
            {member.research_areas.split(',').slice(0, 2).map((area: string, i: number) => (
              <span key={i} className="text-[10px] bg-[#0F0A0B] text-[#8B7078] px-2 py-1 rounded-full border border-[#2D1F23]">
                {area.trim()}
              </span>
            ))}
            {member.research_areas.split(',').length > 2 && (
              <span className="text-[10px] bg-[#0F0A0B] text-[#8B7078] px-2 py-1 rounded-full border border-[#2D1F23]">
                +{member.research_areas.split(',').length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
