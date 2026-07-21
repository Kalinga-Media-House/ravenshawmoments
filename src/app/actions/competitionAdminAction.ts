"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { competitionDraftSchema, CompetitionDraftValues } from "@/features/competition/schema/adminCompetitionSchema";
import { saveCompetitionAtomic } from "@/features/competition/services/competitionAdminService";
import { CompetitionCategoryPortalService } from "@/features/competition/services/competitionCategoryPortalService";
import { createClient } from "@/lib/supabase/server";

export type ActionResponse = {
  success: boolean;
  message: string;
  id?: string;
  errors?: z.ZodIssue[];
};

export async function saveCompetitionAction(competitionId: string | undefined, data: unknown): Promise<ActionResponse> {
  try {
    // 1. Validate Input using Draft Schema
    const parsed = competitionDraftSchema.safeParse(data);
    
    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: parsed.error.issues,
      };
    }

    // 2. Call Service with Atomic Save
    const id = await saveCompetitionAtomic(parsed.data, competitionId);

    // 3. Revalidate Paths
    revalidatePath("/admin/competitions");
    if (competitionId) {
      revalidatePath(`/admin/competitions/${competitionId}`);
    }
    
    return {
      success: true,
      message: "Competition saved successfully.",
      id,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An unexpected error occurred while saving the competition.",
    };
  }
}

export async function getActiveCompetitionCategoriesAction() {
  try {
    const categories = await CompetitionCategoryPortalService.getActiveCategories();
    return {
      success: true,
      data: categories.map(c => ({ id: c.id, name: c.name })),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch categories",
    };
  }
}

export async function getOrganizersListAction(type: "department" | "hostel" | "organization") {
  try {
    const supabase = await createClient();
    const table = type + "s";
    
    let query = supabase.from(table).select("id, name").eq("is_active", true);
    
    // According to existing schema and business rules, valid student organizations must be verified.
    if (type === "organization") {
      query = query.eq("is_verified", true);
    }
    
    const { data, error } = await query.order("name");
    
    if (error) {
      throw error;
    }
    
    return {
      success: true,
      data: data.map((item: any) => ({ id: item.id, name: item.name })),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || `Failed to fetch ${type}s`,
    };
  }
}
