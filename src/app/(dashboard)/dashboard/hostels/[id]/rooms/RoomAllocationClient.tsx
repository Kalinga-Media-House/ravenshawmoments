"use client";

import React, { useState } from "react";
import { BedDouble, AlertCircle, Plus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { allocateBedAction, deallocateBedAction } from "@/app/actions/hostel/roomActions";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

export function RoomAllocationClient({ hostelId, rooms, allocations }: { hostelId: string, rooms: any[], allocations: any[] }) {
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  const [allocatingBedId, setAllocatingBedId] = useState<string | null>(null);
  const [studentId, setStudentId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAllocate = async () => {
    if (!allocatingBedId || !studentId) {
      toast.error("Please provide a student ID.");
      return;
    }
    
    setIsLoading(true);
    const formData = new FormData();
    formData.append("hostel_id", hostelId);
    formData.append("room_id", selectedRoom.id);
    formData.append("bed_id", allocatingBedId);
    formData.append("profile_id", studentId);

    const res = await allocateBedAction(formData);
    if (res.success) {
      toast.success(res.message);
      setAllocatingBedId(null);
      setStudentId("");
    } else {
      toast.error(res.message);
    }
    setIsLoading(false);
  };

  const handleDeallocate = async (allocationId: string) => {
    if (!confirm("Are you sure you want to deallocate this bed?")) return;
    
    setIsLoading(true);
    const res = await deallocateBedAction(allocationId, hostelId);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setIsLoading(false);
  };

  const getAllocationForBed = (bedId: string) => {
    return allocations.find(a => a.bed_id === bedId);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Rooms List */}
      <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[600px] flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-gray-50 font-semibold text-gray-900">
          Rooms Directory
        </div>
        <div className="overflow-y-auto p-4 space-y-2">
          {rooms.map(room => (
            <button
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                selectedRoom?.id === room.id 
                  ? "bg-rose-50 border-rose-200 text-rose-900" 
                  : "bg-white border-gray-200 hover:border-rose-300 hover:bg-rose-50/50"
              }`}
            >
              <div className="font-semibold">Room {room.room_number}</div>
              <div className="text-xs text-gray-500 mt-1 flex justify-between">
                <span>Block: {room.block_name || "Main"}</span>
                <span>{room.current_occupancy} / {room.capacity} Full</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Room Details View */}
      <div className="lg:col-span-2">
        {selectedRoom ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">
              Room {selectedRoom.room_number} Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedRoom.beds?.map((bed: any) => {
                const allocation = getAllocationForBed(bed.id);
                const isOccupied = bed.is_occupied || allocation;

                return (
                  <div key={bed.id} className={`p-4 rounded-xl border ${isOccupied ? "bg-gray-50 border-gray-200" : "bg-emerald-50/30 border-emerald-100"}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center text-sm font-semibold">
                        <BedDouble className={`w-4 h-4 mr-2 ${isOccupied ? "text-gray-400" : "text-emerald-500"}`} />
                        Bed {bed.bed_number}
                      </div>
                      <div>
                        {isOccupied ? (
                          <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full font-medium">Occupied</span>
                        ) : (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">Available</span>
                        )}
                      </div>
                    </div>
                    
                    {isOccupied && allocation?.profile ? (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{allocation.profile.first_name} {allocation.profile.last_name}</p>
                        <p className="text-xs text-gray-500 mb-3">{allocation.profile.roll_number}</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          onClick={() => handleDeallocate(allocation.id)}
                          disabled={isLoading}
                        >
                          <LogOut className="w-3 h-3 mr-2" /> Vacate Bed
                        </Button>
                      </div>
                    ) : !isOccupied ? (
                      <div className="mt-4 pt-4 border-t border-emerald-100">
                        <Dialog>
                          <DialogTrigger>
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="w-full bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => setAllocatingBedId(bed.id)}
                            >
                              <Plus className="w-3 h-3 mr-2" /> Allocate
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Allocate Bed {bed.bed_number}</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              <label className="text-sm font-medium text-gray-700">Student Profile ID</label>
                              <input 
                                type="text" 
                                className="w-full mt-1 p-2 border rounded-md" 
                                placeholder="Enter Profile UUID" 
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                              />
                              <p className="text-xs text-gray-500 mt-2">
                                * Note: In a real system, you would select from a dropdown of unallocated residents.
                              </p>
                            </div>
                            <DialogFooter>
                              <Button disabled={isLoading} onClick={handleAllocate}>Confirm Allocation</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
            {(!selectedRoom.beds || selectedRoom.beds.length === 0) && (
              <div className="text-center py-12 text-gray-500 flex flex-col items-center">
                <AlertCircle className="w-12 h-12 mb-3 text-gray-300" />
                <p>No beds configured for this room.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col items-center justify-center p-12 text-gray-500">
            <BedDouble className="w-16 h-16 text-gray-200 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Select a Room</h3>
            <p className="text-sm">Choose a room from the directory to manage bed allocations.</p>
          </div>
        )}
      </div>

    </div>
  );
}
