import { BaseRepository } from "../base.repository";
import { Database } from "@/types/database.types";
import { DatabaseError } from "@/lib/errors";

export type HostelRoomRow = Database["public"]["Tables"]["hostel_rooms"]["Row"];
export type HostelBedRow = Database["public"]["Tables"]["hostel_beds"]["Row"];
export type HostelRoomAllocationRow = Database["public"]["Tables"]["hostel_room_allocations"]["Row"];

export class HostelRoomRepository extends BaseRepository<HostelRoomRow> {
  // @ts-ignore
  protected tableName: keyof Database["public"]["Tables"] = "hostel_rooms";

  async getRoomsByHostelId(hostelId: string): Promise<HostelRoomRow[]> {
    const { data, error } = await (this.supabase as any)
      .from(this.tableName)
      .select("*")
      .eq("hostel_id", hostelId)
      .order("floor_number", { ascending: true })
      .order("room_number", { ascending: true });

    if (error) throw new DatabaseError("Failed to fetch rooms", error);
    return data as HostelRoomRow[];
  }
}

export class HostelBedRepository extends BaseRepository<HostelBedRow> {
  // @ts-ignore
  protected tableName: keyof Database["public"]["Tables"] = "hostel_beds";

  async getBedsByRoomId(roomId: string): Promise<HostelBedRow[]> {
    const { data, error } = await (this.supabase as any)
      .from(this.tableName)
      .select("*")
      .eq("room_id", roomId)
      .order("bed_number", { ascending: true });

    if (error) throw new DatabaseError("Failed to fetch beds", error);
    return data as HostelBedRow[];
  }
}

export class HostelRoomAllocationRepository extends BaseRepository<HostelRoomAllocationRow> {
  // @ts-ignore
  protected tableName: keyof Database["public"]["Tables"] = "hostel_room_allocations";

  async getActiveAllocationsByHostel(hostelId: string): Promise<HostelRoomAllocationRow[]> {
    const { data, error } = await (this.supabase as any)
      .from(this.tableName)
      .select("*, profile:profile_id(*)")
      .eq("hostel_id", hostelId)
      .eq("status", "active");

    if (error) throw new DatabaseError("Failed to fetch active allocations", error);
    return data as HostelRoomAllocationRow[];
  }
}
