"use client";

import React, { useState } from "react";
import { updateMessMenuAction } from "@/app/actions/hostel/messActions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEAL_TYPES = ["breakfast", "lunch", "snacks", "dinner"];

export function MessMenuClient({ hostelId, initialMenu }: { hostelId: string, initialMenu: any[] }) {
  const [menu, setMenu] = useState<any[]>(initialMenu);
  const [isLoading, setIsLoading] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const getMenu = (dayIndex: number, type: string) => {
    return menu.find(m => m.day_of_week === dayIndex && m.meal_type === type)?.items || "";
  };

  const handleSave = async (dayIndex: number, type: string) => {
    if (editValue.trim() === "") return;
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append("hostel_id", hostelId);
    formData.append("day_of_week", dayIndex.toString());
    formData.append("meal_type", type);
    formData.append("items", editValue);

    const res = await updateMessMenuAction(formData);
    if (res.success) {
      toast.success(res.message);
      // Optimistic update
      setMenu(prev => {
        const copy = [...prev];
        const existing = copy.findIndex(m => m.day_of_week === dayIndex && m.meal_type === type);
        if (existing > -1) {
          copy[existing].items = editValue;
        } else {
          copy.push({ day_of_week: dayIndex, meal_type: type, items: editValue });
        }
        return copy;
      });
      setEditingKey(null);
    } else {
      toast.error(res.message);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-900 min-w-[120px]">Day</th>
              {MEAL_TYPES.map(type => (
                <th key={type} className="p-4 font-semibold text-gray-900 capitalize min-w-[200px]">
                  {type}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {DAYS.map((dayName, dayIndex) => (
              <tr key={dayIndex} className="hover:bg-gray-50/50">
                <td className="p-4 font-medium text-gray-900 bg-gray-50/30">
                  {dayName}
                </td>
                {MEAL_TYPES.map(type => {
                  const key = `${dayIndex}-${type}`;
                  const isEditing = editingKey === key;
                  const currentItems = getMenu(dayIndex, type);

                  return (
                    <td key={type} className="p-4">
                      {isEditing ? (
                        <div className="space-y-2">
                          <textarea
                            className="w-full text-sm border rounded-md p-2 min-h-[80px]"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            placeholder="e.g. Dosa, Chutney, Tea"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleSave(dayIndex, type)} 
                              disabled={isLoading}
                              className="w-full"
                            >
                              <Save className="w-3 h-3 mr-2" /> Save
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => setEditingKey(null)}
                              disabled={isLoading}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="min-h-[80px] p-2 border border-transparent hover:border-gray-200 hover:bg-white rounded-md cursor-text transition-colors text-gray-700 whitespace-pre-wrap"
                          onClick={() => {
                            setEditingKey(key);
                            setEditValue(currentItems);
                          }}
                        >
                          {currentItems || <span className="text-gray-400 italic">Click to edit...</span>}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
