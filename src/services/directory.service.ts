import { createClient } from '@/lib/supabase/server';

export const directoryService = {
  // Fetch all departments from Supabase
  getDepartments: async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  },

  // Fetch a single department by slug
  getDepartment: async (slug: string) => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  }
};