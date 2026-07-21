import { NextRequest } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { SearchRepository } from "../../../repositories/department/search.repository";
import { SearchService } from "../../../services/department/search.service";
import { handleApiError, jsonResponse } from "@/app/api/api.helpers";

async function getService() {
  const supabase = await createClient();
  return new SearchService(new SearchRepository({ supabase }));
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("q") || "";
    
    if (query.length < 2) {
      return jsonResponse([], 200);
    }
    
    const service = await getService();
    const data = await service.searchDepartments(query);
    
    return jsonResponse(data, 200);
  } catch (error) {
    return handleApiError(error);
  }
}
