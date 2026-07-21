import { createClient } from "@/lib/supabase/server";
import { CompetitionSponsor, CompetitionAnnouncement, CompetitionCertificate } from "../types/extended-database.types";

export const sponsorService = {
  async getSponsors(competitionId: string) {
    const supabase = await createClient() as any;
    const { data, error } = await supabase
      .from("competition_sponsors")
      .select("*")
      .eq("competition_id", competitionId)
      .order("created_at", { ascending: true });
      
    if (error) throw error;
    return data as CompetitionSponsor[];
  },

  async addSponsor(sponsor: Partial<CompetitionSponsor>) {
    const supabase = await createClient() as any;
    const { data, error } = await supabase
      .from("competition_sponsors")
      .insert(sponsor)
      .select()
      .single();
      
    if (error) throw error;
    return data as CompetitionSponsor;
  },

  async updateSponsor(id: string, updates: Partial<CompetitionSponsor>) {
    const supabase = await createClient() as any;
    const { data, error } = await supabase
      .from("competition_sponsors")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
      
    if (error) throw error;
    return data as CompetitionSponsor;
  },

  async removeSponsor(id: string) {
    const supabase = await createClient() as any;
    const { error } = await supabase
      .from("competition_sponsors")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return true;
  }
};

export const announcementService = {
  async getAnnouncements(competitionId: string) {
    const supabase = await createClient() as any;
    const { data, error } = await supabase
      .from("competition_announcements")
      .select("*, publisher:profiles(full_name)")
      .eq("competition_id", competitionId)
      .order("published_at", { ascending: false });
      
    if (error) throw error;
    return data;
  },

  async addAnnouncement(announcement: Partial<CompetitionAnnouncement>) {
    const supabase = await createClient() as any;
    const { data, error } = await supabase
      .from("competition_announcements")
      .insert(announcement)
      .select()
      .single();
      
    if (error) throw error;
    return data as CompetitionAnnouncement;
  },

  async removeAnnouncement(id: string) {
    const supabase = await createClient() as any;
    const { error } = await supabase
      .from("competition_announcements")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return true;
  }
};

export const certificateService = {
  async getCertificates(competitionId: string) {
    const supabase = await createClient() as any;
    const { data, error } = await supabase
      .from("competition_certificates")
      .select("*, profile:profiles(*)")
      .eq("competition_id", competitionId)
      .order("issued_at", { ascending: false });
      
    if (error) throw error;
    return data;
  },

  async issueCertificate(certificate: Partial<CompetitionCertificate>) {
    const supabase = await createClient() as any;
    const { data, error } = await supabase
      .from("competition_certificates")
      .insert(certificate)
      .select()
      .single();
      
    if (error) throw error;
    return data as CompetitionCertificate;
  },

  async revokeCertificate(id: string) {
    const supabase = await createClient() as any;
    const { error } = await supabase
      .from("competition_certificates")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return true;
  }
};
