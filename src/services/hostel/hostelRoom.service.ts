import {
  HostelRoomRepository,
  HostelBedRepository,
  HostelRoomAllocationRepository,
  HostelRoomRow,
  HostelBedRow,
  HostelRoomAllocationRow,
} from "@/repositories/hostel/hostelRoom.repository";
import { HostelRepository } from "@/repositories/hostel/hostel.repository";
import { RepositoryContext } from "@/repositories/repository.types";

export class HostelRoomService {
  private roomRepo: HostelRoomRepository;
  private bedRepo: HostelBedRepository;
  private allocationRepo: HostelRoomAllocationRepository;
  private hostelRepo: HostelRepository;

  constructor(context: RepositoryContext) {
    this.roomRepo = new HostelRoomRepository(context);
    this.bedRepo = new HostelBedRepository(context);
    this.allocationRepo = new HostelRoomAllocationRepository(context);
    this.hostelRepo = new HostelRepository(context);
  }

  async getRoomsWithBeds(hostelId: string) {
    const rooms = await this.roomRepo.getRoomsByHostelId(hostelId);
    
    const roomsWithBeds = await Promise.all(
      rooms.map(async (room) => {
        const beds = await this.bedRepo.getBedsByRoomId(room.id);
        return { ...room, beds };
      })
    );

    return roomsWithBeds;
  }

  async allocateBed(
    hostelId: string,
    roomId: string,
    bedId: string,
    profileId: string
  ): Promise<HostelRoomAllocationRow> {
    const bed = await this.bedRepo.findById(bedId);
    if (!bed || bed.is_occupied) {
      throw new Error("Bed is not available or does not exist.");
    }

    const allocation = await this.allocationRepo.create({
      hostel_id: hostelId,
      room_id: roomId,
      bed_id: bedId,
      profile_id: profileId,
      status: "active",
      allocation_date: new Date().toISOString(),
    });

    await this.bedRepo.update(bedId, { is_occupied: true });

    const room = await this.roomRepo.findById(roomId);
    if (room) {
      await this.roomRepo.update(roomId, {
        current_occupancy: (room.current_occupancy || 0) + 1,
      });
    }

    const hostel = await this.hostelRepo.findById(hostelId);
    if (hostel) {
      await this.hostelRepo.update(hostelId, {
        current_occupancy: (hostel.current_occupancy || 0) + 1,
      });
    }

    return allocation;
  }

  async deallocateBed(allocationId: string): Promise<void> {
    const allocation = await this.allocationRepo.findById(allocationId);
    if (!allocation || allocation.status !== "active") {
      throw new Error("Allocation not found or already inactive.");
    }

    await this.allocationRepo.update(allocationId, {
      status: "completed",
      vacating_date: new Date().toISOString(),
    });

    if (allocation.bed_id) {
      await this.bedRepo.update(allocation.bed_id, { is_occupied: false });
    }

    const room = await this.roomRepo.findById(allocation.room_id);
    if (room && room.current_occupancy > 0) {
      await this.roomRepo.update(allocation.room_id, {
        current_occupancy: room.current_occupancy - 1,
      });
    }

    const hostel = await this.hostelRepo.findById(allocation.hostel_id);
    if (hostel && (hostel.current_occupancy || 0) > 0) {
      await this.hostelRepo.update(allocation.hostel_id, {
        current_occupancy: (hostel.current_occupancy || 0) - 1,
      });
    }
  }
}
