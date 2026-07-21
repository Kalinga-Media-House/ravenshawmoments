export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      academic_sessions: {
        Row: {
          created_at: string
          end_date: string
          id: string
          is_current: boolean
          name: string
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          is_current?: boolean
          name: string
          start_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          is_current?: boolean
          name?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      achievement_categories: {
        Row: {
          description: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      achievement_documents: {
        Row: {
          achievement_id: string
          created_at: string
          display_order: number
          document_type: string
          id: string
          media_file_id: string
          uploaded_by: string | null
        }
        Insert: {
          achievement_id: string
          created_at?: string
          display_order?: number
          document_type: string
          id?: string
          media_file_id: string
          uploaded_by?: string | null
        }
        Update: {
          achievement_id?: string
          created_at?: string
          display_order?: number
          document_type?: string
          id?: string
          media_file_id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "achievement_documents_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "achievement_documents_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "v_department_achievements"
            referencedColumns: ["achievement_id"]
          },
          {
            foreignKeyName: "achievement_documents_media_file_id_fkey"
            columns: ["media_file_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "achievement_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      achievement_levels: {
        Row: {
          display_order: number
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      achievement_recipients: {
        Row: {
          achievement_id: string
          created_at: string
          id: string
          position: string | null
          profile_id: string
          remarks: string | null
        }
        Insert: {
          achievement_id: string
          created_at?: string
          id?: string
          position?: string | null
          profile_id: string
          remarks?: string | null
        }
        Update: {
          achievement_id?: string
          created_at?: string
          id?: string
          position?: string | null
          profile_id?: string
          remarks?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "achievement_recipients_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "achievement_recipients_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "v_department_achievements"
            referencedColumns: ["achievement_id"]
          },
          {
            foreignKeyName: "achievement_recipients_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      achievements: {
        Row: {
          achievement_date: string | null
          achievement_level_id: string | null
          category_id: string
          certificate_media_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description: string | null
          display_order: number
          entity_id: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          featured_media_id: string | null
          id: string
          is_featured: boolean
          is_public: boolean
          issuing_organization: string | null
          public_id: string
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          achievement_date?: string | null
          achievement_level_id?: string | null
          category_id: string
          certificate_media_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          display_order?: number
          entity_id: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          featured_media_id?: string | null
          id?: string
          is_featured?: boolean
          is_public?: boolean
          issuing_organization?: string | null
          public_id?: string
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          achievement_date?: string | null
          achievement_level_id?: string | null
          category_id?: string
          certificate_media_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          display_order?: number
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["entity_type"]
          featured_media_id?: string | null
          id?: string
          is_featured?: boolean
          is_public?: boolean
          issuing_organization?: string | null
          public_id?: string
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievements_achievement_level_id_fkey"
            columns: ["achievement_level_id"]
            isOneToOne: false
            referencedRelation: "achievement_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "achievements_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "achievement_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "achievements_certificate_media_id_fkey"
            columns: ["certificate_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "achievements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "achievements_featured_media_id_fkey"
            columns: ["featured_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_announcements: {
        Row: {
          created_at: string
          created_by: string | null
          ends_at: string | null
          id: string
          is_active: boolean
          message: string
          starts_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean
          message: string
          starts_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean
          message?: string
          starts_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      alumni_connections: {
        Row: {
          created_at: string
          id: string
          recipient_id: string
          requester_id: string
          status: Database["public"]["Enums"]["connection_request_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          recipient_id: string
          requester_id: string
          status?: Database["public"]["Enums"]["connection_request_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          recipient_id?: string
          requester_id?: string
          status?: Database["public"]["Enums"]["connection_request_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "alumni_connections_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alumni_connections_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      alumni_education: {
        Row: {
          alumni_id: string
          created_at: string
          degree: string
          description: string | null
          end_date: string | null
          field_of_study: string | null
          id: string
          institution: string
          start_date: string
        }
        Insert: {
          alumni_id: string
          created_at?: string
          degree: string
          description?: string | null
          end_date?: string | null
          field_of_study?: string | null
          id?: string
          institution: string
          start_date: string
        }
        Update: {
          alumni_id?: string
          created_at?: string
          degree?: string
          description?: string | null
          end_date?: string | null
          field_of_study?: string | null
          id?: string
          institution?: string
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "alumni_education_alumni_id_fkey"
            columns: ["alumni_id"]
            isOneToOne: false
            referencedRelation: "alumni_profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      alumni_employment: {
        Row: {
          alumni_id: string
          company: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          industry: string | null
          is_current: boolean
          location: string | null
          position: string
          start_date: string
        }
        Insert: {
          alumni_id: string
          company: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          industry?: string | null
          is_current?: boolean
          location?: string | null
          position: string
          start_date: string
        }
        Update: {
          alumni_id?: string
          company?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          industry?: string | null
          is_current?: boolean
          location?: string | null
          position?: string
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "alumni_employment_alumni_id_fkey"
            columns: ["alumni_id"]
            isOneToOne: false
            referencedRelation: "alumni_profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      alumni_job_postings: {
        Row: {
          application_link: string | null
          company: string
          created_at: string
          description: string
          employment_type: string
          expiry_date: string | null
          id: string
          is_referral_available: boolean
          location: string | null
          posted_by: string
          requirements: string | null
          status: Database["public"]["Enums"]["job_posting_status"]
          title: string
          updated_at: string
        }
        Insert: {
          application_link?: string | null
          company: string
          created_at?: string
          description: string
          employment_type: string
          expiry_date?: string | null
          id?: string
          is_referral_available?: boolean
          location?: string | null
          posted_by: string
          requirements?: string | null
          status?: Database["public"]["Enums"]["job_posting_status"]
          title: string
          updated_at?: string
        }
        Update: {
          application_link?: string | null
          company?: string
          created_at?: string
          description?: string
          employment_type?: string
          expiry_date?: string | null
          id?: string
          is_referral_available?: boolean
          location?: string | null
          posted_by?: string
          requirements?: string | null
          status?: Database["public"]["Enums"]["job_posting_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "alumni_job_postings_posted_by_fkey"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      alumni_profiles: {
        Row: {
          biography: string | null
          company: string | null
          created_at: string
          current_position: string | null
          industry: string | null
          linkedin_url: string | null
          location: string | null
          profile_id: string
          profile_visibility: Database["public"]["Enums"]["visibility_type"]
          updated_at: string
          verification_date: string | null
          verification_status: Database["public"]["Enums"]["alumni_verification_status"]
          verified_by: string | null
          website_url: string | null
        }
        Insert: {
          biography?: string | null
          company?: string | null
          created_at?: string
          current_position?: string | null
          industry?: string | null
          linkedin_url?: string | null
          location?: string | null
          profile_id: string
          profile_visibility?: Database["public"]["Enums"]["visibility_type"]
          updated_at?: string
          verification_date?: string | null
          verification_status?: Database["public"]["Enums"]["alumni_verification_status"]
          verified_by?: string | null
          website_url?: string | null
        }
        Update: {
          biography?: string | null
          company?: string | null
          created_at?: string
          current_position?: string | null
          industry?: string | null
          linkedin_url?: string | null
          location?: string | null
          profile_id?: string
          profile_visibility?: Database["public"]["Enums"]["visibility_type"]
          updated_at?: string
          verification_date?: string | null
          verification_status?: Database["public"]["Enums"]["alumni_verification_status"]
          verified_by?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alumni_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      alumni_success_stories: {
        Row: {
          alumni_id: string
          category: Database["public"]["Enums"]["success_story_category"]
          created_at: string
          id: string
          is_published: boolean
          media_id: string | null
          published_at: string | null
          story_content: string
          title: string
        }
        Insert: {
          alumni_id: string
          category: Database["public"]["Enums"]["success_story_category"]
          created_at?: string
          id?: string
          is_published?: boolean
          media_id?: string | null
          published_at?: string | null
          story_content: string
          title: string
        }
        Update: {
          alumni_id?: string
          category?: Database["public"]["Enums"]["success_story_category"]
          created_at?: string
          id?: string
          is_published?: boolean
          media_id?: string | null
          published_at?: string | null
          story_content?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "alumni_success_stories_alumni_id_fkey"
            columns: ["alumni_id"]
            isOneToOne: false
            referencedRelation: "alumni_profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "alumni_success_stories_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_dashboards: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_system_default: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_system_default?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_system_default?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_dashboards_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_reports: {
        Row: {
          created_at: string
          error_message: string | null
          file_media_id: string | null
          format: Database["public"]["Enums"]["report_format"]
          generated_by: string | null
          id: string
          name: string
          parameters: Json
          status: Database["public"]["Enums"]["report_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          file_media_id?: string | null
          format: Database["public"]["Enums"]["report_format"]
          generated_by?: string | null
          id?: string
          name: string
          parameters?: Json
          status?: Database["public"]["Enums"]["report_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          file_media_id?: string | null
          format?: Database["public"]["Enums"]["report_format"]
          generated_by?: string | null
          id?: string
          name?: string
          parameters?: Json
          status?: Database["public"]["Enums"]["report_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_reports_file_media_id_fkey"
            columns: ["file_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_reports_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_widgets: {
        Row: {
          configuration: Json
          created_at: string
          dashboard_id: string
          data_source: string
          display_order: number
          id: string
          title: string
          updated_at: string
          widget_type: Database["public"]["Enums"]["widget_type"]
        }
        Insert: {
          configuration?: Json
          created_at?: string
          dashboard_id: string
          data_source: string
          display_order?: number
          id?: string
          title: string
          updated_at?: string
          widget_type: Database["public"]["Enums"]["widget_type"]
        }
        Update: {
          configuration?: Json
          created_at?: string
          dashboard_id?: string
          data_source?: string
          display_order?: number
          id?: string
          title?: string
          updated_at?: string
          widget_type?: Database["public"]["Enums"]["widget_type"]
        }
        Relationships: [
          {
            foreignKeyName: "analytics_widgets_dashboard_id_fkey"
            columns: ["dashboard_id"]
            isOneToOne: false
            referencedRelation: "analytics_dashboards"
            referencedColumns: ["id"]
          },
        ]
      }
      attachments: {
        Row: {
          created_at: string
          created_by: string | null
          display_order: number
          entity_id: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          id: string
          is_cover: boolean
          media_file_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          display_order?: number
          entity_id: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          id?: string
          is_cover?: boolean
          media_file_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          display_order?: number
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["entity_type"]
          id?: string
          is_cover?: boolean
          media_file_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_media_file_id_fkey"
            columns: ["media_file_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_events: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: Database["public"]["Enums"]["entity_type"] | null
          id: string
          metadata: Json | null
          severity: Database["public"]["Enums"]["audit_severity"]
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: Database["public"]["Enums"]["entity_type"] | null
          id?: string
          metadata?: Json | null
          severity?: Database["public"]["Enums"]["audit_severity"]
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: Database["public"]["Enums"]["entity_type"] | null
          id?: string
          metadata?: Json | null
          severity?: Database["public"]["Enums"]["audit_severity"]
        }
        Relationships: [
          {
            foreignKeyName: "audit_events_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_profile_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: Database["public"]["Enums"]["entity_type"] | null
          id: string
          ip_address: unknown
          new_data: Json | null
          old_data: Json | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_profile_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: Database["public"]["Enums"]["entity_type"] | null
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_profile_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: Database["public"]["Enums"]["entity_type"] | null
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_profile_id_fkey"
            columns: ["actor_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      batches: {
        Row: {
          academic_session_id: string | null
          batch_name: string
          created_at: string
          deleted_at: string | null
          department_program_id: string
          display_order: number
          end_year: number
          graduation_year: number | null
          id: string
          is_current: boolean
          start_year: number
          status: string
          updated_at: string
        }
        Insert: {
          academic_session_id?: string | null
          batch_name: string
          created_at?: string
          deleted_at?: string | null
          department_program_id: string
          display_order?: number
          end_year: number
          graduation_year?: number | null
          id?: string
          is_current?: boolean
          start_year: number
          status?: string
          updated_at?: string
        }
        Update: {
          academic_session_id?: string | null
          batch_name?: string
          created_at?: string
          deleted_at?: string | null
          department_program_id?: string
          display_order?: number
          end_year?: number
          graduation_year?: number | null
          id?: string
          is_current?: boolean
          start_year?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "batches_academic_session_id_fkey"
            columns: ["academic_session_id"]
            isOneToOne: false
            referencedRelation: "academic_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batches_department_program_id_fkey"
            columns: ["department_program_id"]
            isOneToOne: false
            referencedRelation: "department_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmarks: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          id: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          id?: string
          profile_id: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["entity_type"]
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_analytics: {
        Row: {
          business_id: string
          date: string
          direction_requests: number
          id: string
          phone_clicks: number
          views_count: number
          website_clicks: number
          whatsapp_clicks: number
        }
        Insert: {
          business_id: string
          date?: string
          direction_requests?: number
          id?: string
          phone_clicks?: number
          views_count?: number
          website_clicks?: number
          whatsapp_clicks?: number
        }
        Update: {
          business_id?: string
          date?: string
          direction_requests?: number
          id?: string
          phone_clicks?: number
          views_count?: number
          website_clicks?: number
          whatsapp_clicks?: number
        }
        Relationships: [
          {
            foreignKeyName: "business_analytics_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      business_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          icon_name: string | null
          id: string
          is_active: boolean
          name: string
          parent_id: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon_name?: string | null
          id?: string
          is_active?: boolean
          name: string
          parent_id?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon_name?: string | null
          id?: string
          is_active?: boolean
          name?: string
          parent_id?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "business_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      business_claims: {
        Row: {
          business_id: string
          created_at: string
          id: string
          profile_id: string
          proof_media_id: string | null
          proof_text: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["business_claim_status"]
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          profile_id: string
          proof_media_id?: string | null
          proof_text?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["business_claim_status"]
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          profile_id?: string
          proof_media_id?: string | null
          proof_text?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["business_claim_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_claims_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_claims_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_claims_proof_media_id_fkey"
            columns: ["proof_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_claims_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_gallery: {
        Row: {
          business_id: string
          caption: string | null
          created_at: string
          display_order: number
          id: string
          media_id: string
        }
        Insert: {
          business_id: string
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          media_id: string
        }
        Update: {
          business_id?: string
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          media_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_gallery_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_gallery_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
        ]
      }
      business_hours: {
        Row: {
          business_id: string
          close_time: string | null
          day_of_week: number
          id: string
          is_closed: boolean
          open_time: string | null
        }
        Insert: {
          business_id: string
          close_time?: string | null
          day_of_week: number
          id?: string
          is_closed?: boolean
          open_time?: string | null
        }
        Update: {
          business_id?: string
          close_time?: string | null
          day_of_week?: number
          id?: string
          is_closed?: boolean
          open_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_hours_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      business_listings: {
        Row: {
          address: string | null
          amenities: string[] | null
          category_id: string
          cover_media_id: string | null
          created_at: string
          description: string | null
          email: string | null
          facebook: string | null
          facilities: string[] | null
          google_maps_url: string | null
          id: string
          instagram: string | null
          is_alumni_owned: boolean
          is_featured: boolean
          is_premium: boolean
          latitude: number | null
          logo_media_id: string | null
          longitude: number | null
          name: string
          nearby_landmarks: string[] | null
          owner_name: string | null
          owner_profile_id: string | null
          payment_methods: string[] | null
          phone: string | null
          price_range: number | null
          services_offered: string[] | null
          slug: string
          status: Database["public"]["Enums"]["business_listing_status"]
          updated_at: string
          verification_status: Database["public"]["Enums"]["business_verification_status"]
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          category_id: string
          cover_media_id?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          facebook?: string | null
          facilities?: string[] | null
          google_maps_url?: string | null
          id?: string
          instagram?: string | null
          is_alumni_owned?: boolean
          is_featured?: boolean
          is_premium?: boolean
          latitude?: number | null
          logo_media_id?: string | null
          longitude?: number | null
          name: string
          nearby_landmarks?: string[] | null
          owner_name?: string | null
          owner_profile_id?: string | null
          payment_methods?: string[] | null
          phone?: string | null
          price_range?: number | null
          services_offered?: string[] | null
          slug: string
          status?: Database["public"]["Enums"]["business_listing_status"]
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["business_verification_status"]
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          category_id?: string
          cover_media_id?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          facebook?: string | null
          facilities?: string[] | null
          google_maps_url?: string | null
          id?: string
          instagram?: string | null
          is_alumni_owned?: boolean
          is_featured?: boolean
          is_premium?: boolean
          latitude?: number | null
          logo_media_id?: string | null
          longitude?: number | null
          name?: string
          nearby_landmarks?: string[] | null
          owner_name?: string | null
          owner_profile_id?: string | null
          payment_methods?: string[] | null
          phone?: string | null
          price_range?: number | null
          services_offered?: string[] | null
          slug?: string
          status?: Database["public"]["Enums"]["business_listing_status"]
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["business_verification_status"]
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_listings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "business_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_listings_cover_media_id_fkey"
            columns: ["cover_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_listings_logo_media_id_fkey"
            columns: ["logo_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_listings_owner_profile_id_fkey"
            columns: ["owner_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_reviews: {
        Row: {
          business_id: string
          comment: string | null
          created_at: string
          helpful_votes: number
          id: string
          is_verified_purchase: boolean
          rating: number
          reviewer_id: string
          status: string
          updated_at: string
        }
        Insert: {
          business_id: string
          comment?: string | null
          created_at?: string
          helpful_votes?: number
          id?: string
          is_verified_purchase?: boolean
          rating: number
          reviewer_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          comment?: string | null
          created_at?: string
          helpful_votes?: number
          id?: string
          is_verified_purchase?: boolean
          rating?: number
          reviewer_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_reviews_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      career_counselling_sessions: {
        Row: {
          career_roadmap_json: Json | null
          counselor_profile_id: string
          created_at: string
          duration_minutes: number | null
          id: string
          notes: string | null
          scheduled_at: string
          status: string | null
          student_profile_id: string
          topic: string | null
          updated_at: string
        }
        Insert: {
          career_roadmap_json?: Json | null
          counselor_profile_id: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          scheduled_at: string
          status?: string | null
          student_profile_id: string
          topic?: string | null
          updated_at?: string
        }
        Update: {
          career_roadmap_json?: Json | null
          counselor_profile_id?: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          scheduled_at?: string
          status?: string | null
          student_profile_id?: string
          topic?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "career_counselling_sessions_counselor_profile_id_fkey"
            columns: ["counselor_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "career_counselling_sessions_student_profile_id_fkey"
            columns: ["student_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      certificate_templates: {
        Row: {
          certificate_type: Database["public"]["Enums"]["certificate_type"]
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          template_media_id: string | null
          updated_at: string
        }
        Insert: {
          certificate_type: Database["public"]["Enums"]["certificate_type"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          template_media_id?: string | null
          updated_at?: string
        }
        Update: {
          certificate_type?: Database["public"]["Enums"]["certificate_type"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          template_media_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificate_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificate_templates_template_media_id_fkey"
            columns: ["template_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
        ]
      }
      certificate_verification_logs: {
        Row: {
          certificate_id: string
          id: string
          ip_address: unknown
          user_agent: string | null
          verification_result: boolean
          verified_at: string
        }
        Insert: {
          certificate_id: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          verification_result?: boolean
          verified_at?: string
        }
        Update: {
          certificate_id?: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          verification_result?: boolean
          verified_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificate_verification_logs_certificate_id_fkey"
            columns: ["certificate_id"]
            isOneToOne: false
            referencedRelation: "certificates"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          certificate_number: string
          certificate_type: Database["public"]["Enums"]["certificate_type"]
          created_at: string
          description: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          id: string
          is_revoked: boolean
          issued_by: string | null
          issued_on: string
          pdf_media_id: string | null
          preview_media_id: string | null
          profile_id: string
          public_id: string
          qr_token: string
          revoked_reason: string | null
          template_id: string | null
          title: string
          updated_at: string
          verification_url: string | null
        }
        Insert: {
          certificate_number: string
          certificate_type: Database["public"]["Enums"]["certificate_type"]
          created_at?: string
          description?: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          id?: string
          is_revoked?: boolean
          issued_by?: string | null
          issued_on?: string
          pdf_media_id?: string | null
          preview_media_id?: string | null
          profile_id: string
          public_id?: string
          qr_token?: string
          revoked_reason?: string | null
          template_id?: string | null
          title: string
          updated_at?: string
          verification_url?: string | null
        }
        Update: {
          certificate_number?: string
          certificate_type?: Database["public"]["Enums"]["certificate_type"]
          created_at?: string
          description?: string | null
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["entity_type"]
          id?: string
          is_revoked?: boolean
          issued_by?: string | null
          issued_on?: string
          pdf_media_id?: string | null
          preview_media_id?: string | null
          profile_id?: string
          public_id?: string
          qr_token?: string
          revoked_reason?: string | null
          template_id?: string | null
          title?: string
          updated_at?: string
          verification_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_issued_by_fkey"
            columns: ["issued_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_pdf_media_id_fkey"
            columns: ["pdf_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_preview_media_id_fkey"
            columns: ["preview_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "certificate_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          career_page_url: string | null
          company_size: string | null
          created_at: string
          description: string | null
          founded_year: number | null
          headquarters: string | null
          id: string
          industry: string | null
          is_active: boolean
          linkedin_url: string | null
          locations: string[] | null
          logo_media_id: string | null
          name: string
          slug: string
          updated_at: string
          website: string | null
        }
        Insert: {
          career_page_url?: string | null
          company_size?: string | null
          created_at?: string
          description?: string | null
          founded_year?: number | null
          headquarters?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean
          linkedin_url?: string | null
          locations?: string[] | null
          logo_media_id?: string | null
          name: string
          slug: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          career_page_url?: string | null
          company_size?: string | null
          created_at?: string
          description?: string | null
          founded_year?: number | null
          headquarters?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean
          linkedin_url?: string | null
          locations?: string[] | null
          logo_media_id?: string | null
          name?: string
          slug?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_logo_media_id_fkey"
            columns: ["logo_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
        ]
      }
      company_contacts: {
        Row: {
          company_id: string
          created_at: string
          id: string
          is_primary: boolean
          profile_id: string
          role: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          is_primary?: boolean
          profile_id: string
          role: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          is_primary?: boolean
          profile_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "placement_statistics"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_contacts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_announcements: {
        Row: {
          competition_id: string
          content: string
          id: string
          published_at: string
          published_by: string | null
          title: string
          updated_at: string
        }
        Insert: {
          competition_id: string
          content: string
          id?: string
          published_at?: string
          published_by?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          competition_id?: string
          content?: string
          id?: string
          published_at?: string
          published_by?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_announcements_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_announcements_published_by_fkey"
            columns: ["published_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_categories: {
        Row: {
          description: string | null
          display_order: number
          id: string
          is_active: boolean | null
          name: string
          slug: string
        }
        Insert: {
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
        }
        Update: {
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      competition_certificates: {
        Row: {
          certificate_type: string
          competition_id: string
          file_path: string
          id: string
          issued_at: string
          profile_id: string
        }
        Insert: {
          certificate_type: string
          competition_id: string
          file_path: string
          id?: string
          issued_at?: string
          profile_id: string
        }
        Update: {
          certificate_type?: string
          competition_id?: string
          file_path?: string
          id?: string
          issued_at?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_certificates_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_certificates_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_evaluation_criteria: {
        Row: {
          competition_id: string
          created_at: string
          description: string | null
          id: string
          max_score: number
          name: string
          updated_at: string
          weightage: number
        }
        Insert: {
          competition_id: string
          created_at?: string
          description?: string | null
          id?: string
          max_score?: number
          name: string
          updated_at?: string
          weightage?: number
        }
        Update: {
          competition_id?: string
          created_at?: string
          description?: string | null
          id?: string
          max_score?: number
          name?: string
          updated_at?: string
          weightage?: number
        }
        Relationships: [
          {
            foreignKeyName: "competition_evaluation_criteria_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_evaluations: {
        Row: {
          criteria_id: string
          evaluated_at: string
          id: string
          judge_id: string
          registration_id: string | null
          remarks: string | null
          score: number
          team_id: string | null
        }
        Insert: {
          criteria_id: string
          evaluated_at?: string
          id?: string
          judge_id: string
          registration_id?: string | null
          remarks?: string | null
          score: number
          team_id?: string | null
        }
        Update: {
          criteria_id?: string
          evaluated_at?: string
          id?: string
          judge_id?: string
          registration_id?: string | null
          remarks?: string | null
          score?: number
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "competition_evaluations_criteria_id_fkey"
            columns: ["criteria_id"]
            isOneToOne: false
            referencedRelation: "competition_evaluation_criteria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_evaluations_judge_id_fkey"
            columns: ["judge_id"]
            isOneToOne: false
            referencedRelation: "competition_judges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_evaluations_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "competition_registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_evaluations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "competition_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_judges: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          competition_id: string
          id: string
          profile_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          competition_id: string
          id?: string
          profile_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          competition_id?: string
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_judges_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_judges_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_judges_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_point_rules: {
        Row: {
          created_at: string
          effective_from: string
          effective_until: string | null
          id: string
          is_active: boolean
          points: number
          position: Database["public"]["Enums"]["competition_position"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          effective_from?: string
          effective_until?: string | null
          id?: string
          is_active?: boolean
          points: number
          position: Database["public"]["Enums"]["competition_position"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          effective_from?: string
          effective_until?: string | null
          id?: string
          is_active?: boolean
          points?: number
          position?: Database["public"]["Enums"]["competition_position"]
          updated_at?: string
        }
        Relationships: []
      }
      competition_point_transactions: {
        Row: {
          awarded_by: string | null
          competition_id: string
          created_at: string
          id: string
          points: number
          profile_id: string
          reason: string | null
          result_id: string | null
          transaction_type: string
          transaction_version: number
        }
        Insert: {
          awarded_by?: string | null
          competition_id: string
          created_at?: string
          id?: string
          points: number
          profile_id: string
          reason?: string | null
          result_id?: string | null
          transaction_type: string
          transaction_version?: number
        }
        Update: {
          awarded_by?: string | null
          competition_id?: string
          created_at?: string
          id?: string
          points?: number
          profile_id?: string
          reason?: string | null
          result_id?: string | null
          transaction_type?: string
          transaction_version?: number
        }
        Relationships: [
          {
            foreignKeyName: "competition_point_transactions_awarded_by_fkey"
            columns: ["awarded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_point_transactions_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_point_transactions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_point_transactions_result_id_fkey"
            columns: ["result_id"]
            isOneToOne: false
            referencedRelation: "competition_results"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_prizes: {
        Row: {
          additional_description: string | null
          competition_id: string
          created_at: string
          currency: string | null
          display_order: number
          id: string
          includes_certificate: boolean
          includes_trophy: boolean
          monetary_amount: number | null
          position_name: string
          prize_title: string
          updated_at: string
        }
        Insert: {
          additional_description?: string | null
          competition_id: string
          created_at?: string
          currency?: string | null
          display_order?: number
          id?: string
          includes_certificate?: boolean
          includes_trophy?: boolean
          monetary_amount?: number | null
          position_name: string
          prize_title: string
          updated_at?: string
        }
        Update: {
          additional_description?: string | null
          competition_id?: string
          created_at?: string
          currency?: string | null
          display_order?: number
          id?: string
          includes_certificate?: boolean
          includes_trophy?: boolean
          monetary_amount?: number | null
          position_name?: string
          prize_title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_prizes_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_refund_configurations: {
        Row: {
          competition_id: string
          created_at: string
          custom_policy_note: string | null
          id: string
          legal_document_version_id: string | null
          refund_deadline: string | null
          refund_percentage: number | null
          refund_policy_type: string
          updated_at: string
        }
        Insert: {
          competition_id: string
          created_at?: string
          custom_policy_note?: string | null
          id?: string
          legal_document_version_id?: string | null
          refund_deadline?: string | null
          refund_percentage?: number | null
          refund_policy_type: string
          updated_at?: string
        }
        Update: {
          competition_id?: string
          created_at?: string
          custom_policy_note?: string | null
          id?: string
          legal_document_version_id?: string | null
          refund_deadline?: string | null
          refund_percentage?: number | null
          refund_policy_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_refund_configuration_legal_document_version_id_fkey"
            columns: ["legal_document_version_id"]
            isOneToOne: false
            referencedRelation: "legal_document_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_refund_configurations_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: true
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_registrations: {
        Row: {
          competition_id: string
          id: string
          is_verified_participant: boolean
          participated_at: string | null
          payment_reference: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          profile_id: string
          public_id: string
          registered_at: string
          registration_status: Database["public"]["Enums"]["registration_status"]
          team_id: string | null
        }
        Insert: {
          competition_id: string
          id?: string
          is_verified_participant?: boolean
          participated_at?: string | null
          payment_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          profile_id: string
          public_id?: string
          registered_at?: string
          registration_status?: Database["public"]["Enums"]["registration_status"]
          team_id?: string | null
        }
        Update: {
          competition_id?: string
          id?: string
          is_verified_participant?: boolean
          participated_at?: string | null
          payment_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          profile_id?: string
          public_id?: string
          registered_at?: string
          registration_status?: Database["public"]["Enums"]["registration_status"]
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "competition_registrations_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_registrations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_registrations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "competition_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_result_audit_logs: {
        Row: {
          competition_id: string
          corrected_at: string
          corrected_by: string | null
          corrected_marks: number | null
          corrected_outcome: string | null
          corrected_rank: number | null
          correction_reason: string | null
          id: string
          previous_marks: number | null
          previous_outcome: string | null
          previous_rank: number | null
          registration_id: string
          result_id: string
        }
        Insert: {
          competition_id: string
          corrected_at?: string
          corrected_by?: string | null
          corrected_marks?: number | null
          corrected_outcome?: string | null
          corrected_rank?: number | null
          correction_reason?: string | null
          id?: string
          previous_marks?: number | null
          previous_outcome?: string | null
          previous_rank?: number | null
          registration_id: string
          result_id: string
        }
        Update: {
          competition_id?: string
          corrected_at?: string
          corrected_by?: string | null
          corrected_marks?: number | null
          corrected_outcome?: string | null
          corrected_rank?: number | null
          correction_reason?: string | null
          id?: string
          previous_marks?: number | null
          previous_outcome?: string | null
          previous_rank?: number | null
          registration_id?: string
          result_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_result_audit_logs_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_result_audit_logs_corrected_by_fkey"
            columns: ["corrected_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_result_audit_logs_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "competition_registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_result_audit_logs_result_id_fkey"
            columns: ["result_id"]
            isOneToOne: false
            referencedRelation: "competition_results"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_results: {
        Row: {
          announced_at: string
          certificate_type: Database["public"]["Enums"]["certificate_type"]
          competition_id: string
          created_at: string
          evaluated_at: string | null
          evaluated_by: string | null
          finalized_at: string | null
          finalized_by: string | null
          id: string
          leaderboard_points: number
          marks_obtained: number | null
          maximum_marks: number
          normalized_score: number | null
          outcome: Database["public"]["Enums"]["competition_participant_outcome"]
          position: Database["public"]["Enums"]["competition_position"]
          profile_id: string | null
          published_at: string | null
          rank: number | null
          registration_id: string
          remarks: string | null
          requires_tie_break: boolean
          result_status: Database["public"]["Enums"]["competition_result_status"]
          tie_break_notes: string | null
          tie_break_score: number | null
          tie_resolved_at: string | null
          tie_resolved_by: string | null
          updated_at: string
        }
        Insert: {
          announced_at?: string
          certificate_type: Database["public"]["Enums"]["certificate_type"]
          competition_id: string
          created_at?: string
          evaluated_at?: string | null
          evaluated_by?: string | null
          finalized_at?: string | null
          finalized_by?: string | null
          id?: string
          leaderboard_points?: number
          marks_obtained?: number | null
          maximum_marks?: number
          normalized_score?: number | null
          outcome?: Database["public"]["Enums"]["competition_participant_outcome"]
          position?: Database["public"]["Enums"]["competition_position"]
          profile_id?: string | null
          published_at?: string | null
          rank?: number | null
          registration_id: string
          remarks?: string | null
          requires_tie_break?: boolean
          result_status?: Database["public"]["Enums"]["competition_result_status"]
          tie_break_notes?: string | null
          tie_break_score?: number | null
          tie_resolved_at?: string | null
          tie_resolved_by?: string | null
          updated_at?: string
        }
        Update: {
          announced_at?: string
          certificate_type?: Database["public"]["Enums"]["certificate_type"]
          competition_id?: string
          created_at?: string
          evaluated_at?: string | null
          evaluated_by?: string | null
          finalized_at?: string | null
          finalized_by?: string | null
          id?: string
          leaderboard_points?: number
          marks_obtained?: number | null
          maximum_marks?: number
          normalized_score?: number | null
          outcome?: Database["public"]["Enums"]["competition_participant_outcome"]
          position?: Database["public"]["Enums"]["competition_position"]
          profile_id?: string | null
          published_at?: string | null
          rank?: number | null
          registration_id?: string
          remarks?: string | null
          requires_tie_break?: boolean
          result_status?: Database["public"]["Enums"]["competition_result_status"]
          tie_break_notes?: string | null
          tie_break_score?: number | null
          tie_resolved_at?: string | null
          tie_resolved_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_results_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_results_evaluated_by_fkey"
            columns: ["evaluated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_results_finalized_by_fkey"
            columns: ["finalized_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_results_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_results_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "competition_registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_results_tie_resolved_by_fkey"
            columns: ["tie_resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_sponsors: {
        Row: {
          competition_id: string
          created_at: string
          id: string
          logo_path: string | null
          name: string
          tier: string
          updated_at: string
          website: string | null
        }
        Insert: {
          competition_id: string
          created_at?: string
          id?: string
          logo_path?: string | null
          name: string
          tier?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          competition_id?: string
          created_at?: string
          id?: string
          logo_path?: string | null
          name?: string
          tier?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "competition_sponsors_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_submissions: {
        Row: {
          evaluated_at: string | null
          evaluated_by: string | null
          id: string
          media_file_id: string | null
          registration_id: string
          remarks: string | null
          score: number | null
          submission_url: string | null
          submitted_at: string
        }
        Insert: {
          evaluated_at?: string | null
          evaluated_by?: string | null
          id?: string
          media_file_id?: string | null
          registration_id: string
          remarks?: string | null
          score?: number | null
          submission_url?: string | null
          submitted_at?: string
        }
        Update: {
          evaluated_at?: string | null
          evaluated_by?: string | null
          id?: string
          media_file_id?: string | null
          registration_id?: string
          remarks?: string | null
          score?: number | null
          submission_url?: string | null
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_submissions_evaluated_by_fkey"
            columns: ["evaluated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_submissions_media_file_id_fkey"
            columns: ["media_file_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_submissions_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: true
            referencedRelation: "competition_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_team_members: {
        Row: {
          joined_at: string
          profile_id: string
          role: string
          team_id: string
        }
        Insert: {
          joined_at?: string
          profile_id: string
          role?: string
          team_id: string
        }
        Update: {
          joined_at?: string
          profile_id?: string
          role?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_team_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "competition_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      competition_teams: {
        Row: {
          competition_id: string
          created_at: string
          id: string
          leader_profile_id: string
          team_name: string
          team_status: string
          updated_at: string
        }
        Insert: {
          competition_id: string
          created_at?: string
          id?: string
          leader_profile_id: string
          team_name: string
          team_status?: string
          updated_at?: string
        }
        Update: {
          competition_id?: string
          created_at?: string
          id?: string
          leader_profile_id?: string
          team_name?: string
          team_status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_teams_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competition_teams_leader_profile_id_fkey"
            columns: ["leader_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      competitions: {
        Row: {
          allow_team: boolean
          category_id: string
          certificate_delivery_method: string | null
          certificate_verification_enabled: boolean
          competition_level: Database["public"]["Enums"]["competition_level"]
          competition_status: Database["public"]["Enums"]["competition_status"]
          created_at: string
          created_by: string | null
          department_id: string | null
          description: string | null
          eligibility_configuration: Json | null
          eligibility_rules: string | null
          eligible_participant_types: Json | null
          ends_at: string | null
          external_participants_allowed: boolean
          featured_at: string | null
          featured_media_id: string | null
          highlights: Json | null
          hostel_id: string | null
          id: string
          important_information: Json | null
          internal_notes: string | null
          is_featured: boolean
          is_public: boolean
          judging_criteria: string | null
          max_participants: number | null
          max_team_size: number | null
          merit_certificate_enabled: boolean
          min_team_size: number | null
          mode: Database["public"]["Enums"]["competition_mode"]
          organization_id: string | null
          participation_certificate_enabled: boolean
          prize_details: string | null
          public_id: string
          published_at: string | null
          registration_approval_mode: string
          registration_close_at: string | null
          registration_fee: number | null
          registration_open_at: string | null
          reporting_instructions: string | null
          result_date: string | null
          result_visibility: string
          rules: string | null
          scheduled_publish_at: string | null
          short_description: string | null
          slug: string
          starts_at: string | null
          submission_close_at: string | null
          submission_open_at: string | null
          submission_requirements: Json | null
          theme: string | null
          title: string
          updated_at: string
          venue_details: string | null
          venue_name: string | null
          waitlist_enabled: boolean
          winner_certificate_enabled: boolean
        }
        Insert: {
          allow_team?: boolean
          category_id: string
          certificate_delivery_method?: string | null
          certificate_verification_enabled?: boolean
          competition_level?: Database["public"]["Enums"]["competition_level"]
          competition_status?: Database["public"]["Enums"]["competition_status"]
          created_at?: string
          created_by?: string | null
          department_id?: string | null
          description?: string | null
          eligibility_configuration?: Json | null
          eligibility_rules?: string | null
          eligible_participant_types?: Json | null
          ends_at?: string | null
          external_participants_allowed?: boolean
          featured_at?: string | null
          featured_media_id?: string | null
          highlights?: Json | null
          hostel_id?: string | null
          id?: string
          important_information?: Json | null
          internal_notes?: string | null
          is_featured?: boolean
          is_public?: boolean
          judging_criteria?: string | null
          max_participants?: number | null
          max_team_size?: number | null
          merit_certificate_enabled?: boolean
          min_team_size?: number | null
          mode?: Database["public"]["Enums"]["competition_mode"]
          organization_id?: string | null
          participation_certificate_enabled?: boolean
          prize_details?: string | null
          public_id?: string
          published_at?: string | null
          registration_approval_mode?: string
          registration_close_at?: string | null
          registration_fee?: number | null
          registration_open_at?: string | null
          reporting_instructions?: string | null
          result_date?: string | null
          result_visibility?: string
          rules?: string | null
          scheduled_publish_at?: string | null
          short_description?: string | null
          slug: string
          starts_at?: string | null
          submission_close_at?: string | null
          submission_open_at?: string | null
          submission_requirements?: Json | null
          theme?: string | null
          title: string
          updated_at?: string
          venue_details?: string | null
          venue_name?: string | null
          waitlist_enabled?: boolean
          winner_certificate_enabled?: boolean
        }
        Update: {
          allow_team?: boolean
          category_id?: string
          certificate_delivery_method?: string | null
          certificate_verification_enabled?: boolean
          competition_level?: Database["public"]["Enums"]["competition_level"]
          competition_status?: Database["public"]["Enums"]["competition_status"]
          created_at?: string
          created_by?: string | null
          department_id?: string | null
          description?: string | null
          eligibility_configuration?: Json | null
          eligibility_rules?: string | null
          eligible_participant_types?: Json | null
          ends_at?: string | null
          external_participants_allowed?: boolean
          featured_at?: string | null
          featured_media_id?: string | null
          highlights?: Json | null
          hostel_id?: string | null
          id?: string
          important_information?: Json | null
          internal_notes?: string | null
          is_featured?: boolean
          is_public?: boolean
          judging_criteria?: string | null
          max_participants?: number | null
          max_team_size?: number | null
          merit_certificate_enabled?: boolean
          min_team_size?: number | null
          mode?: Database["public"]["Enums"]["competition_mode"]
          organization_id?: string | null
          participation_certificate_enabled?: boolean
          prize_details?: string | null
          public_id?: string
          published_at?: string | null
          registration_approval_mode?: string
          registration_close_at?: string | null
          registration_fee?: number | null
          registration_open_at?: string | null
          reporting_instructions?: string | null
          result_date?: string | null
          result_visibility?: string
          rules?: string | null
          scheduled_publish_at?: string | null
          short_description?: string | null
          slug?: string
          starts_at?: string | null
          submission_close_at?: string | null
          submission_open_at?: string | null
          submission_requirements?: Json | null
          theme?: string | null
          title?: string
          updated_at?: string
          venue_details?: string | null
          venue_name?: string | null
          waitlist_enabled?: boolean
          winner_certificate_enabled?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "competitions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "competition_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competitions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competitions_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competitions_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "mv_department_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "competitions_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_department_public_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competitions_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_department_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "competitions_featured_media_id_fkey"
            columns: ["featured_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competitions_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostel_public_directory_v"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competitions_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competitions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      content_attachments: {
        Row: {
          content_item_id: string
          created_at: string
          display_order: number
          media_file_id: string
        }
        Insert: {
          content_item_id: string
          created_at?: string
          display_order?: number
          media_file_id: string
        }
        Update: {
          content_item_id?: string
          created_at?: string
          display_order?: number
          media_file_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_attachments_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_attachments_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "v_department_news"
            referencedColumns: ["content_id"]
          },
          {
            foreignKeyName: "content_attachments_media_file_id_fkey"
            columns: ["media_file_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
        ]
      }
      content_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      content_category_map: {
        Row: {
          category_id: string
          content_id: string
        }
        Insert: {
          category_id: string
          content_id: string
        }
        Update: {
          category_id?: string
          content_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_category_map_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "content_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_category_map_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_category_map_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "v_department_news"
            referencedColumns: ["content_id"]
          },
        ]
      }
      content_comments: {
        Row: {
          body: string
          content_id: string
          created_at: string
          id: string
          parent_id: string | null
          profile_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          body: string
          content_id: string
          created_at?: string
          id?: string
          parent_id?: string | null
          profile_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          body?: string
          content_id?: string
          created_at?: string
          id?: string
          parent_id?: string | null
          profile_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_comments_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_comments_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "v_department_news"
            referencedColumns: ["content_id"]
          },
          {
            foreignKeyName: "content_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "content_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_comments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_items: {
        Row: {
          ai_metadata: Json | null
          author_profile_id: string | null
          banner_media_id: string | null
          body: string
          content_type: Database["public"]["Enums"]["content_type"]
          created_at: string
          deleted_at: string | null
          display_order: number
          entity_id: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          featured_media_id: string | null
          id: string
          is_featured: boolean
          is_published: boolean
          public_id: string
          published_at: string | null
          seo_metadata: Json | null
          slug: string
          status: string
          subtitle: string | null
          summary: string | null
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          ai_metadata?: Json | null
          author_profile_id?: string | null
          banner_media_id?: string | null
          body: string
          content_type: Database["public"]["Enums"]["content_type"]
          created_at?: string
          deleted_at?: string | null
          display_order?: number
          entity_id: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          featured_media_id?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          public_id?: string
          published_at?: string | null
          seo_metadata?: Json | null
          slug: string
          status?: string
          subtitle?: string | null
          summary?: string | null
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          ai_metadata?: Json | null
          author_profile_id?: string | null
          banner_media_id?: string | null
          body?: string
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string
          deleted_at?: string | null
          display_order?: number
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["entity_type"]
          featured_media_id?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          public_id?: string
          published_at?: string | null
          seo_metadata?: Json | null
          slug?: string
          status?: string
          subtitle?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_items_author_profile_id_fkey"
            columns: ["author_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_banner_media_id_fkey"
            columns: ["banner_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_featured_media_id_fkey"
            columns: ["featured_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
        ]
      }
      content_reactions: {
        Row: {
          content_id: string
          created_at: string
          id: string
          profile_id: string
          reaction: Database["public"]["Enums"]["reaction_type"]
        }
        Insert: {
          content_id: string
          created_at?: string
          id?: string
          profile_id: string
          reaction: Database["public"]["Enums"]["reaction_type"]
        }
        Update: {
          content_id?: string
          created_at?: string
          id?: string
          profile_id?: string
          reaction?: Database["public"]["Enums"]["reaction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "content_reactions_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_reactions_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "v_department_news"
            referencedColumns: ["content_id"]
          },
          {
            foreignKeyName: "content_reactions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_reports: {
        Row: {
          content_id: string
          created_at: string
          id: string
          profile_id: string
          reason: string
          status: string | null
        }
        Insert: {
          content_id: string
          created_at?: string
          id?: string
          profile_id: string
          reason: string
          status?: string | null
        }
        Update: {
          content_id?: string
          created_at?: string
          id?: string
          profile_id?: string
          reason?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_reports_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_reports_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "v_department_news"
            referencedColumns: ["content_id"]
          },
          {
            foreignKeyName: "content_reports_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_revisions: {
        Row: {
          body: string
          content_item_id: string
          edited_at: string
          edited_by: string | null
          id: string
          revision_no: number
          title: string
        }
        Insert: {
          body: string
          content_item_id: string
          edited_at?: string
          edited_by?: string | null
          id?: string
          revision_no: number
          title: string
        }
        Update: {
          body?: string
          content_item_id?: string
          edited_at?: string
          edited_by?: string | null
          id?: string
          revision_no?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_revisions_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_revisions_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "v_department_news"
            referencedColumns: ["content_id"]
          },
          {
            foreignKeyName: "content_revisions_edited_by_fkey"
            columns: ["edited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_tag_map: {
        Row: {
          content_item_id: string
          tag_id: string
        }
        Insert: {
          content_item_id: string
          tag_id: string
        }
        Update: {
          content_item_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_tag_map_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_tag_map_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "v_department_news"
            referencedColumns: ["content_id"]
          },
          {
            foreignKeyName: "content_tag_map_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "content_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      content_tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      content_views: {
        Row: {
          content_id: string
          id: string
          profile_id: string | null
          session_id: string | null
          viewed_at: string
        }
        Insert: {
          content_id: string
          id?: string
          profile_id?: string | null
          session_id?: string | null
          viewed_at?: string
        }
        Update: {
          content_id?: string
          id?: string
          profile_id?: string | null
          session_id?: string | null
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_views_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_views_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "v_department_news"
            referencedColumns: ["content_id"]
          },
          {
            foreignKeyName: "content_views_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contribution_proofs: {
        Row: {
          amount_reference: number | null
          created_at: string
          description: string | null
          id: string
          media_file_id: string
          profile_id: string
          remarks: string | null
          reviewed_at: string | null
          reviewer_profile_id: string | null
          title: string
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          amount_reference?: number | null
          created_at?: string
          description?: string | null
          id?: string
          media_file_id: string
          profile_id: string
          remarks?: string | null
          reviewed_at?: string | null
          reviewer_profile_id?: string | null
          title: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          amount_reference?: number | null
          created_at?: string
          description?: string | null
          id?: string
          media_file_id?: string
          profile_id?: string
          remarks?: string | null
          reviewed_at?: string | null
          reviewer_profile_id?: string | null
          title?: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "contribution_proofs_media_file_id_fkey"
            columns: ["media_file_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contribution_proofs_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contribution_proofs_reviewer_profile_id_fkey"
            columns: ["reviewer_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_levels: {
        Row: {
          code: Database["public"]["Enums"]["course_level_type"]
          created_at: string
          display_name: string
          duration_years: number
          id: string
          updated_at: string
        }
        Insert: {
          code: Database["public"]["Enums"]["course_level_type"]
          created_at?: string
          display_name: string
          duration_years: number
          id?: string
          updated_at?: string
        }
        Update: {
          code?: Database["public"]["Enums"]["course_level_type"]
          created_at?: string
          display_name?: string
          duration_years?: number
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      dashboard_preferences: {
        Row: {
          active_dashboard_id: string | null
          created_at: string
          id: string
          layout_overrides: Json
          profile_id: string
          updated_at: string
        }
        Insert: {
          active_dashboard_id?: string | null
          created_at?: string
          id?: string
          layout_overrides?: Json
          profile_id: string
          updated_at?: string
        }
        Update: {
          active_dashboard_id?: string | null
          created_at?: string
          id?: string
          layout_overrides?: Json
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_preferences_active_dashboard_id_fkey"
            columns: ["active_dashboard_id"]
            isOneToOne: false
            referencedRelation: "analytics_dashboards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_preferences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      department_contacts: {
        Row: {
          created_at: string
          department_id: string
          email: string | null
          fax: string | null
          google_maps_url: string | null
          id: string
          office_address: string | null
          phone: string | null
          social_links: Json | null
          telephone: string | null
          updated_at: string
          website: string | null
          working_hours: Json | null
        }
        Insert: {
          created_at?: string
          department_id: string
          email?: string | null
          fax?: string | null
          google_maps_url?: string | null
          id?: string
          office_address?: string | null
          phone?: string | null
          social_links?: Json | null
          telephone?: string | null
          updated_at?: string
          website?: string | null
          working_hours?: Json | null
        }
        Update: {
          created_at?: string
          department_id?: string
          email?: string | null
          fax?: string | null
          google_maps_url?: string | null
          id?: string
          office_address?: string | null
          phone?: string | null
          social_links?: Json | null
          telephone?: string | null
          updated_at?: string
          website?: string | null
          working_hours?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "department_contacts_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: true
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_contacts_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: true
            referencedRelation: "mv_department_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "department_contacts_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: true
            referencedRelation: "v_department_public_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_contacts_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: true
            referencedRelation: "v_department_statistics"
            referencedColumns: ["department_id"]
          },
        ]
      }
      department_crs: {
        Row: {
          academic_session_id: string | null
          assigned_by: string | null
          created_at: string
          department_id: string
          id: string
          is_active: boolean
          permissions_grant: Json
          profile_id: string
          remarks: string | null
          role_title: string
          term_end_date: string | null
          term_start_date: string
          updated_at: string
        }
        Insert: {
          academic_session_id?: string | null
          assigned_by?: string | null
          created_at?: string
          department_id: string
          id?: string
          is_active?: boolean
          permissions_grant?: Json
          profile_id: string
          remarks?: string | null
          role_title?: string
          term_end_date?: string | null
          term_start_date?: string
          updated_at?: string
        }
        Update: {
          academic_session_id?: string | null
          assigned_by?: string | null
          created_at?: string
          department_id?: string
          id?: string
          is_active?: boolean
          permissions_grant?: Json
          profile_id?: string
          remarks?: string | null
          role_title?: string
          term_end_date?: string | null
          term_start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "department_crs_academic_session_id_fkey"
            columns: ["academic_session_id"]
            isOneToOne: false
            referencedRelation: "academic_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_crs_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_crs_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_crs_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "mv_department_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "department_crs_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_department_public_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_crs_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_department_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "department_crs_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      department_events: {
        Row: {
          coordinator_profile_id: string | null
          cover_media_id: string | null
          created_at: string
          department_id: string
          description: string
          event_end_time: string
          event_start_time: string
          event_type: string
          id: string
          is_featured: boolean
          is_published: boolean
          is_registration_required: boolean
          public_id: string
          registration_url: string | null
          slug: string
          title: string
          updated_at: string
          venue: string
          view_count: number
        }
        Insert: {
          coordinator_profile_id?: string | null
          cover_media_id?: string | null
          created_at?: string
          department_id: string
          description: string
          event_end_time: string
          event_start_time: string
          event_type?: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          is_registration_required?: boolean
          public_id?: string
          registration_url?: string | null
          slug: string
          title: string
          updated_at?: string
          venue: string
          view_count?: number
        }
        Update: {
          coordinator_profile_id?: string | null
          cover_media_id?: string | null
          created_at?: string
          department_id?: string
          description?: string
          event_end_time?: string
          event_start_time?: string
          event_type?: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          is_registration_required?: boolean
          public_id?: string
          registration_url?: string | null
          slug?: string
          title?: string
          updated_at?: string
          venue?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "department_events_coordinator_profile_id_fkey"
            columns: ["coordinator_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_events_cover_media_id_fkey"
            columns: ["cover_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_events_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_events_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "mv_department_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "department_events_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_department_public_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_events_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_department_statistics"
            referencedColumns: ["department_id"]
          },
        ]
      }
      department_highlights: {
        Row: {
          cover_media_id: string | null
          created_at: string
          deleted_at: string | null
          department_id: string
          description: string | null
          display_order: number
          icon_name: string | null
          id: string
          link_url: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          cover_media_id?: string | null
          created_at?: string
          deleted_at?: string | null
          department_id: string
          description?: string | null
          display_order?: number
          icon_name?: string | null
          id?: string
          link_url?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          cover_media_id?: string | null
          created_at?: string
          deleted_at?: string | null
          department_id?: string
          description?: string | null
          display_order?: number
          icon_name?: string | null
          id?: string
          link_url?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "department_highlights_cover_media_id_fkey"
            columns: ["cover_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_highlights_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_highlights_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "mv_department_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "department_highlights_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_department_public_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_highlights_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_department_statistics"
            referencedColumns: ["department_id"]
          },
        ]
      }
      department_hod: {
        Row: {
          created_at: string
          deleted_at: string | null
          department_id: string
          designation: string | null
          display_order: number
          end_date: string | null
          id: string
          is_current: boolean
          message: string | null
          name: string
          photo_media_id: string | null
          profile_id: string | null
          start_date: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          department_id: string
          designation?: string | null
          display_order?: number
          end_date?: string | null
          id?: string
          is_current?: boolean
          message?: string | null
          name: string
          photo_media_id?: string | null
          profile_id?: string | null
          start_date?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          department_id?: string
          designation?: string | null
          display_order?: number
          end_date?: string | null
          id?: string
          is_current?: boolean
          message?: string | null
          name?: string
          photo_media_id?: string | null
          profile_id?: string | null
          start_date?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "department_hod_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_hod_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "mv_department_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "department_hod_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_department_public_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_hod_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_department_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "department_hod_photo_media_id_fkey"
            columns: ["photo_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_hod_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      department_manual_metrics: {
        Row: {
          created_at: string
          department_id: string
          display_order: number
          id: string
          metric_label_1: string | null
          metric_label_2: string | null
          metric_label_3: string | null
          metric_label_4: string | null
          metric_value_1: string | null
          metric_value_2: string | null
          metric_value_3: string | null
          metric_value_4: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          department_id: string
          display_order?: number
          id?: string
          metric_label_1?: string | null
          metric_label_2?: string | null
          metric_label_3?: string | null
          metric_label_4?: string | null
          metric_value_1?: string | null
          metric_value_2?: string | null
          metric_value_3?: string | null
          metric_value_4?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          department_id?: string
          display_order?: number
          id?: string
          metric_label_1?: string | null
          metric_label_2?: string | null
          metric_label_3?: string | null
          metric_label_4?: string | null
          metric_value_1?: string | null
          metric_value_2?: string | null
          metric_value_3?: string | null
          metric_value_4?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "department_manual_metrics_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: true
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_manual_metrics_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: true
            referencedRelation: "mv_department_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "department_manual_metrics_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: true
            referencedRelation: "v_department_public_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_manual_metrics_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: true
            referencedRelation: "v_department_statistics"
            referencedColumns: ["department_id"]
          },
        ]
      }
      department_notices: {
        Row: {
          attachment_media_id: string | null
          content: string
          created_at: string
          department_id: string
          expires_at: string | null
          id: string
          is_pinned: boolean
          is_published: boolean
          priority: string
          public_id: string
          published_at: string
          published_by: string | null
          slug: string
          target_audience: string
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          attachment_media_id?: string | null
          content: string
          created_at?: string
          department_id: string
          expires_at?: string | null
          id?: string
          is_pinned?: boolean
          is_published?: boolean
          priority?: string
          public_id?: string
          published_at?: string
          published_by?: string | null
          slug: string
          target_audience?: string
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          attachment_media_id?: string | null
          content?: string
          created_at?: string
          department_id?: string
          expires_at?: string | null
          id?: string
          is_pinned?: boolean
          is_published?: boolean
          priority?: string
          public_id?: string
          published_at?: string
          published_by?: string | null
          slug?: string
          target_audience?: string
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "department_notices_attachment_media_id_fkey"
            columns: ["attachment_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_notices_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_notices_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "mv_department_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "department_notices_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_department_public_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_notices_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_department_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "department_notices_published_by_fkey"
            columns: ["published_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      department_programs: {
        Row: {
          admission_url: string | null
          brochure_media_id: string | null
          career_opportunities: string | null
          course_level_id: string
          created_at: string
          curriculum_url: string | null
          deleted_at: string | null
          department_id: string
          description: string | null
          display_order: number
          duration_years: number
          eligibility: string | null
          id: string
          intake_capacity: number | null
          is_active: boolean
          learning_outcomes: string | null
          overview: string | null
          program_name: string
          published_at: string | null
          published_by: string | null
          seo_metadata: Json | null
          short_name: string | null
          slug: string | null
          status: string
          syllabus_media_id: string | null
          updated_at: string
        }
        Insert: {
          admission_url?: string | null
          brochure_media_id?: string | null
          career_opportunities?: string | null
          course_level_id: string
          created_at?: string
          curriculum_url?: string | null
          deleted_at?: string | null
          department_id: string
          description?: string | null
          display_order?: number
          duration_years: number
          eligibility?: string | null
          id?: string
          intake_capacity?: number | null
          is_active?: boolean
          learning_outcomes?: string | null
          overview?: string | null
          program_name: string
          published_at?: string | null
          published_by?: string | null
          seo_metadata?: Json | null
          short_name?: string | null
          slug?: string | null
          status?: string
          syllabus_media_id?: string | null
          updated_at?: string
        }
        Update: {
          admission_url?: string | null
          brochure_media_id?: string | null
          career_opportunities?: string | null
          course_level_id?: string
          created_at?: string
          curriculum_url?: string | null
          deleted_at?: string | null
          department_id?: string
          description?: string | null
          display_order?: number
          duration_years?: number
          eligibility?: string | null
          id?: string
          intake_capacity?: number | null
          is_active?: boolean
          learning_outcomes?: string | null
          overview?: string | null
          program_name?: string
          published_at?: string | null
          published_by?: string | null
          seo_metadata?: Json | null
          short_name?: string | null
          slug?: string | null
          status?: string
          syllabus_media_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "department_programs_brochure_media_id_fkey"
            columns: ["brochure_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_programs_course_level_id_fkey"
            columns: ["course_level_id"]
            isOneToOne: false
            referencedRelation: "course_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_programs_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_programs_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "mv_department_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "department_programs_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_department_public_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_programs_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_department_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "department_programs_published_by_fkey"
            columns: ["published_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_programs_syllabus_media_id_fkey"
            columns: ["syllabus_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
        ]
      }
      department_publications: {
        Row: {
          academic_session_id: string | null
          cover_media_id: string | null
          created_at: string
          department_id: string
          description: string | null
          document_media_id: string
          download_count: number
          editor_in_chief: string | null
          id: string
          is_public: boolean
          public_id: string
          publication_type: string
          publish_date: string
          slug: string
          title: string
          updated_at: string
          uploaded_by: string | null
          volume_number: string | null
        }
        Insert: {
          academic_session_id?: string | null
          cover_media_id?: string | null
          created_at?: string
          department_id: string
          description?: string | null
          document_media_id: string
          download_count?: number
          editor_in_chief?: string | null
          id?: string
          is_public?: boolean
          public_id?: string
          publication_type?: string
          publish_date?: string
          slug: string
          title: string
          updated_at?: string
          uploaded_by?: string | null
          volume_number?: string | null
        }
        Update: {
          academic_session_id?: string | null
          cover_media_id?: string | null
          created_at?: string
          department_id?: string
          description?: string | null
          document_media_id?: string
          download_count?: number
          editor_in_chief?: string | null
          id?: string
          is_public?: boolean
          public_id?: string
          publication_type?: string
          publish_date?: string
          slug?: string
          title?: string
          updated_at?: string
          uploaded_by?: string | null
          volume_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "department_publications_academic_session_id_fkey"
            columns: ["academic_session_id"]
            isOneToOne: false
            referencedRelation: "academic_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_publications_cover_media_id_fkey"
            columns: ["cover_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_publications_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_publications_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "mv_department_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "department_publications_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_department_public_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_publications_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_department_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "department_publications_document_media_id_fkey"
            columns: ["document_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_publications_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      department_seo: {
        Row: {
          canonical_url: string | null
          created_at: string
          department_id: string
          id: string
          keywords: string | null
          meta_description: string | null
          meta_title: string | null
          og_description: string | null
          og_image: Json | null
          og_title: string | null
          robots: string | null
          schema_markup: Json | null
          twitter_description: string | null
          twitter_image: Json | null
          twitter_title: string | null
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          department_id: string
          id?: string
          keywords?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: Json | null
          og_title?: string | null
          robots?: string | null
          schema_markup?: Json | null
          twitter_description?: string | null
          twitter_image?: Json | null
          twitter_title?: string | null
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          department_id?: string
          id?: string
          keywords?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: Json | null
          og_title?: string | null
          robots?: string | null
          schema_markup?: Json | null
          twitter_description?: string | null
          twitter_image?: Json | null
          twitter_title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "department_seo_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: true
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_seo_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: true
            referencedRelation: "mv_department_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "department_seo_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: true
            referencedRelation: "v_department_public_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_seo_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: true
            referencedRelation: "v_department_statistics"
            referencedColumns: ["department_id"]
          },
        ]
      }
      department_settings: {
        Row: {
          created_at: string
          custom_css: string | null
          department_id: string
          id: string
          is_accepting_admissions: boolean
          layout_style: string | null
          show_faculty_profiles: boolean
          show_student_profiles: boolean
          theme_color: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_css?: string | null
          department_id: string
          id?: string
          is_accepting_admissions?: boolean
          layout_style?: string | null
          show_faculty_profiles?: boolean
          show_student_profiles?: boolean
          theme_color?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_css?: string | null
          department_id?: string
          id?: string
          is_accepting_admissions?: boolean
          layout_style?: string | null
          show_faculty_profiles?: boolean
          show_student_profiles?: boolean
          theme_color?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "department_settings_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: true
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_settings_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: true
            referencedRelation: "mv_department_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "department_settings_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: true
            referencedRelation: "v_department_public_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_settings_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: true
            referencedRelation: "v_department_statistics"
            referencedColumns: ["department_id"]
          },
        ]
      }
      department_students: {
        Row: {
          academic_session_id: string | null
          approved_by_role: string | null
          batch_id: string | null
          created_at: string
          deleted_at: string | null
          department_id: string
          department_program_id: string | null
          display_order: number
          id: string
          is_active: boolean
          is_featured: boolean
          is_verified_by_cr: boolean
          leadership_role: string | null
          membership_status: string
          profile_id: string
          snapshot_version: number
          source_education_record_id: string | null
          status: string
          updated_at: string
          verification_request_id: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          academic_session_id?: string | null
          approved_by_role?: string | null
          batch_id?: string | null
          created_at?: string
          deleted_at?: string | null
          department_id: string
          department_program_id?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          is_featured?: boolean
          is_verified_by_cr?: boolean
          leadership_role?: string | null
          membership_status?: string
          profile_id: string
          snapshot_version?: number
          source_education_record_id?: string | null
          status?: string
          updated_at?: string
          verification_request_id?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          academic_session_id?: string | null
          approved_by_role?: string | null
          batch_id?: string | null
          created_at?: string
          deleted_at?: string | null
          department_id?: string
          department_program_id?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          is_featured?: boolean
          is_verified_by_cr?: boolean
          leadership_role?: string | null
          membership_status?: string
          profile_id?: string
          snapshot_version?: number
          source_education_record_id?: string | null
          status?: string
          updated_at?: string
          verification_request_id?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "department_students_academic_session_id_fkey"
            columns: ["academic_session_id"]
            isOneToOne: false
            referencedRelation: "academic_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_students_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_students_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_students_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "mv_department_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "department_students_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_department_public_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_students_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_department_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "department_students_department_program_id_fkey"
            columns: ["department_program_id"]
            isOneToOne: false
            referencedRelation: "department_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_students_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_students_source_education_record_id_fkey"
            columns: ["source_education_record_id"]
            isOneToOne: false
            referencedRelation: "education_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_students_verification_request_id_fkey"
            columns: ["verification_request_id"]
            isOneToOne: false
            referencedRelation: "verification_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_students_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      department_teachers: {
        Row: {
          bio_override: string | null
          biography: string | null
          contact_email: string | null
          contact_phone: string | null
          cover_media_id: string | null
          created_at: string
          cv_media_id: string | null
          deleted_at: string | null
          department_id: string
          designation_id: string | null
          designation_title: string
          display_order: number
          employee_code: string | null
          experience_years: number | null
          faculty_type_id: string | null
          google_scholar_url: string | null
          id: string
          is_active: boolean
          is_featured: boolean
          is_hod: boolean
          is_visiting: boolean
          joining_date: string | null
          linkedin_url: string | null
          office_hours: string | null
          office_location: string | null
          orcid_id: string | null
          profile_id: string
          profile_media_id: string | null
          published_at: string | null
          published_by: string | null
          qualification: string | null
          research_interests: string[] | null
          researchgate_url: string | null
          scopus_id: string | null
          specialization: string | null
          status: string
          teaching_areas: string[] | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          bio_override?: string | null
          biography?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          cover_media_id?: string | null
          created_at?: string
          cv_media_id?: string | null
          deleted_at?: string | null
          department_id: string
          designation_id?: string | null
          designation_title?: string
          display_order?: number
          employee_code?: string | null
          experience_years?: number | null
          faculty_type_id?: string | null
          google_scholar_url?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          is_hod?: boolean
          is_visiting?: boolean
          joining_date?: string | null
          linkedin_url?: string | null
          office_hours?: string | null
          office_location?: string | null
          orcid_id?: string | null
          profile_id: string
          profile_media_id?: string | null
          published_at?: string | null
          published_by?: string | null
          qualification?: string | null
          research_interests?: string[] | null
          researchgate_url?: string | null
          scopus_id?: string | null
          specialization?: string | null
          status?: string
          teaching_areas?: string[] | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          bio_override?: string | null
          biography?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          cover_media_id?: string | null
          created_at?: string
          cv_media_id?: string | null
          deleted_at?: string | null
          department_id?: string
          designation_id?: string | null
          designation_title?: string
          display_order?: number
          employee_code?: string | null
          experience_years?: number | null
          faculty_type_id?: string | null
          google_scholar_url?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          is_hod?: boolean
          is_visiting?: boolean
          joining_date?: string | null
          linkedin_url?: string | null
          office_hours?: string | null
          office_location?: string | null
          orcid_id?: string | null
          profile_id?: string
          profile_media_id?: string | null
          published_at?: string | null
          published_by?: string | null
          qualification?: string | null
          research_interests?: string[] | null
          researchgate_url?: string | null
          scopus_id?: string | null
          specialization?: string | null
          status?: string
          teaching_areas?: string[] | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "department_teachers_cover_media_id_fkey"
            columns: ["cover_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_teachers_cv_media_id_fkey"
            columns: ["cv_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_teachers_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_teachers_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "mv_department_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "department_teachers_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_department_public_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_teachers_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_department_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "department_teachers_designation_id_fkey"
            columns: ["designation_id"]
            isOneToOne: false
            referencedRelation: "teacher_designations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_teachers_faculty_type_id_fkey"
            columns: ["faculty_type_id"]
            isOneToOne: false
            referencedRelation: "faculty_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_teachers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_teachers_profile_media_id_fkey"
            columns: ["profile_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_teachers_published_by_fkey"
            columns: ["published_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          academic_excellence: string | null
          category: string | null
          contact_email: string | null
          contact_phone: string | null
          cover_media_id: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          display_order: number
          established_year: number | null
          hero_media_id: string | null
          hero_quote: string | null
          hod_message: string | null
          hod_profile_id: string | null
          id: string
          is_active: boolean
          is_verified: boolean
          location: string | null
          logo_media_id: string | null
          mission: string | null
          motto: string | null
          name: string
          office_location: string | null
          official_website: string | null
          short_name: string | null
          slug: string
          theme_color: string | null
          updated_at: string
          verified_at: string | null
          verified_by: string | null
          vision: string | null
        }
        Insert: {
          academic_excellence?: string | null
          category?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          cover_media_id?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          display_order?: number
          established_year?: number | null
          hero_media_id?: string | null
          hero_quote?: string | null
          hod_message?: string | null
          hod_profile_id?: string | null
          id?: string
          is_active?: boolean
          is_verified?: boolean
          location?: string | null
          logo_media_id?: string | null
          mission?: string | null
          motto?: string | null
          name: string
          office_location?: string | null
          official_website?: string | null
          short_name?: string | null
          slug: string
          theme_color?: string | null
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
          vision?: string | null
        }
        Update: {
          academic_excellence?: string | null
          category?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          cover_media_id?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          display_order?: number
          established_year?: number | null
          hero_media_id?: string | null
          hero_quote?: string | null
          hod_message?: string | null
          hod_profile_id?: string | null
          id?: string
          is_active?: boolean
          is_verified?: boolean
          location?: string | null
          logo_media_id?: string | null
          mission?: string | null
          motto?: string | null
          name?: string
          office_location?: string | null
          official_website?: string | null
          short_name?: string | null
          slug?: string
          theme_color?: string | null
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
          vision?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_cover_media_id_fkey"
            columns: ["cover_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_hero_media_id_fkey"
            columns: ["hero_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_hod_profile_id_fkey"
            columns: ["hod_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_logo_media_id_fkey"
            columns: ["logo_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      donation_audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          new_state: Json | null
          previous_state: Json | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          new_state?: Json | null
          previous_state?: Json | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          new_state?: Json | null
          previous_state?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "donation_audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      donation_campaigns: {
        Row: {
          ai_metadata: Json | null
          beneficiary_entity_id: string | null
          beneficiary_entity_type:
            | Database["public"]["Enums"]["entity_type"]
            | null
          created_at: string
          created_by: string | null
          description: string | null
          donor_count: number
          ends_at: string | null
          featured_media_id: string | null
          id: string
          is_active: boolean
          is_featured: boolean
          minimum_donation: number
          public_id: string
          raised_amount: number
          slug: string
          starts_at: string | null
          status: Database["public"]["Enums"]["campaign_status"]
          target_amount: number
          title: string
          updated_at: string
        }
        Insert: {
          ai_metadata?: Json | null
          beneficiary_entity_id?: string | null
          beneficiary_entity_type?:
            | Database["public"]["Enums"]["entity_type"]
            | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          donor_count?: number
          ends_at?: string | null
          featured_media_id?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          minimum_donation?: number
          public_id?: string
          raised_amount?: number
          slug: string
          starts_at?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          target_amount?: number
          title: string
          updated_at?: string
        }
        Update: {
          ai_metadata?: Json | null
          beneficiary_entity_id?: string | null
          beneficiary_entity_type?:
            | Database["public"]["Enums"]["entity_type"]
            | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          donor_count?: number
          ends_at?: string | null
          featured_media_id?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          minimum_donation?: number
          public_id?: string
          raised_amount?: number
          slug?: string
          starts_at?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          target_amount?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "donation_campaigns_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donation_campaigns_featured_media_id_fkey"
            columns: ["featured_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
        ]
      }
      donation_receipts: {
        Row: {
          donation_id: string
          generated_at: string
          generated_by: string | null
          id: string
          receipt_media_id: string | null
        }
        Insert: {
          donation_id: string
          generated_at?: string
          generated_by?: string | null
          id?: string
          receipt_media_id?: string | null
        }
        Update: {
          donation_id?: string
          generated_at?: string
          generated_by?: string | null
          id?: string
          receipt_media_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donation_receipts_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: true
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donation_receipts_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donation_receipts_receipt_media_id_fkey"
            columns: ["receipt_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          admin_note: string | null
          amount: number
          base_amount: number
          campaign_id: string | null
          created_at: string
          created_by: string | null
          currency: string
          donated_at: string
          donation_type: Database["public"]["Enums"]["donation_type"]
          donor_email: string | null
          donor_name_override: string | null
          donor_phone: string | null
          exchange_rate: number
          frequency: Database["public"]["Enums"]["donation_frequency"]
          fund_id: string | null
          id: string
          is_anonymous: boolean
          message: string | null
          payment_gateway_ref: string | null
          payment_id: string | null
          profile_id: string | null
          public_id: string
          receipt_number: string | null
          status: Database["public"]["Enums"]["donation_status"]
          target_entity_id: string | null
          target_entity_type: Database["public"]["Enums"]["entity_type"] | null
          verified_at: string | null
          verified_by: string | null
          visibility: Database["public"]["Enums"]["donation_visibility"]
        }
        Insert: {
          admin_note?: string | null
          amount: number
          base_amount?: number
          campaign_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          donated_at?: string
          donation_type?: Database["public"]["Enums"]["donation_type"]
          donor_email?: string | null
          donor_name_override?: string | null
          donor_phone?: string | null
          exchange_rate?: number
          frequency?: Database["public"]["Enums"]["donation_frequency"]
          fund_id?: string | null
          id?: string
          is_anonymous?: boolean
          message?: string | null
          payment_gateway_ref?: string | null
          payment_id?: string | null
          profile_id?: string | null
          public_id?: string
          receipt_number?: string | null
          status?: Database["public"]["Enums"]["donation_status"]
          target_entity_id?: string | null
          target_entity_type?: Database["public"]["Enums"]["entity_type"] | null
          verified_at?: string | null
          verified_by?: string | null
          visibility?: Database["public"]["Enums"]["donation_visibility"]
        }
        Update: {
          admin_note?: string | null
          amount?: number
          base_amount?: number
          campaign_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          donated_at?: string
          donation_type?: Database["public"]["Enums"]["donation_type"]
          donor_email?: string | null
          donor_name_override?: string | null
          donor_phone?: string | null
          exchange_rate?: number
          frequency?: Database["public"]["Enums"]["donation_frequency"]
          fund_id?: string | null
          id?: string
          is_anonymous?: boolean
          message?: string | null
          payment_gateway_ref?: string | null
          payment_id?: string | null
          profile_id?: string | null
          public_id?: string
          receipt_number?: string | null
          status?: Database["public"]["Enums"]["donation_status"]
          target_entity_id?: string | null
          target_entity_type?: Database["public"]["Enums"]["entity_type"] | null
          verified_at?: string | null
          verified_by?: string | null
          visibility?: Database["public"]["Enums"]["donation_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "donations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "donation_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_fund_id_fkey"
            columns: ["fund_id"]
            isOneToOne: false
            referencedRelation: "endowment_funds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: true
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      editorial_boards: {
        Row: {
          created_at: string
          id: string
          profile_id: string
          publication_id: string
          role: Database["public"]["Enums"]["editorial_role"]
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id: string
          publication_id: string
          role: Database["public"]["Enums"]["editorial_role"]
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string
          publication_id?: string
          role?: Database["public"]["Enums"]["editorial_role"]
        }
        Relationships: [
          {
            foreignKeyName: "editorial_boards_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "editorial_boards_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publications"
            referencedColumns: ["id"]
          },
        ]
      }
      education_records: {
        Row: {
          academic_status: Database["public"]["Enums"]["academic_status"]
          admission_date: string | null
          batch_id: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          department_program_id: string
          graduation_date: string | null
          id: string
          is_primary: boolean
          is_verified: boolean
          profile_id: string
          registration_number: string | null
          roll_number: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          academic_status?: Database["public"]["Enums"]["academic_status"]
          admission_date?: string | null
          batch_id: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          department_program_id: string
          graduation_date?: string | null
          id?: string
          is_primary?: boolean
          is_verified?: boolean
          profile_id: string
          registration_number?: string | null
          roll_number?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          academic_status?: Database["public"]["Enums"]["academic_status"]
          admission_date?: string | null
          batch_id?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          department_program_id?: string
          graduation_date?: string | null
          id?: string
          is_primary?: boolean
          is_verified?: boolean
          profile_id?: string
          registration_number?: string | null
          roll_number?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "education_records_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_records_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_records_department_program_id_fkey"
            columns: ["department_program_id"]
            isOneToOne: false
            referencedRelation: "department_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_records_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_records_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_notification_queue: {
        Row: {
          body: string
          created_at: string
          id: string
          notification_id: string | null
          recipient_email: string
          retry_count: number
          sent: boolean
          sent_at: string | null
          subject: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          notification_id?: string | null
          recipient_email: string
          retry_count?: number
          sent?: boolean
          sent_at?: string | null
          subject: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          notification_id?: string | null
          recipient_email?: string
          retry_count?: number
          sent?: boolean
          sent_at?: string | null
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_notification_queue_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      endowment_funds: {
        Row: {
          allocated_amount: number
          available_balance: number
          beneficiary_entity_id: string | null
          beneficiary_entity_type:
            | Database["public"]["Enums"]["entity_type"]
            | null
          created_at: string
          description: string | null
          disbursed_amount: number
          fund_type: Database["public"]["Enums"]["fund_type"]
          id: string
          is_active: boolean
          name: string
          principal_amount: number
          updated_at: string
        }
        Insert: {
          allocated_amount?: number
          available_balance?: number
          beneficiary_entity_id?: string | null
          beneficiary_entity_type?:
            | Database["public"]["Enums"]["entity_type"]
            | null
          created_at?: string
          description?: string | null
          disbursed_amount?: number
          fund_type?: Database["public"]["Enums"]["fund_type"]
          id?: string
          is_active?: boolean
          name: string
          principal_amount?: number
          updated_at?: string
        }
        Update: {
          allocated_amount?: number
          available_balance?: number
          beneficiary_entity_id?: string | null
          beneficiary_entity_type?:
            | Database["public"]["Enums"]["entity_type"]
            | null
          created_at?: string
          description?: string | null
          disbursed_amount?: number
          fund_type?: Database["public"]["Enums"]["fund_type"]
          id?: string
          is_active?: boolean
          name?: string
          principal_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      entity_follows: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          id: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          id?: string
          profile_id: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["entity_type"]
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_follows_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_attendance: {
        Row: {
          check_in_time: string
          check_out_time: string | null
          checked_in_by: string | null
          id: string
          method: string
          registration_id: string
        }
        Insert: {
          check_in_time?: string
          check_out_time?: string | null
          checked_in_by?: string | null
          id?: string
          method?: string
          registration_id: string
        }
        Update: {
          check_in_time?: string
          check_out_time?: string | null
          checked_in_by?: string | null
          id?: string
          method?: string
          registration_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendance_checked_in_by_fkey"
            columns: ["checked_in_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendance_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: true
            referencedRelation: "event_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      event_budgets: {
        Row: {
          created_at: string
          event_id: string
          id: string
          other_revenue: number | null
          sponsor_income: number | null
          total_budget: number | null
          total_expenses: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          other_revenue?: number | null
          sponsor_income?: number | null
          total_budget?: number | null
          total_expenses?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          other_revenue?: number | null
          sponsor_income?: number | null
          total_budget?: number | null
          total_expenses?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_budgets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: true
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_feedback: {
        Row: {
          comments: string | null
          created_at: string
          event_id: string
          id: string
          profile_id: string
          rating: number | null
        }
        Insert: {
          comments?: string | null
          created_at?: string
          event_id: string
          id?: string
          profile_id: string
          rating?: number | null
        }
        Update: {
          comments?: string | null
          created_at?: string
          event_id?: string
          id?: string
          profile_id?: string
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "event_feedback_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_feedback_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_live_updates: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          event_id: string
          id: string
          media_id: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          event_id: string
          id?: string
          media_id?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          event_id?: string
          id?: string
          media_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_live_updates_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_live_updates_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_live_updates_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          event_id: string
          id: string
          metadata: Json | null
          profile_id: string
          registration_date: string
          status: string
        }
        Insert: {
          event_id: string
          id?: string
          metadata?: Json | null
          profile_id: string
          registration_date?: string
          status?: string
        }
        Update: {
          event_id?: string
          id?: string
          metadata?: Json | null
          profile_id?: string
          registration_date?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_registrations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_resources: {
        Row: {
          created_at: string
          event_id: string
          id: string
          media_id: string
          resource_type: string
          title: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          media_id: string
          resource_type?: string
          title: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          media_id?: string
          resource_type?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_resources_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_resources_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
        ]
      }
      event_schedule: {
        Row: {
          created_at: string
          description: string | null
          end_time: string
          event_id: string
          id: string
          speaker_id: string | null
          start_time: string
          title: string
          venue: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_time: string
          event_id: string
          id?: string
          speaker_id?: string | null
          start_time: string
          title: string
          venue?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          end_time?: string
          event_id?: string
          id?: string
          speaker_id?: string | null
          start_time?: string
          title?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_schedule_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_schedule_speaker_id_fkey"
            columns: ["speaker_id"]
            isOneToOne: false
            referencedRelation: "event_speakers"
            referencedColumns: ["id"]
          },
        ]
      }
      event_speakers: {
        Row: {
          created_at: string
          display_order: number
          event_id: string
          external_bio: string | null
          external_company: string | null
          external_name: string | null
          id: string
          profile_id: string | null
          role: string
          speaker_type: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          event_id: string
          external_bio?: string | null
          external_company?: string | null
          external_name?: string | null
          id?: string
          profile_id?: string | null
          role?: string
          speaker_type?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          event_id?: string
          external_bio?: string | null
          external_company?: string | null
          external_name?: string | null
          id?: string
          profile_id?: string | null
          role?: string
          speaker_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_speakers_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_speakers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_sponsors: {
        Row: {
          contribution_amount: number | null
          created_at: string
          event_id: string
          id: string
          logo_media_id: string | null
          name: string
          tier: string
          website_url: string | null
        }
        Insert: {
          contribution_amount?: number | null
          created_at?: string
          event_id: string
          id?: string
          logo_media_id?: string | null
          name: string
          tier?: string
          website_url?: string | null
        }
        Update: {
          contribution_amount?: number | null
          created_at?: string
          event_id?: string
          id?: string
          logo_media_id?: string | null
          name?: string
          tier?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_sponsors_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_sponsors_logo_media_id_fkey"
            columns: ["logo_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
        ]
      }
      event_volunteers: {
        Row: {
          created_at: string
          event_id: string
          hours_logged: number | null
          id: string
          profile_id: string
          role: string
        }
        Insert: {
          created_at?: string
          event_id: string
          hours_logged?: number | null
          id?: string
          profile_id: string
          role: string
        }
        Update: {
          created_at?: string
          event_id?: string
          hours_logged?: number | null
          id?: string
          profile_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_volunteers_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_volunteers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          cover_media_id: string | null
          created_at: string
          description: string | null
          event_category: string
          event_end_time: string
          event_start_time: string
          id: string
          is_featured: boolean
          is_published: boolean
          is_registration_required: boolean
          organizer_id: string | null
          public_id: string
          registration_url: string | null
          scope_id: string | null
          scope_type: string
          slug: string
          title: string
          updated_at: string
          venue: string
          view_count: number
          visibility: string
        }
        Insert: {
          cover_media_id?: string | null
          created_at?: string
          description?: string | null
          event_category?: string
          event_end_time: string
          event_start_time: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          is_registration_required?: boolean
          organizer_id?: string | null
          public_id?: string
          registration_url?: string | null
          scope_id?: string | null
          scope_type: string
          slug: string
          title: string
          updated_at?: string
          venue: string
          view_count?: number
          visibility?: string
        }
        Update: {
          cover_media_id?: string | null
          created_at?: string
          description?: string | null
          event_category?: string
          event_end_time?: string
          event_start_time?: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          is_registration_required?: boolean
          organizer_id?: string | null
          public_id?: string
          registration_url?: string | null
          scope_id?: string | null
          scope_type?: string
          slug?: string
          title?: string
          updated_at?: string
          venue?: string
          view_count?: number
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_cover_media_id_fkey"
            columns: ["cover_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      external_participant_profiles: {
        Row: {
          college_name: string
          course_level: Database["public"]["Enums"]["course_level_type"]
          course_name: string | null
          created_at: string
          current_year: string | null
          profile_id: string
          state: string | null
          updated_at: string
        }
        Insert: {
          college_name: string
          course_level: Database["public"]["Enums"]["course_level_type"]
          course_name?: string | null
          created_at?: string
          current_year?: string | null
          profile_id: string
          state?: string | null
          updated_at?: string
        }
        Update: {
          college_name?: string
          course_level?: Database["public"]["Enums"]["course_level_type"]
          course_name?: string | null
          created_at?: string
          current_year?: string | null
          profile_id?: string
          state?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "external_participant_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      facilities: {
        Row: {
          description: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      faculty_profiles: {
        Row: {
          created_at: string
          department_id: string
          designation_id: string
          employee_code: string | null
          id: string
          is_verified: boolean
          joining_date: string | null
          leaving_date: string | null
          profile_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department_id: string
          designation_id: string
          employee_code?: string | null
          id?: string
          is_verified?: boolean
          joining_date?: string | null
          leaving_date?: string | null
          profile_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department_id?: string
          designation_id?: string
          employee_code?: string | null
          id?: string
          is_verified?: boolean
          joining_date?: string | null
          leaving_date?: string | null
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "faculty_profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "mv_department_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "faculty_profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_department_public_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_department_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "faculty_profiles_designation_id_fkey"
            columns: ["designation_id"]
            isOneToOne: false
            referencedRelation: "teacher_designations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty_types: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      fund_allocations: {
        Row: {
          allocated_date: string | null
          amount: number
          approved_by: string | null
          beneficiary_entity_id: string | null
          beneficiary_entity_type:
            | Database["public"]["Enums"]["entity_type"]
            | null
          created_at: string
          disbursed_date: string | null
          fund_id: string
          id: string
          purpose: string
          status: Database["public"]["Enums"]["fund_allocation_status"]
          updated_at: string
        }
        Insert: {
          allocated_date?: string | null
          amount: number
          approved_by?: string | null
          beneficiary_entity_id?: string | null
          beneficiary_entity_type?:
            | Database["public"]["Enums"]["entity_type"]
            | null
          created_at?: string
          disbursed_date?: string | null
          fund_id: string
          id?: string
          purpose: string
          status?: Database["public"]["Enums"]["fund_allocation_status"]
          updated_at?: string
        }
        Update: {
          allocated_date?: string | null
          amount?: number
          approved_by?: string | null
          beneficiary_entity_id?: string | null
          beneficiary_entity_type?:
            | Database["public"]["Enums"]["entity_type"]
            | null
          created_at?: string
          disbursed_date?: string | null
          fund_id?: string
          id?: string
          purpose?: string
          status?: Database["public"]["Enums"]["fund_allocation_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fund_allocations_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fund_allocations_fund_id_fkey"
            columns: ["fund_id"]
            isOneToOne: false
            referencedRelation: "endowment_funds"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_albums: {
        Row: {
          album_date: string | null
          category_id: string | null
          cover_media_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description: string | null
          display_order: number
          entity_id: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          id: string
          is_featured: boolean
          is_public: boolean
          public_id: string
          seo_metadata: Json | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          album_date?: string | null
          category_id?: string | null
          cover_media_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          display_order?: number
          entity_id: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          id?: string
          is_featured?: boolean
          is_public?: boolean
          public_id?: string
          seo_metadata?: Json | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          album_date?: string | null
          category_id?: string | null
          cover_media_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          display_order?: number
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["entity_type"]
          id?: string
          is_featured?: boolean
          is_public?: boolean
          public_id?: string
          seo_metadata?: Json | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_albums_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "gallery_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_albums_cover_media_id_fkey"
            columns: ["cover_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_albums_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_categories: {
        Row: {
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      gallery_collaborators: {
        Row: {
          assigned_by: string | null
          can_manage: boolean
          can_upload: boolean
          created_at: string
          gallery_album_id: string
          id: string
          profile_id: string
        }
        Insert: {
          assigned_by?: string | null
          can_manage?: boolean
          can_upload?: boolean
          created_at?: string
          gallery_album_id: string
          id?: string
          profile_id: string
        }
        Update: {
          assigned_by?: string | null
          can_manage?: boolean
          can_upload?: boolean
          created_at?: string
          gallery_album_id?: string
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_collaborators_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_collaborators_gallery_album_id_fkey"
            columns: ["gallery_album_id"]
            isOneToOne: false
            referencedRelation: "gallery_albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_collaborators_gallery_album_id_fkey"
            columns: ["gallery_album_id"]
            isOneToOne: false
            referencedRelation: "v_department_galleries"
            referencedColumns: ["album_id"]
          },
          {
            foreignKeyName: "gallery_collaborators_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_items: {
        Row: {
          caption: string | null
          copyright_info: string | null
          created_at: string
          credit: string | null
          deleted_at: string | null
          display_order: number
          gallery_album_id: string
          id: string
          is_cover: boolean
          is_featured: boolean
          location: string | null
          media_file_id: string
          photographer: string | null
          status: string
          tags: string[] | null
          taken_date: string | null
          uploaded_by: string | null
        }
        Insert: {
          caption?: string | null
          copyright_info?: string | null
          created_at?: string
          credit?: string | null
          deleted_at?: string | null
          display_order?: number
          gallery_album_id: string
          id?: string
          is_cover?: boolean
          is_featured?: boolean
          location?: string | null
          media_file_id: string
          photographer?: string | null
          status?: string
          tags?: string[] | null
          taken_date?: string | null
          uploaded_by?: string | null
        }
        Update: {
          caption?: string | null
          copyright_info?: string | null
          created_at?: string
          credit?: string | null
          deleted_at?: string | null
          display_order?: number
          gallery_album_id?: string
          id?: string
          is_cover?: boolean
          is_featured?: boolean
          location?: string | null
          media_file_id?: string
          photographer?: string | null
          status?: string
          tags?: string[] | null
          taken_date?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gallery_items_gallery_album_id_fkey"
            columns: ["gallery_album_id"]
            isOneToOne: false
            referencedRelation: "gallery_albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_items_gallery_album_id_fkey"
            columns: ["gallery_album_id"]
            isOneToOne: false
            referencedRelation: "v_department_galleries"
            referencedColumns: ["album_id"]
          },
          {
            foreignKeyName: "gallery_items_media_file_id_fkey"
            columns: ["media_file_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_items_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hostel_achievements: {
        Row: {
          awarded_date: string
          category: string | null
          certificate_media_id: string | null
          certificate_url: string | null
          created_at: string
          description: string | null
          hostel_id: string
          id: string
          is_verified: boolean
          issuer: string | null
          resident_profile_id: string | null
          title: string
        }
        Insert: {
          awarded_date: string
          category?: string | null
          certificate_media_id?: string | null
          certificate_url?: string | null
          created_at?: string
          description?: string | null
          hostel_id: string
          id?: string
          is_verified?: boolean
          issuer?: string | null
          resident_profile_id?: string | null
          title: string
        }
        Update: {
          awarded_date?: string
          category?: string | null
          certificate_media_id?: string | null
          certificate_url?: string | null
          created_at?: string
          description?: string | null
          hostel_id?: string
          id?: string
          is_verified?: boolean
          issuer?: string | null
          resident_profile_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "hostel_achievements_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostel_public_directory_v"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_achievements_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_achievements_resident_profile_id_fkey"
            columns: ["resident_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hostel_beds: {
        Row: {
          bed_number: string
          created_at: string
          id: string
          is_occupied: boolean
          room_id: string
          updated_at: string
        }
        Insert: {
          bed_number: string
          created_at?: string
          id?: string
          is_occupied?: boolean
          room_id: string
          updated_at?: string
        }
        Update: {
          bed_number?: string
          created_at?: string
          id?: string
          is_occupied?: boolean
          room_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hostel_beds_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "hostel_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      hostel_bmcs: {
        Row: {
          created_at: string
          hostel_id: string
          id: string
          is_active: boolean
          permissions_grant: Json
          profile_id: string
          role_title: string
          term_year: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          hostel_id: string
          id?: string
          is_active?: boolean
          permissions_grant?: Json
          profile_id: string
          role_title?: string
          term_year: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          hostel_id?: string
          id?: string
          is_active?: boolean
          permissions_grant?: Json
          profile_id?: string
          role_title?: string
          term_year?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hostel_bmcs_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostel_public_directory_v"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_bmcs_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_bmcs_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hostel_complaint_comments: {
        Row: {
          comment_text: string
          complaint_id: string
          created_at: string
          id: string
          profile_id: string
        }
        Insert: {
          comment_text: string
          complaint_id: string
          created_at?: string
          id?: string
          profile_id: string
        }
        Update: {
          comment_text?: string
          complaint_id?: string
          created_at?: string
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hostel_complaint_comments_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "hostel_complaints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_complaint_comments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hostel_complaints: {
        Row: {
          assigned_to_profile_id: string | null
          category: string
          created_at: string
          description: string
          evidence_media_id: string | null
          hostel_id: string
          id: string
          priority: string
          profile_id: string
          resolution_timeline: string | null
          resolved_at: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to_profile_id?: string | null
          category: string
          created_at?: string
          description: string
          evidence_media_id?: string | null
          hostel_id: string
          id?: string
          priority?: string
          profile_id: string
          resolution_timeline?: string | null
          resolved_at?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to_profile_id?: string | null
          category?: string
          created_at?: string
          description?: string
          evidence_media_id?: string | null
          hostel_id?: string
          id?: string
          priority?: string
          profile_id?: string
          resolution_timeline?: string | null
          resolved_at?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hostel_complaints_assigned_to_profile_id_fkey"
            columns: ["assigned_to_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_complaints_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostel_public_directory_v"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_complaints_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_complaints_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hostel_events: {
        Row: {
          category: string
          created_at: string
          description: string | null
          end_time: string
          hostel_id: string
          id: string
          is_published: boolean
          is_registration_required: boolean
          organizer_id: string | null
          registration_url: string | null
          slug: string
          start_time: string
          title: string
          updated_at: string
          venue: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          end_time: string
          hostel_id: string
          id?: string
          is_published?: boolean
          is_registration_required?: boolean
          organizer_id?: string | null
          registration_url?: string | null
          slug: string
          start_time: string
          title: string
          updated_at?: string
          venue: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          end_time?: string
          hostel_id?: string
          id?: string
          is_published?: boolean
          is_registration_required?: boolean
          organizer_id?: string | null
          registration_url?: string | null
          slug?: string
          start_time?: string
          title?: string
          updated_at?: string
          venue?: string
        }
        Relationships: [
          {
            foreignKeyName: "hostel_events_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostel_public_directory_v"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_events_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hostel_gallery_items: {
        Row: {
          caption: string | null
          category: string | null
          created_at: string
          display_order: number
          hostel_id: string
          id: string
          is_public: boolean
          media_id: string
          media_url: string
          title: string | null
          uploaded_by_id: string | null
        }
        Insert: {
          caption?: string | null
          category?: string | null
          created_at?: string
          display_order?: number
          hostel_id: string
          id?: string
          is_public?: boolean
          media_id: string
          media_url: string
          title?: string | null
          uploaded_by_id?: string | null
        }
        Update: {
          caption?: string | null
          category?: string | null
          created_at?: string
          display_order?: number
          hostel_id?: string
          id?: string
          is_public?: boolean
          media_id?: string
          media_url?: string
          title?: string | null
          uploaded_by_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hostel_gallery_items_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostel_public_directory_v"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_gallery_items_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_gallery_items_uploaded_by_id_fkey"
            columns: ["uploaded_by_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hostel_inventory: {
        Row: {
          condition: string | null
          created_at: string
          hostel_id: string
          id: string
          item_name: string
          location: string | null
          quantity: number
          updated_at: string
        }
        Insert: {
          condition?: string | null
          created_at?: string
          hostel_id: string
          id?: string
          item_name: string
          location?: string | null
          quantity?: number
          updated_at?: string
        }
        Update: {
          condition?: string | null
          created_at?: string
          hostel_id?: string
          id?: string
          item_name?: string
          location?: string | null
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hostel_inventory_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostel_public_directory_v"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_inventory_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
      hostel_memberships: {
        Row: {
          academic_session_id: string
          created_at: string
          hostel_id: string
          id: string
          is_current: boolean
          joined_on: string | null
          left_on: string | null
          profile_id: string
          room_number: string | null
          updated_at: string
        }
        Insert: {
          academic_session_id: string
          created_at?: string
          hostel_id: string
          id?: string
          is_current?: boolean
          joined_on?: string | null
          left_on?: string | null
          profile_id: string
          room_number?: string | null
          updated_at?: string
        }
        Update: {
          academic_session_id?: string
          created_at?: string
          hostel_id?: string
          id?: string
          is_current?: boolean
          joined_on?: string | null
          left_on?: string | null
          profile_id?: string
          room_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hostel_memberships_academic_session_id_fkey"
            columns: ["academic_session_id"]
            isOneToOne: false
            referencedRelation: "academic_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_memberships_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostel_public_directory_v"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_memberships_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_memberships_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hostel_mess_feedbacks: {
        Row: {
          comments: string | null
          created_at: string
          hostel_id: string
          id: string
          profile_id: string
          rating: number
        }
        Insert: {
          comments?: string | null
          created_at?: string
          hostel_id: string
          id?: string
          profile_id: string
          rating: number
        }
        Update: {
          comments?: string | null
          created_at?: string
          hostel_id?: string
          id?: string
          profile_id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "hostel_mess_feedbacks_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostel_public_directory_v"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_mess_feedbacks_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_mess_feedbacks_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hostel_mess_menus: {
        Row: {
          created_at: string
          day_of_week: number
          hostel_id: string
          id: string
          is_special: boolean
          items_description: string
          meal_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          hostel_id: string
          id?: string
          is_special?: boolean
          items_description: string
          meal_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          hostel_id?: string
          id?: string
          is_special?: boolean
          items_description?: string
          meal_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hostel_mess_menus_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostel_public_directory_v"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_mess_menus_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
      hostel_notices: {
        Row: {
          content: string
          created_at: string
          expires_at: string | null
          hostel_id: string
          id: string
          is_pinned: boolean
          is_published: boolean
          priority: string
          published_at: string | null
          published_by_id: string | null
          slug: string
          target_audience: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          expires_at?: string | null
          hostel_id: string
          id?: string
          is_pinned?: boolean
          is_published?: boolean
          priority?: string
          published_at?: string | null
          published_by_id?: string | null
          slug: string
          target_audience?: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          expires_at?: string | null
          hostel_id?: string
          id?: string
          is_pinned?: boolean
          is_published?: boolean
          priority?: string
          published_at?: string | null
          published_by_id?: string | null
          slug?: string
          target_audience?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hostel_notices_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostel_public_directory_v"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_notices_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_notices_published_by_id_fkey"
            columns: ["published_by_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hostel_residents: {
        Row: {
          batch_year: string
          created_at: string
          department_name: string | null
          hostel_id: string
          id: string
          is_alumni: boolean
          is_verified_by_bmc: boolean
          joined_date: string | null
          left_date: string | null
          profile_id: string
          room_number: string | null
          updated_at: string
        }
        Insert: {
          batch_year: string
          created_at?: string
          department_name?: string | null
          hostel_id: string
          id?: string
          is_alumni?: boolean
          is_verified_by_bmc?: boolean
          joined_date?: string | null
          left_date?: string | null
          profile_id: string
          room_number?: string | null
          updated_at?: string
        }
        Update: {
          batch_year?: string
          created_at?: string
          department_name?: string | null
          hostel_id?: string
          id?: string
          is_alumni?: boolean
          is_verified_by_bmc?: boolean
          joined_date?: string | null
          left_date?: string | null
          profile_id?: string
          room_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hostel_residents_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostel_public_directory_v"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_residents_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_residents_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hostel_room_allocations: {
        Row: {
          allocation_date: string
          bed_id: string | null
          created_at: string
          hostel_id: string
          id: string
          profile_id: string
          room_id: string
          status: string
          updated_at: string
          vacating_date: string | null
        }
        Insert: {
          allocation_date: string
          bed_id?: string | null
          created_at?: string
          hostel_id: string
          id?: string
          profile_id: string
          room_id: string
          status?: string
          updated_at?: string
          vacating_date?: string | null
        }
        Update: {
          allocation_date?: string
          bed_id?: string | null
          created_at?: string
          hostel_id?: string
          id?: string
          profile_id?: string
          room_id?: string
          status?: string
          updated_at?: string
          vacating_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hostel_room_allocations_bed_id_fkey"
            columns: ["bed_id"]
            isOneToOne: false
            referencedRelation: "hostel_beds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_room_allocations_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostel_public_directory_v"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_room_allocations_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_room_allocations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_room_allocations_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "hostel_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      hostel_room_change_requests: {
        Row: {
          created_at: string
          current_room_id: string | null
          hostel_id: string
          id: string
          profile_id: string
          reason: string
          requested_room_id: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_room_id?: string | null
          hostel_id: string
          id?: string
          profile_id: string
          reason: string
          requested_room_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_room_id?: string | null
          hostel_id?: string
          id?: string
          profile_id?: string
          reason?: string
          requested_room_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hostel_room_change_requests_current_room_id_fkey"
            columns: ["current_room_id"]
            isOneToOne: false
            referencedRelation: "hostel_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_room_change_requests_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostel_public_directory_v"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_room_change_requests_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_room_change_requests_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_room_change_requests_requested_room_id_fkey"
            columns: ["requested_room_id"]
            isOneToOne: false
            referencedRelation: "hostel_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_room_change_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hostel_rooms: {
        Row: {
          block_name: string | null
          capacity: number
          created_at: string
          current_occupancy: number
          floor_number: number
          hostel_id: string
          id: string
          is_active: boolean
          room_number: string
          updated_at: string
        }
        Insert: {
          block_name?: string | null
          capacity?: number
          created_at?: string
          current_occupancy?: number
          floor_number?: number
          hostel_id: string
          id?: string
          is_active?: boolean
          room_number: string
          updated_at?: string
        }
        Update: {
          block_name?: string | null
          capacity?: number
          created_at?: string
          current_occupancy?: number
          floor_number?: number
          hostel_id?: string
          id?: string
          is_active?: boolean
          room_number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hostel_rooms_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostel_public_directory_v"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_rooms_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
      hostel_visitors: {
        Row: {
          approved_by: string | null
          check_in_time: string | null
          check_out_time: string | null
          created_at: string
          expected_arrival: string | null
          host_profile_id: string
          hostel_id: string
          id: string
          purpose: string
          status: string
          updated_at: string
          visitor_contact: string | null
          visitor_name: string
        }
        Insert: {
          approved_by?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string
          expected_arrival?: string | null
          host_profile_id: string
          hostel_id: string
          id?: string
          purpose: string
          status?: string
          updated_at?: string
          visitor_contact?: string | null
          visitor_name: string
        }
        Update: {
          approved_by?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string
          expected_arrival?: string | null
          host_profile_id?: string
          hostel_id?: string
          id?: string
          purpose?: string
          status?: string
          updated_at?: string
          visitor_contact?: string | null
          visitor_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "hostel_visitors_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_visitors_host_profile_id_fkey"
            columns: ["host_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_visitors_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostel_public_directory_v"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_visitors_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
      hostel_wardens: {
        Row: {
          contact_number: string | null
          created_at: string
          designation: string
          email: string | null
          hostel_id: string
          id: string
          is_current: boolean
          name: string
          office_location: string | null
          profile_id: string | null
          tenure_end: string | null
          tenure_start: string | null
          updated_at: string
        }
        Insert: {
          contact_number?: string | null
          created_at?: string
          designation: string
          email?: string | null
          hostel_id: string
          id?: string
          is_current?: boolean
          name: string
          office_location?: string | null
          profile_id?: string | null
          tenure_end?: string | null
          tenure_start?: string | null
          updated_at?: string
        }
        Update: {
          contact_number?: string | null
          created_at?: string
          designation?: string
          email?: string | null
          hostel_id?: string
          id?: string
          is_current?: boolean
          name?: string
          office_location?: string | null
          profile_id?: string | null
          tenure_end?: string | null
          tenure_start?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hostel_wardens_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostel_public_directory_v"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_wardens_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_wardens_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hostels: {
        Row: {
          address: string | null
          assistant_warden_profile_id: string | null
          capacity: number | null
          contact_email: string | null
          contact_number: string | null
          cover_media_id: string | null
          created_at: string
          current_occupancy: number | null
          description: string | null
          display_order: number
          established_year: number | null
          facilities: Json | null
          google_maps_url: string | null
          history: string | null
          hostel_type: Database["public"]["Enums"]["hostel_type"]
          id: string
          is_active: boolean
          is_sponsored: boolean
          is_verified: boolean
          logo_media_id: string | null
          name: string
          owner_name: string | null
          rent_info: string | null
          room_types: Json | null
          rules: Json | null
          slug: string
          superintendent_profile_id: string | null
          theme_color: string | null
          timings: Json | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          assistant_warden_profile_id?: string | null
          capacity?: number | null
          contact_email?: string | null
          contact_number?: string | null
          cover_media_id?: string | null
          created_at?: string
          current_occupancy?: number | null
          description?: string | null
          display_order?: number
          established_year?: number | null
          facilities?: Json | null
          google_maps_url?: string | null
          history?: string | null
          hostel_type: Database["public"]["Enums"]["hostel_type"]
          id?: string
          is_active?: boolean
          is_sponsored?: boolean
          is_verified?: boolean
          logo_media_id?: string | null
          name: string
          owner_name?: string | null
          rent_info?: string | null
          room_types?: Json | null
          rules?: Json | null
          slug: string
          superintendent_profile_id?: string | null
          theme_color?: string | null
          timings?: Json | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          assistant_warden_profile_id?: string | null
          capacity?: number | null
          contact_email?: string | null
          contact_number?: string | null
          cover_media_id?: string | null
          created_at?: string
          current_occupancy?: number | null
          description?: string | null
          display_order?: number
          established_year?: number | null
          facilities?: Json | null
          google_maps_url?: string | null
          history?: string | null
          hostel_type?: Database["public"]["Enums"]["hostel_type"]
          id?: string
          is_active?: boolean
          is_sponsored?: boolean
          is_verified?: boolean
          logo_media_id?: string | null
          name?: string
          owner_name?: string | null
          rent_info?: string | null
          room_types?: Json | null
          rules?: Json | null
          slug?: string
          superintendent_profile_id?: string | null
          theme_color?: string | null
          timings?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hostels_assistant_warden_profile_id_fkey"
            columns: ["assistant_warden_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostels_superintendent_profile_id_fkey"
            columns: ["superintendent_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leadership_assignments: {
        Row: {
          academic_session_id: string
          assigned_by: string | null
          created_at: string
          department_id: string | null
          end_date: string | null
          hostel_id: string | null
          id: string
          leadership_role_id: string
          organization_id: string | null
          profile_id: string
          remarks: string | null
          start_date: string
          updated_at: string
        }
        Insert: {
          academic_session_id: string
          assigned_by?: string | null
          created_at?: string
          department_id?: string | null
          end_date?: string | null
          hostel_id?: string | null
          id?: string
          leadership_role_id: string
          organization_id?: string | null
          profile_id: string
          remarks?: string | null
          start_date: string
          updated_at?: string
        }
        Update: {
          academic_session_id?: string
          assigned_by?: string | null
          created_at?: string
          department_id?: string | null
          end_date?: string | null
          hostel_id?: string | null
          id?: string
          leadership_role_id?: string
          organization_id?: string | null
          profile_id?: string
          remarks?: string | null
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leadership_assignments_academic_session_id_fkey"
            columns: ["academic_session_id"]
            isOneToOne: false
            referencedRelation: "academic_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leadership_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leadership_assignments_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leadership_assignments_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "mv_department_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "leadership_assignments_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_department_public_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leadership_assignments_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_department_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "leadership_assignments_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostel_public_directory_v"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leadership_assignments_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leadership_assignments_leadership_role_id_fkey"
            columns: ["leadership_role_id"]
            isOneToOne: false
            referencedRelation: "leadership_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leadership_assignments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leadership_assignments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leadership_roles: {
        Row: {
          description: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      legal_document_versions: {
        Row: {
          content: string
          content_hash: string | null
          created_at: string
          document_id: string
          effective_at: string
          id: string
          published_at: string | null
          version_number: number
        }
        Insert: {
          content: string
          content_hash?: string | null
          created_at?: string
          document_id: string
          effective_at?: string
          id?: string
          published_at?: string | null
          version_number: number
        }
        Update: {
          content?: string
          content_hash?: string | null
          created_at?: string
          document_id?: string
          effective_at?: string
          id?: string
          published_at?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "legal_document_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "legal_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_documents: {
        Row: {
          created_at: string
          document_type: string
          id: string
          is_active: boolean
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          document_type: string
          id?: string
          is_active?: boolean
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          document_type?: string
          id?: string
          is_active?: boolean
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      media_files: {
        Row: {
          alt_text: string | null
          caption: string | null
          checksum_sha256: string | null
          created_at: string
          deleted_at: string | null
          duration_seconds: number | null
          file_extension: string | null
          file_size_bytes: number
          height: number | null
          id: string
          is_deleted: boolean
          is_processed: boolean
          is_public: boolean
          media_type: Database["public"]["Enums"]["media_type"]
          mime_type: string
          original_filename: string
          owner_profile_id: string | null
          public_id: string
          storage_bucket: string
          storage_path: string
          updated_at: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          checksum_sha256?: string | null
          created_at?: string
          deleted_at?: string | null
          duration_seconds?: number | null
          file_extension?: string | null
          file_size_bytes: number
          height?: number | null
          id?: string
          is_deleted?: boolean
          is_processed?: boolean
          is_public?: boolean
          media_type: Database["public"]["Enums"]["media_type"]
          mime_type: string
          original_filename: string
          owner_profile_id?: string | null
          public_id?: string
          storage_bucket: string
          storage_path: string
          updated_at?: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          checksum_sha256?: string | null
          created_at?: string
          deleted_at?: string | null
          duration_seconds?: number | null
          file_extension?: string | null
          file_size_bytes?: number
          height?: number | null
          id?: string
          is_deleted?: boolean
          is_processed?: boolean
          is_public?: boolean
          media_type?: Database["public"]["Enums"]["media_type"]
          mime_type?: string
          original_filename?: string
          owner_profile_id?: string | null
          public_id?: string
          storage_bucket?: string
          storage_path?: string
          updated_at?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_files_owner_profile_id_fkey"
            columns: ["owner_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      media_variants: {
        Row: {
          created_at: string
          file_size_bytes: number | null
          height: number | null
          id: string
          media_file_id: string
          storage_path: string
          variant_name: string
          width: number | null
        }
        Insert: {
          created_at?: string
          file_size_bytes?: number | null
          height?: number | null
          id?: string
          media_file_id: string
          storage_path: string
          variant_name: string
          width?: number | null
        }
        Update: {
          created_at?: string
          file_size_bytes?: number | null
          height?: number | null
          id?: string
          media_file_id?: string
          storage_path?: string
          variant_name?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_variants_media_file_id_fkey"
            columns: ["media_file_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_profiles: {
        Row: {
          areas_of_expertise: string[] | null
          availability_status: string | null
          created_at: string
          current_mentees: number | null
          is_mentee: boolean
          is_mentor: boolean
          max_mentees: number | null
          meeting_preference: string | null
          profile_id: string
          updated_at: string
        }
        Insert: {
          areas_of_expertise?: string[] | null
          availability_status?: string | null
          created_at?: string
          current_mentees?: number | null
          is_mentee?: boolean
          is_mentor?: boolean
          max_mentees?: number | null
          meeting_preference?: string | null
          profile_id: string
          updated_at?: string
        }
        Update: {
          areas_of_expertise?: string[] | null
          availability_status?: string | null
          created_at?: string
          current_mentees?: number | null
          is_mentee?: boolean
          is_mentor?: boolean
          max_mentees?: number | null
          meeting_preference?: string | null
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_requests: {
        Row: {
          created_at: string
          goals: string | null
          id: string
          mentee_id: string
          mentor_id: string
          request_message: string | null
          status: Database["public"]["Enums"]["mentorship_request_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          goals?: string | null
          id?: string
          mentee_id: string
          mentor_id: string
          request_message?: string | null
          status?: Database["public"]["Enums"]["mentorship_request_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          goals?: string | null
          id?: string
          mentee_id?: string
          mentor_id?: string
          request_message?: string | null
          status?: Database["public"]["Enums"]["mentorship_request_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_requests_mentee_id_fkey"
            columns: ["mentee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_requests_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_sessions: {
        Row: {
          created_at: string
          duration_minutes: number
          feedback_mentee: string | null
          feedback_mentor: string | null
          id: string
          meeting_link: string | null
          rating_mentee: number | null
          rating_mentor: number | null
          request_id: string
          session_date: string
          status: Database["public"]["Enums"]["mentorship_session_status"]
        }
        Insert: {
          created_at?: string
          duration_minutes?: number
          feedback_mentee?: string | null
          feedback_mentor?: string | null
          id?: string
          meeting_link?: string | null
          rating_mentee?: number | null
          rating_mentor?: number | null
          request_id: string
          session_date: string
          status?: Database["public"]["Enums"]["mentorship_session_status"]
        }
        Update: {
          created_at?: string
          duration_minutes?: number
          feedback_mentee?: string | null
          feedback_mentor?: string | null
          id?: string
          meeting_link?: string | null
          rating_mentee?: number | null
          rating_mentor?: number | null
          request_id?: string
          session_date?: string
          status?: Database["public"]["Enums"]["mentorship_session_status"]
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_sessions_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "mentorship_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      mock_interviews: {
        Row: {
          created_at: string
          feedback: string | null
          focus_area: string | null
          id: string
          interviewer_profile_id: string
          scheduled_at: string
          score: number | null
          status: string | null
          student_profile_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          feedback?: string | null
          focus_area?: string | null
          id?: string
          interviewer_profile_id: string
          scheduled_at: string
          score?: number | null
          status?: string | null
          student_profile_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          feedback?: string | null
          focus_area?: string | null
          id?: string
          interviewer_profile_id?: string
          scheduled_at?: string
          score?: number | null
          status?: string | null
          student_profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mock_interviews_interviewer_profile_id_fkey"
            columns: ["interviewer_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mock_interviews_student_profile_id_fkey"
            columns: ["student_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_queue: {
        Row: {
          approval_status: Database["public"]["Enums"]["approval_status"]
          created_at: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          id: string
          remarks: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          submitted_by: string | null
        }
        Insert: {
          approval_status?: Database["public"]["Enums"]["approval_status"]
          created_at?: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          id?: string
          remarks?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          submitted_by?: string | null
        }
        Update: {
          approval_status?: Database["public"]["Enums"]["approval_status"]
          created_at?: string
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["entity_type"]
          id?: string
          remarks?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          submitted_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "moderation_queue_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moderation_queue_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_active: boolean | null
          profile_id: string | null
          publication_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          profile_id?: string | null
          publication_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          profile_id?: string | null
          publication_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_subscribers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "newsletter_subscribers_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publications"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          achievement_notifications: boolean
          announcement_notifications: boolean
          competition_notifications: boolean
          donation_notifications: boolean
          email_enabled: boolean
          in_app_enabled: boolean
          profile_id: string
          push_enabled: boolean
          updated_at: string
        }
        Insert: {
          achievement_notifications?: boolean
          announcement_notifications?: boolean
          competition_notifications?: boolean
          donation_notifications?: boolean
          email_enabled?: boolean
          in_app_enabled?: boolean
          profile_id: string
          push_enabled?: boolean
          updated_at?: string
        }
        Update: {
          achievement_notifications?: boolean
          announcement_notifications?: boolean
          competition_notifications?: boolean
          donation_notifications?: boolean
          email_enabled?: boolean
          in_app_enabled?: boolean
          profile_id?: string
          push_enabled?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          entity_id: string | null
          entity_type: Database["public"]["Enums"]["entity_type"] | null
          id: string
          is_read: boolean
          message: string
          notification_type: Database["public"]["Enums"]["notification_type"]
          profile_id: string
          public_id: string
          read_at: string | null
          title: string
        }
        Insert: {
          created_at?: string
          entity_id?: string | null
          entity_type?: Database["public"]["Enums"]["entity_type"] | null
          id?: string
          is_read?: boolean
          message: string
          notification_type: Database["public"]["Enums"]["notification_type"]
          profile_id: string
          public_id?: string
          read_at?: string | null
          title: string
        }
        Update: {
          created_at?: string
          entity_id?: string | null
          entity_type?: Database["public"]["Enums"]["entity_type"] | null
          id?: string
          is_read?: boolean
          message?: string
          notification_type?: Database["public"]["Enums"]["notification_type"]
          profile_id?: string
          public_id?: string
          read_at?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_achievements: {
        Row: {
          category: string
          created_at: string
          date: string
          description: string
          id: string
          image_url: string | null
          org_id: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          date: string
          description: string
          id?: string
          image_url?: string | null
          org_id: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          image_url?: string | null
          org_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_achievements_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_advisors: {
        Row: {
          created_at: string
          department: string | null
          designation: string
          end_date: string | null
          id: string
          is_current: boolean
          name: string
          org_id: string
          profile_id: string | null
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          designation: string
          end_date?: string | null
          id?: string
          is_current?: boolean
          name: string
          org_id: string
          profile_id?: string | null
          start_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          designation?: string
          end_date?: string | null
          id?: string
          is_current?: boolean
          name?: string
          org_id?: string
          profile_id?: string | null
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_advisors_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_advisors_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_attendance_records: {
        Row: {
          created_at: string
          id: string
          profile_id: string
          session_id: string
          status: string
          updated_at: string
          volunteer_hours: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id: string
          session_id: string
          status?: string
          updated_at?: string
          volunteer_hours?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string
          session_id?: string
          status?: string
          updated_at?: string
          volunteer_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_attendance_records_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_attendance_records_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "organization_attendance_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_attendance_sessions: {
        Row: {
          created_at: string
          event_id: string | null
          hours_awarded: number
          id: string
          org_id: string
          project_id: string | null
          session_date: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          hours_awarded?: number
          id?: string
          org_id: string
          project_id?: string | null
          session_date: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_id?: string | null
          hours_awarded?: number
          id?: string
          org_id?: string
          project_id?: string | null
          session_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_attendance_sessions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "organization_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_attendance_sessions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_attendance_sessions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "organization_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_events: {
        Row: {
          category: string
          created_at: string
          description: string | null
          end_time: string
          id: string
          is_published: boolean
          is_registration_required: boolean
          org_id: string
          registration_url: string | null
          slug: string
          start_time: string
          title: string
          updated_at: string
          venue: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          end_time: string
          id?: string
          is_published?: boolean
          is_registration_required?: boolean
          org_id: string
          registration_url?: string | null
          slug: string
          start_time: string
          title: string
          updated_at?: string
          venue: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          end_time?: string
          id?: string
          is_published?: boolean
          is_registration_required?: boolean
          org_id?: string
          registration_url?: string | null
          slug?: string
          start_time?: string
          title?: string
          updated_at?: string
          venue?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_events_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_gallery: {
        Row: {
          created_at: string
          description: string | null
          event_id: string | null
          id: string
          is_featured: boolean
          media_type: string
          media_url: string
          org_id: string
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_id?: string | null
          id?: string
          is_featured?: boolean
          media_type?: string
          media_url: string
          org_id: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_id?: string | null
          id?: string
          is_featured?: boolean
          media_type?: string
          media_url?: string
          org_id?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_gallery_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "organization_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_gallery_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          can_manage_org: boolean
          created_at: string
          designation: string | null
          end_date: string | null
          id: string
          org_id: string
          profile_id: string
          role: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          can_manage_org?: boolean
          created_at?: string
          designation?: string | null
          end_date?: string | null
          id?: string
          org_id: string
          profile_id: string
          role?: string
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          can_manage_org?: boolean
          created_at?: string
          designation?: string | null
          end_date?: string | null
          id?: string
          org_id?: string
          profile_id?: string
          role?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_notices: {
        Row: {
          attachment_url: string | null
          audience: string
          content: string
          created_at: string
          expires_at: string | null
          id: string
          org_id: string
          priority: string
          title: string
          updated_at: string
        }
        Insert: {
          attachment_url?: string | null
          audience?: string
          content: string
          created_at?: string
          expires_at?: string | null
          id?: string
          org_id: string
          priority?: string
          title: string
          updated_at?: string
        }
        Update: {
          attachment_url?: string | null
          audience?: string
          content?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          org_id?: string
          priority?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_notices_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_projects: {
        Row: {
          category: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          impact_metrics: Json | null
          is_published: boolean
          org_id: string
          slug: string
          start_date: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          impact_metrics?: Json | null
          is_published?: boolean
          org_id: string
          slug: string
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          impact_metrics?: Json | null
          is_published?: boolean
          org_id?: string
          slug?: string
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_projects_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_publications: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description: string | null
          file_url: string
          id: string
          org_id: string
          publication_date: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          file_url: string
          id?: string
          org_id: string
          publication_date: string
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          file_url?: string
          id?: string
          org_id?: string
          publication_date?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_publications_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_recruitment_applications: {
        Row: {
          application_data: Json | null
          campaign_id: string
          created_at: string
          feedback: string | null
          id: string
          interview_time: string | null
          profile_id: string
          status: string
          updated_at: string
        }
        Insert: {
          application_data?: Json | null
          campaign_id: string
          created_at?: string
          feedback?: string | null
          id?: string
          interview_time?: string | null
          profile_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          application_data?: Json | null
          campaign_id?: string
          created_at?: string
          feedback?: string | null
          id?: string
          interview_time?: string | null
          profile_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_recruitment_applications_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "organization_recruitment_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_recruitment_applications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_recruitment_campaigns: {
        Row: {
          close_date: string
          created_at: string
          description: string | null
          eligibility_criteria: string | null
          id: string
          open_date: string
          org_id: string
          selection_process: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          close_date: string
          created_at?: string
          description?: string | null
          eligibility_criteria?: string | null
          id?: string
          open_date: string
          org_id: string
          selection_process?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          close_date?: string
          created_at?: string
          description?: string | null
          eligibility_criteria?: string | null
          id?: string
          open_date?: string
          org_id?: string
          selection_process?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_recruitment_campaigns_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          cover_media_id: string | null
          created_at: string
          description: string | null
          established_year: number | null
          id: string
          is_active: boolean
          is_verified: boolean
          logo_media_id: string | null
          mission: string | null
          name: string
          short_name: string | null
          slug: string
          social_links: Json | null
          updated_at: string
          vision: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          cover_media_id?: string | null
          created_at?: string
          description?: string | null
          established_year?: number | null
          id?: string
          is_active?: boolean
          is_verified?: boolean
          logo_media_id?: string | null
          mission?: string | null
          name: string
          short_name?: string | null
          slug: string
          social_links?: Json | null
          updated_at?: string
          vision?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          cover_media_id?: string | null
          created_at?: string
          description?: string | null
          established_year?: number | null
          id?: string
          is_active?: boolean
          is_verified?: boolean
          logo_media_id?: string | null
          mission?: string | null
          name?: string
          short_name?: string | null
          slug?: string
          social_links?: Json | null
          updated_at?: string
          vision?: string | null
        }
        Relationships: []
      }
      payment_refunds: {
        Row: {
          approved_by: string | null
          created_at: string
          id: string
          payment_id: string
          payment_status: Database["public"]["Enums"]["payment_status"]
          reason: string | null
          refund_amount: number
          refund_reference: string | null
          refunded_at: string | null
        }
        Insert: {
          approved_by?: string | null
          created_at?: string
          id?: string
          payment_id: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          reason?: string | null
          refund_amount: number
          refund_reference?: string | null
          refunded_at?: string | null
        }
        Update: {
          approved_by?: string | null
          created_at?: string
          id?: string
          payment_id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          reason?: string | null
          refund_amount?: number
          refund_reference?: string | null
          refunded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_refunds_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_refunds_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          gateway_response: Json | null
          id: string
          payment_id: string
          payment_status: Database["public"]["Enums"]["payment_status"]
          processed_at: string
          transaction_reference: string
        }
        Insert: {
          amount: number
          gateway_response?: Json | null
          id?: string
          payment_id: string
          payment_status: Database["public"]["Enums"]["payment_status"]
          processed_at?: string
          transaction_reference: string
        }
        Update: {
          amount?: number
          gateway_response?: Json | null
          id?: string
          payment_id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          processed_at?: string
          transaction_reference?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency_code: string
          description: string | null
          entity_id: string | null
          entity_type: Database["public"]["Enums"]["entity_type"]
          id: string
          paid_at: string | null
          payer_email: string | null
          payer_name: string | null
          payer_phone: string | null
          payment_provider: Database["public"]["Enums"]["payment_provider"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          profile_id: string | null
          provider_order_id: string | null
          provider_payment_id: string | null
          public_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency_code?: string
          description?: string | null
          entity_id?: string | null
          entity_type: Database["public"]["Enums"]["entity_type"]
          id?: string
          paid_at?: string | null
          payer_email?: string | null
          payer_name?: string | null
          payer_phone?: string | null
          payment_provider: Database["public"]["Enums"]["payment_provider"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          profile_id?: string | null
          provider_order_id?: string | null
          provider_payment_id?: string | null
          public_id?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency_code?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: Database["public"]["Enums"]["entity_type"]
          id?: string
          paid_at?: string | null
          payer_email?: string | null
          payer_name?: string | null
          payer_phone?: string | null
          payment_provider?: Database["public"]["Enums"]["payment_provider"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          profile_id?: string | null
          provider_order_id?: string | null
          provider_payment_id?: string | null
          public_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          action: string
          code: string
          created_at: string
          description: string | null
          id: string
          module: string
        }
        Insert: {
          action: string
          code: string
          created_at?: string
          description?: string | null
          id?: string
          module: string
        }
        Update: {
          action?: string
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          module?: string
        }
        Relationships: []
      }
      placement_drive_departments: {
        Row: {
          department_id: string
          drive_id: string
        }
        Insert: {
          department_id: string
          drive_id: string
        }
        Update: {
          department_id?: string
          drive_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "placement_drive_departments_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "placement_drive_departments_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "mv_department_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "placement_drive_departments_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_department_public_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "placement_drive_departments_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_department_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "placement_drive_departments_drive_id_fkey"
            columns: ["drive_id"]
            isOneToOne: false
            referencedRelation: "placement_drives"
            referencedColumns: ["id"]
          },
        ]
      }
      placement_drive_skills: {
        Row: {
          drive_id: string
          is_mandatory: boolean
          skill_name: string
        }
        Insert: {
          drive_id: string
          is_mandatory?: boolean
          skill_name: string
        }
        Update: {
          drive_id?: string
          is_mandatory?: boolean
          skill_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "placement_drive_skills_drive_id_fkey"
            columns: ["drive_id"]
            isOneToOne: false
            referencedRelation: "placement_drives"
            referencedColumns: ["id"]
          },
        ]
      }
      placement_drives: {
        Row: {
          company_id: string
          created_at: string
          created_by: string | null
          description: string
          id: string
          job_recommendation_score: Json | null
          job_type: Database["public"]["Enums"]["placement_job_type"]
          max_backlogs: number | null
          min_cgpa: number | null
          passing_year: number[] | null
          registration_end: string | null
          registration_start: string | null
          salary_currency: string | null
          salary_package: number | null
          slug: string
          status: Database["public"]["Enums"]["placement_drive_status"]
          title: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          job_recommendation_score?: Json | null
          job_type: Database["public"]["Enums"]["placement_job_type"]
          max_backlogs?: number | null
          min_cgpa?: number | null
          passing_year?: number[] | null
          registration_end?: string | null
          registration_start?: string | null
          salary_currency?: string | null
          salary_package?: number | null
          slug: string
          status?: Database["public"]["Enums"]["placement_drive_status"]
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          job_recommendation_score?: Json | null
          job_type?: Database["public"]["Enums"]["placement_job_type"]
          max_backlogs?: number | null
          min_cgpa?: number | null
          passing_year?: number[] | null
          registration_end?: string | null
          registration_start?: string | null
          salary_currency?: string | null
          salary_package?: number | null
          slug?: string
          status?: Database["public"]["Enums"]["placement_drive_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "placement_drives_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "placement_drives_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "placement_statistics"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "placement_drives_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      placement_interviews: {
        Row: {
          created_at: string
          feedback: string | null
          id: string
          interview_recommendation: Json | null
          interviewer_id: string | null
          registration_id: string
          round_id: string
          scheduled_time: string | null
          score: number | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          feedback?: string | null
          id?: string
          interview_recommendation?: Json | null
          interviewer_id?: string | null
          registration_id: string
          round_id: string
          scheduled_time?: string | null
          score?: number | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          feedback?: string | null
          id?: string
          interview_recommendation?: Json | null
          interviewer_id?: string | null
          registration_id?: string
          round_id?: string
          scheduled_time?: string | null
          score?: number | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "placement_interviews_interviewer_id_fkey"
            columns: ["interviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "placement_interviews_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "placement_registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "placement_interviews_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "placement_rounds"
            referencedColumns: ["id"]
          },
        ]
      }
      placement_offers: {
        Row: {
          base_salary: number | null
          bond_details: string | null
          created_at: string
          ctc: number
          deadline: string | null
          id: string
          joining_date: string | null
          location: string | null
          offer_letter_media_id: string | null
          registration_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          base_salary?: number | null
          bond_details?: string | null
          created_at?: string
          ctc: number
          deadline?: string | null
          id?: string
          joining_date?: string | null
          location?: string | null
          offer_letter_media_id?: string | null
          registration_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          base_salary?: number | null
          bond_details?: string | null
          created_at?: string
          ctc?: number
          deadline?: string | null
          id?: string
          joining_date?: string | null
          location?: string | null
          offer_letter_media_id?: string | null
          registration_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "placement_offers_offer_letter_media_id_fkey"
            columns: ["offer_letter_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "placement_offers_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: true
            referencedRelation: "placement_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      placement_registrations: {
        Row: {
          applied_at: string
          drive_id: string
          id: string
          match_score: number | null
          profile_id: string
          resume_id: string | null
          status: Database["public"]["Enums"]["placement_registration_status"]
          updated_at: string
        }
        Insert: {
          applied_at?: string
          drive_id: string
          id?: string
          match_score?: number | null
          profile_id: string
          resume_id?: string | null
          status?: Database["public"]["Enums"]["placement_registration_status"]
          updated_at?: string
        }
        Update: {
          applied_at?: string
          drive_id?: string
          id?: string
          match_score?: number | null
          profile_id?: string
          resume_id?: string | null
          status?: Database["public"]["Enums"]["placement_registration_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "placement_registrations_drive_id_fkey"
            columns: ["drive_id"]
            isOneToOne: false
            referencedRelation: "placement_drives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "placement_registrations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "placement_registrations_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "student_resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      placement_rounds: {
        Row: {
          created_at: string
          description: string | null
          drive_id: string
          id: string
          location: string | null
          order_index: number
          round_type: Database["public"]["Enums"]["placement_round_type"]
          scheduled_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          drive_id: string
          id?: string
          location?: string | null
          order_index?: number
          round_type: Database["public"]["Enums"]["placement_round_type"]
          scheduled_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          drive_id?: string
          id?: string
          location?: string | null
          order_index?: number
          round_type?: Database["public"]["Enums"]["placement_round_type"]
          scheduled_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "placement_rounds_drive_id_fkey"
            columns: ["drive_id"]
            isOneToOne: false
            referencedRelation: "placement_drives"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_claim_requests: {
        Row: {
          claimant_auth_user_id: string
          created_at: string
          id: string
          profile_id: string
          remarks: string | null
          reviewed_at: string | null
          reviewer_profile_id: string | null
          supporting_document_url: string | null
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          claimant_auth_user_id: string
          created_at?: string
          id?: string
          profile_id: string
          remarks?: string | null
          reviewed_at?: string | null
          reviewer_profile_id?: string | null
          supporting_document_url?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          claimant_auth_user_id?: string
          created_at?: string
          id?: string
          profile_id?: string
          remarks?: string | null
          reviewed_at?: string | null
          reviewer_profile_id?: string | null
          supporting_document_url?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "profile_claim_requests_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_claim_requests_reviewer_profile_id_fkey"
            columns: ["reviewer_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_correction_requests: {
        Row: {
          category: string
          id: string
          message: string
          profile_id: string
          requested_at: string
          requested_by: string
          resolved_at: string | null
          resolved_by: string | null
          status: string
        }
        Insert: {
          category: string
          id?: string
          message: string
          profile_id: string
          requested_at?: string
          requested_by: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Update: {
          category?: string
          id?: string
          message?: string
          profile_id?: string
          requested_at?: string
          requested_by?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_correction_requests_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_correction_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_correction_requests_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_follows: {
        Row: {
          created_at: string
          follower_profile_id: string
          following_profile_id: string
        }
        Insert: {
          created_at?: string
          follower_profile_id: string
          following_profile_id: string
        }
        Update: {
          created_at?: string
          follower_profile_id?: string
          following_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_follows_follower_profile_id_fkey"
            columns: ["follower_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_follows_following_profile_id_fkey"
            columns: ["following_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_privacy: {
        Row: {
          achievements_visibility: Database["public"]["Enums"]["visibility_type"]
          created_at: string
          dob_visibility: Database["public"]["Enums"]["visibility_type"]
          email_visibility: Database["public"]["Enums"]["visibility_type"]
          gallery_visibility: Database["public"]["Enums"]["visibility_type"]
          phone_visibility: Database["public"]["Enums"]["visibility_type"]
          profile_id: string
          profile_visibility: Database["public"]["Enums"]["visibility_type"]
          updated_at: string
        }
        Insert: {
          achievements_visibility?: Database["public"]["Enums"]["visibility_type"]
          created_at?: string
          dob_visibility?: Database["public"]["Enums"]["visibility_type"]
          email_visibility?: Database["public"]["Enums"]["visibility_type"]
          gallery_visibility?: Database["public"]["Enums"]["visibility_type"]
          phone_visibility?: Database["public"]["Enums"]["visibility_type"]
          profile_id: string
          profile_visibility?: Database["public"]["Enums"]["visibility_type"]
          updated_at?: string
        }
        Update: {
          achievements_visibility?: Database["public"]["Enums"]["visibility_type"]
          created_at?: string
          dob_visibility?: Database["public"]["Enums"]["visibility_type"]
          email_visibility?: Database["public"]["Enums"]["visibility_type"]
          gallery_visibility?: Database["public"]["Enums"]["visibility_type"]
          phone_visibility?: Database["public"]["Enums"]["visibility_type"]
          profile_id?: string
          profile_visibility?: Database["public"]["Enums"]["visibility_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_privacy_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_roles: {
        Row: {
          assigned_by: string | null
          created_at: string
          department_id: string | null
          ends_at: string | null
          hostel_id: string | null
          id: string
          is_active: boolean
          organization_id: string | null
          profile_id: string
          remarks: string | null
          role_id: string
          starts_at: string
          updated_at: string
        }
        Insert: {
          assigned_by?: string | null
          created_at?: string
          department_id?: string | null
          ends_at?: string | null
          hostel_id?: string | null
          id?: string
          is_active?: boolean
          organization_id?: string | null
          profile_id: string
          remarks?: string | null
          role_id: string
          starts_at?: string
          updated_at?: string
        }
        Update: {
          assigned_by?: string | null
          created_at?: string
          department_id?: string | null
          ends_at?: string | null
          hostel_id?: string | null
          id?: string
          is_active?: boolean
          organization_id?: string | null
          profile_id?: string
          remarks?: string | null
          role_id?: string
          starts_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_roles_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_roles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_roles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "mv_department_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "profile_roles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_department_public_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_roles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "v_department_statistics"
            referencedColumns: ["department_id"]
          },
          {
            foreignKeyName: "profile_roles_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostel_public_directory_v"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_roles_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_roles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_settings: {
        Row: {
          competition_notifications: boolean
          created_at: string
          dark_mode: boolean
          donation_notifications: boolean
          email_notifications: boolean
          language_code: string
          newsletter_enabled: boolean
          profile_id: string
          push_notifications: boolean
          updated_at: string
        }
        Insert: {
          competition_notifications?: boolean
          created_at?: string
          dark_mode?: boolean
          donation_notifications?: boolean
          email_notifications?: boolean
          language_code?: string
          newsletter_enabled?: boolean
          profile_id: string
          push_notifications?: boolean
          updated_at?: string
        }
        Update: {
          competition_notifications?: boolean
          created_at?: string
          dark_mode?: boolean
          donation_notifications?: boolean
          email_notifications?: boolean
          language_code?: string
          newsletter_enabled?: boolean
          profile_id?: string
          push_notifications?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_settings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          auth_user_id: string | null
          batch_year: string | null
          bio: string | null
          career_objective: string | null
          cover_media_id: string | null
          created_at: string
          created_by: string | null
          date_of_birth: string | null
          deleted_at: string | null
          deleted_by: string | null
          deletion_reason: string | null
          department_name: string | null
          email: string | null
          full_name: string
          gender: Database["public"]["Enums"]["gender_type"] | null
          github_url: string | null
          id: string
          is_profile_claimed: boolean
          is_verified: boolean
          level: string | null
          linkedin_url: string | null
          phone: string | null
          portfolio_url: string | null
          previous_profile_status:
            | Database["public"]["Enums"]["profile_status"]
            | null
          profile_media_id: string | null
          profile_status: Database["public"]["Enums"]["profile_status"]
          profile_type: Database["public"]["Enums"]["profile_type"]
          public_id: string
          restored_at: string | null
          restored_by: string | null
          slug: string
          stream: string | null
          suspended_at: string | null
          suspended_by: string | null
          suspension_expires_at: string | null
          suspension_reason: string | null
          university_name: string | null
          updated_at: string
          updated_by: string | null
          username: string | null
        }
        Insert: {
          auth_user_id?: string | null
          batch_year?: string | null
          bio?: string | null
          career_objective?: string | null
          cover_media_id?: string | null
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          deletion_reason?: string | null
          department_name?: string | null
          email?: string | null
          full_name: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          github_url?: string | null
          id?: string
          is_profile_claimed?: boolean
          is_verified?: boolean
          level?: string | null
          linkedin_url?: string | null
          phone?: string | null
          portfolio_url?: string | null
          previous_profile_status?:
            | Database["public"]["Enums"]["profile_status"]
            | null
          profile_media_id?: string | null
          profile_status?: Database["public"]["Enums"]["profile_status"]
          profile_type?: Database["public"]["Enums"]["profile_type"]
          public_id?: string
          restored_at?: string | null
          restored_by?: string | null
          slug: string
          stream?: string | null
          suspended_at?: string | null
          suspended_by?: string | null
          suspension_expires_at?: string | null
          suspension_reason?: string | null
          university_name?: string | null
          updated_at?: string
          updated_by?: string | null
          username?: string | null
        }
        Update: {
          auth_user_id?: string | null
          batch_year?: string | null
          bio?: string | null
          career_objective?: string | null
          cover_media_id?: string | null
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          deletion_reason?: string | null
          department_name?: string | null
          email?: string | null
          full_name?: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          github_url?: string | null
          id?: string
          is_profile_claimed?: boolean
          is_verified?: boolean
          level?: string | null
          linkedin_url?: string | null
          phone?: string | null
          portfolio_url?: string | null
          previous_profile_status?:
            | Database["public"]["Enums"]["profile_status"]
            | null
          profile_media_id?: string | null
          profile_status?: Database["public"]["Enums"]["profile_status"]
          profile_type?: Database["public"]["Enums"]["profile_type"]
          public_id?: string
          restored_at?: string | null
          restored_by?: string | null
          slug?: string
          stream?: string | null
          suspended_at?: string | null
          suspended_by?: string | null
          suspension_expires_at?: string | null
          suspension_reason?: string | null
          university_name?: string | null
          updated_at?: string
          updated_by?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_restored_by_fkey"
            columns: ["restored_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_suspended_by_fkey"
            columns: ["suspended_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      publication_articles: {
        Row: {
          content_id: string
          display_order: number | null
          edition_id: string
          id: string
          page_number: string | null
        }
        Insert: {
          content_id: string
          display_order?: number | null
          edition_id: string
          id?: string
          page_number?: string | null
        }
        Update: {
          content_id?: string
          display_order?: number | null
          edition_id?: string
          id?: string
          page_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "publication_articles_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publication_articles_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "v_department_news"
            referencedColumns: ["content_id"]
          },
          {
            foreignKeyName: "publication_articles_edition_id_fkey"
            columns: ["edition_id"]
            isOneToOne: false
            referencedRelation: "publication_editions"
            referencedColumns: ["id"]
          },
        ]
      }
      publication_editions: {
        Row: {
          ai_metadata: Json | null
          cover_media_id: string | null
          created_at: string
          document_media_id: string | null
          download_count: number | null
          id: string
          is_published: boolean | null
          issue_number: string | null
          publication_id: string
          publish_date: string | null
          slug: string
          title: string
          updated_at: string
          volume_number: string | null
        }
        Insert: {
          ai_metadata?: Json | null
          cover_media_id?: string | null
          created_at?: string
          document_media_id?: string | null
          download_count?: number | null
          id?: string
          is_published?: boolean | null
          issue_number?: string | null
          publication_id: string
          publish_date?: string | null
          slug: string
          title: string
          updated_at?: string
          volume_number?: string | null
        }
        Update: {
          ai_metadata?: Json | null
          cover_media_id?: string | null
          created_at?: string
          document_media_id?: string | null
          download_count?: number | null
          id?: string
          is_published?: boolean | null
          issue_number?: string | null
          publication_id?: string
          publish_date?: string | null
          slug?: string
          title?: string
          updated_at?: string
          volume_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "publication_editions_cover_media_id_fkey"
            columns: ["cover_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publication_editions_document_media_id_fkey"
            columns: ["document_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publication_editions_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publications"
            referencedColumns: ["id"]
          },
        ]
      }
      publications: {
        Row: {
          cover_media_id: string | null
          created_at: string
          description: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          id: string
          issn: string | null
          slug: string
          title: string
          type: Database["public"]["Enums"]["publication_type"]
          updated_at: string
        }
        Insert: {
          cover_media_id?: string | null
          created_at?: string
          description?: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          id?: string
          issn?: string | null
          slug: string
          title: string
          type: Database["public"]["Enums"]["publication_type"]
          updated_at?: string
        }
        Update: {
          cover_media_id?: string | null
          created_at?: string
          description?: string | null
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["entity_type"]
          id?: string
          issn?: string | null
          slug?: string
          title?: string
          type?: Database["public"]["Enums"]["publication_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "publications_cover_media_id_fkey"
            columns: ["cover_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
        ]
      }
      push_notification_queue: {
        Row: {
          body: string
          created_at: string
          device_token: string
          id: string
          notification_id: string | null
          retry_count: number
          sent: boolean
          sent_at: string | null
          title: string
        }
        Insert: {
          body: string
          created_at?: string
          device_token: string
          id?: string
          notification_id?: string | null
          retry_count?: number
          sent?: boolean
          sent_at?: string | null
          title: string
        }
        Update: {
          body?: string
          created_at?: string
          device_token?: string
          id?: string
          notification_id?: string | null
          retry_count?: number
          sent?: boolean
          sent_at?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_notification_queue_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      registration_consents: {
        Row: {
          accepted_at: string
          consent_text_snapshot: string | null
          consent_type: string
          created_at: string
          id: string
          legal_document_id: string
          legal_document_version_id: string
          policy_url_reference: string | null
          registration_id: string
        }
        Insert: {
          accepted_at?: string
          consent_text_snapshot?: string | null
          consent_type: string
          created_at?: string
          id?: string
          legal_document_id: string
          legal_document_version_id: string
          policy_url_reference?: string | null
          registration_id: string
        }
        Update: {
          accepted_at?: string
          consent_text_snapshot?: string | null
          consent_type?: string
          created_at?: string
          id?: string
          legal_document_id?: string
          legal_document_version_id?: string
          policy_url_reference?: string | null
          registration_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "registration_consents_legal_document_id_fkey"
            columns: ["legal_document_id"]
            isOneToOne: false
            referencedRelation: "legal_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registration_consents_legal_document_version_id_fkey"
            columns: ["legal_document_version_id"]
            isOneToOne: false
            referencedRelation: "legal_document_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registration_consents_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "competition_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      report_schedules: {
        Row: {
          created_at: string
          created_by: string | null
          format: Database["public"]["Enums"]["report_format"]
          frequency: Database["public"]["Enums"]["report_frequency"]
          id: string
          is_active: boolean
          last_run_at: string | null
          name: string
          next_run_at: string | null
          parameters: Json
          recipients: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          format: Database["public"]["Enums"]["report_format"]
          frequency: Database["public"]["Enums"]["report_frequency"]
          id?: string
          is_active?: boolean
          last_run_at?: string | null
          name: string
          next_run_at?: string | null
          parameters?: Json
          recipients?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          format?: Database["public"]["Enums"]["report_format"]
          frequency?: Database["public"]["Enums"]["report_frequency"]
          id?: string
          is_active?: boolean
          last_run_at?: string | null
          name?: string
          next_run_at?: string | null
          parameters?: Json
          recipients?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_schedules_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          approval_status: Database["public"]["Enums"]["approval_status"]
          created_at: string
          description: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          id: string
          reason: string
          reporter_profile_id: string
          reviewed_at: string | null
          reviewed_by: string | null
        }
        Insert: {
          approval_status?: Database["public"]["Enums"]["approval_status"]
          created_at?: string
          description?: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          id?: string
          reason: string
          reporter_profile_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Update: {
          approval_status?: Database["public"]["Enums"]["approval_status"]
          created_at?: string
          description?: string | null
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["entity_type"]
          id?: string
          reason?: string
          reporter_profile_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_reporter_profile_id_fkey"
            columns: ["reporter_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string
          granted: boolean
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          granted?: boolean
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string
          granted?: boolean
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_system: boolean
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_system?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_system?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      saved_filters: {
        Row: {
          created_at: string
          filters: Json
          id: string
          module: string
          name: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          filters?: Json
          id?: string
          module: string
          name: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          filters?: Json
          id?: string
          module?: string
          name?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_filters_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsors: {
        Row: {
          contact_email: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          logo_media_id: string | null
          name: string
          priority_order: number
          sponsor_type: Database["public"]["Enums"]["sponsor_type"]
          updated_at: string
          website_url: string | null
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          logo_media_id?: string | null
          name: string
          priority_order?: number
          sponsor_type?: Database["public"]["Enums"]["sponsor_type"]
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          logo_media_id?: string | null
          name?: string
          priority_order?: number
          sponsor_type?: Database["public"]["Enums"]["sponsor_type"]
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsors_logo_media_id_fkey"
            columns: ["logo_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsorships: {
        Row: {
          amount: number | null
          benefits: string[] | null
          created_at: string
          end_date: string | null
          id: string
          is_active: boolean
          sponsor_id: string
          sponsored_entity_id: string
          sponsored_entity_type: Database["public"]["Enums"]["entity_type"]
          start_date: string | null
          tier: Database["public"]["Enums"]["sponsorship_tier"]
          updated_at: string
        }
        Insert: {
          amount?: number | null
          benefits?: string[] | null
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          sponsor_id: string
          sponsored_entity_id: string
          sponsored_entity_type: Database["public"]["Enums"]["entity_type"]
          start_date?: string | null
          tier?: Database["public"]["Enums"]["sponsorship_tier"]
          updated_at?: string
        }
        Update: {
          amount?: number | null
          benefits?: string[] | null
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          sponsor_id?: string
          sponsored_entity_id?: string
          sponsored_entity_type?: Database["public"]["Enums"]["entity_type"]
          start_date?: string | null
          tier?: Database["public"]["Enums"]["sponsorship_tier"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sponsorships_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      student_certifications: {
        Row: {
          created_at: string
          credential_id: string | null
          credential_url: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          issuer: string
          name: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer: string
          name: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string
          name?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_certifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_experiences: {
        Row: {
          company_name: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_current: boolean
          profile_id: string
          role: string
          start_date: string
          updated_at: string
        }
        Insert: {
          company_name: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean
          profile_id: string
          role: string
          start_date: string
          updated_at?: string
        }
        Update: {
          company_name?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean
          profile_id?: string
          role?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_experiences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_projects: {
        Row: {
          created_at: string
          description: string
          end_date: string | null
          id: string
          live_url: string | null
          profile_id: string
          repo_url: string | null
          start_date: string | null
          technologies: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          end_date?: string | null
          id?: string
          live_url?: string | null
          profile_id: string
          repo_url?: string | null
          start_date?: string | null
          technologies?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          end_date?: string | null
          id?: string
          live_url?: string | null
          profile_id?: string
          repo_url?: string | null
          start_date?: string | null
          technologies?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_projects_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_resumes: {
        Row: {
          created_at: string
          id: string
          is_default: boolean
          media_id: string
          parsed_skills: Json | null
          profile_id: string
          resume_score: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean
          media_id: string
          parsed_skills?: Json | null
          profile_id: string
          resume_score?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean
          media_id?: string
          parsed_skills?: Json | null
          profile_id?: string
          resume_score?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_resumes_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_resumes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_skills: {
        Row: {
          created_at: string
          id: string
          is_verified: boolean
          proficiency: string | null
          profile_id: string
          skill_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_verified?: boolean
          proficiency?: string | null
          profile_id: string
          skill_name: string
        }
        Update: {
          created_at?: string
          id?: string
          is_verified?: boolean
          proficiency?: string | null
          profile_id?: string
          skill_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_skills_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_health_metrics: {
        Row: {
          id: string
          metadata: Json | null
          metric_name: string
          metric_value: number
          recorded_at: string
        }
        Insert: {
          id?: string
          metadata?: Json | null
          metric_name: string
          metric_value: number
          recorded_at?: string
        }
        Update: {
          id?: string
          metadata?: Json | null
          metric_name?: string
          metric_value?: number
          recorded_at?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_designations: {
        Row: {
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      timeline_comments: {
        Row: {
          comment: string
          created_at: string
          id: string
          is_edited: boolean
          parent_comment_id: string | null
          profile_id: string
          timeline_event_id: string
          updated_at: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          is_edited?: boolean
          parent_comment_id?: string | null
          profile_id: string
          timeline_event_id: string
          updated_at?: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          is_edited?: boolean
          parent_comment_id?: string | null
          profile_id?: string
          timeline_event_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "timeline_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_comments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_comments_timeline_event_id_fkey"
            columns: ["timeline_event_id"]
            isOneToOne: false
            referencedRelation: "timeline_events"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_event_links: {
        Row: {
          created_at: string
          id: string
          linked_entity_id: string
          linked_entity_type: Database["public"]["Enums"]["entity_type"]
          timeline_event_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          linked_entity_id: string
          linked_entity_type: Database["public"]["Enums"]["entity_type"]
          timeline_event_id: string
        }
        Update: {
          created_at?: string
          id?: string
          linked_entity_id?: string
          linked_entity_type?: Database["public"]["Enums"]["entity_type"]
          timeline_event_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_event_links_timeline_event_id_fkey"
            columns: ["timeline_event_id"]
            isOneToOne: false
            referencedRelation: "timeline_events"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_events: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          event_date: string
          event_type: string
          id: string
          profile_id: string | null
          public_id: string
          related_media_id: string | null
          title: string
          updated_at: string
          visibility: Database["public"]["Enums"]["visibility_type"]
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          event_date: string
          event_type: string
          id?: string
          profile_id?: string | null
          public_id?: string
          related_media_id?: string | null
          title: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility_type"]
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["entity_type"]
          event_date?: string
          event_type?: string
          id?: string
          profile_id?: string | null
          public_id?: string
          related_media_id?: string | null
          title?: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility_type"]
        }
        Relationships: [
          {
            foreignKeyName: "timeline_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_events_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_events_related_media_id_fkey"
            columns: ["related_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_reactions: {
        Row: {
          created_at: string
          id: string
          profile_id: string
          reaction: Database["public"]["Enums"]["reaction_type"]
          timeline_event_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id: string
          reaction: Database["public"]["Enums"]["reaction_type"]
          timeline_event_id: string
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string
          reaction?: Database["public"]["Enums"]["reaction_type"]
          timeline_event_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_reactions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_reactions_timeline_event_id_fkey"
            columns: ["timeline_event_id"]
            isOneToOne: false
            referencedRelation: "timeline_events"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_logs: {
        Row: {
          action: Database["public"]["Enums"]["verification_status"]
          created_at: string
          id: string
          remarks: string | null
          reviewer_id: string | null
          verification_request_id: string
        }
        Insert: {
          action: Database["public"]["Enums"]["verification_status"]
          created_at?: string
          id?: string
          remarks?: string | null
          reviewer_id?: string | null
          verification_request_id: string
        }
        Update: {
          action?: Database["public"]["Enums"]["verification_status"]
          created_at?: string
          id?: string
          remarks?: string | null
          reviewer_id?: string | null
          verification_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_logs_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_logs_verification_request_id_fkey"
            columns: ["verification_request_id"]
            isOneToOne: false
            referencedRelation: "verification_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_requests: {
        Row: {
          created_at: string
          id: string
          profile_id: string
          remarks: string | null
          requested_by: string
          reviewed_at: string | null
          reviewer_id: string | null
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id: string
          remarks?: string | null
          requested_by: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string
          remarks?: string | null
          requested_by?: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "verification_requests_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_requests_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      hostel_public_directory_v: {
        Row: {
          address: string | null
          contact_number: string | null
          cover_media_id: string | null
          cover_storage_bucket: string | null
          cover_storage_path: string | null
          current_warden_name: string | null
          description: string | null
          hostel_type: Database["public"]["Enums"]["hostel_type"] | null
          id: string | null
          is_sponsored: boolean | null
          is_verified: boolean | null
          logo_media_id: string | null
          logo_storage_bucket: string | null
          logo_storage_path: string | null
          name: string | null
          rent_info: string | null
          slug: string | null
        }
        Relationships: []
      }
      mv_department_statistics: {
        Row: {
          achievements_count: number | null
          content_sections_count: number | null
          department_id: string | null
          faculty_count: number | null
          gallery_albums_count: number | null
          name: string | null
          programs_count: number | null
          slug: string | null
          students_count: number | null
        }
        Relationships: []
      }
      placement_statistics: {
        Row: {
          average_package: number | null
          company_id: string | null
          company_name: string | null
          highest_package: number | null
          total_applications: number | null
          total_drives: number | null
          total_offers: number | null
        }
        Relationships: []
      }
      v_department_achievements: {
        Row: {
          achievement_date: string | null
          achievement_id: string | null
          achievement_slug: string | null
          category_name: string | null
          created_at: string | null
          department_id: string | null
          department_name: string | null
          department_slug: string | null
          description: string | null
          featured_image_storage_bucket: string | null
          featured_image_storage_path: string | null
          is_featured: boolean | null
          issuing_organization: string | null
          public_id: string | null
          title: string | null
        }
        Relationships: []
      }
      v_department_galleries: {
        Row: {
          album_id: string | null
          album_slug: string | null
          cover_media_id: string | null
          cover_storage_bucket: string | null
          cover_storage_path: string | null
          created_at: string | null
          department_id: string | null
          department_name: string | null
          department_slug: string | null
          description: string | null
          is_featured: boolean | null
          item_count: number | null
          public_id: string | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gallery_albums_cover_media_id_fkey"
            columns: ["cover_media_id"]
            isOneToOne: false
            referencedRelation: "media_files"
            referencedColumns: ["id"]
          },
        ]
      }
      v_department_news: {
        Row: {
          body: string | null
          content_id: string | null
          department_id: string | null
          department_name: string | null
          department_slug: string | null
          featured_image_storage_bucket: string | null
          featured_image_storage_path: string | null
          is_featured: boolean | null
          news_slug: string | null
          public_id: string | null
          published_at: string | null
          summary: string | null
          title: string | null
          view_count: number | null
        }
        Relationships: []
      }
      v_department_public_directory: {
        Row: {
          academic_excellence: string | null
          cover_url: string | null
          established_year: number | null
          faculty_count: number | null
          hero_url: string | null
          id: string | null
          is_active: boolean | null
          logo_url: string | null
          mission: string | null
          name: string | null
          programs_count: number | null
          short_name: string | null
          slug: string | null
          students_count: number | null
          vision: string | null
        }
        Relationships: []
      }
      v_department_statistics: {
        Row: {
          department_id: string | null
          department_name: string | null
          department_slug: string | null
          is_active: boolean | null
          is_verified: boolean | null
          total_achievements: number | null
          total_crs: number | null
          total_events: number | null
          total_gallery_albums: number | null
          total_notices: number | null
          total_publications: number | null
          total_students: number | null
          total_teachers: number | null
        }
        Insert: {
          department_id?: string | null
          department_name?: string | null
          department_slug?: string | null
          is_active?: boolean | null
          is_verified?: boolean | null
          total_achievements?: never
          total_crs?: never
          total_events?: never
          total_gallery_albums?: never
          total_notices?: never
          total_publications?: never
          total_students?: never
          total_teachers?: never
        }
        Update: {
          department_id?: string | null
          department_name?: string | null
          department_slug?: string | null
          is_active?: boolean | null
          is_verified?: boolean | null
          total_achievements?: never
          total_crs?: never
          total_events?: never
          total_gallery_albums?: never
          total_notices?: never
          total_publications?: never
          total_students?: never
          total_teachers?: never
        }
        Relationships: []
      }
      vw_public_contributors: {
        Row: {
          avatar_url: string | null
          contribution_month: number | null
          contribution_year: number | null
          display_name: string | null
          id: string | null
          profile_slug: string | null
          tier: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_competition_rankings: {
        Args: { p_competition_id: string }
        Returns: {
          marks_obtained: number
          normalized_score: number
          outcome: Database["public"]["Enums"]["competition_participant_outcome"]
          rank: number
          registration_id: string
          requires_tie_break: boolean
          result_id: string
        }[]
      }
      department_get_public_page: { Args: { p_slug: string }; Returns: Json }
      department_refresh_statistics: { Args: never; Returns: undefined }
      department_search: {
        Args: { p_query: string }
        Returns: {
          id: string
          match_type: string
          name: string
          slug: string
          snippet: string
        }[]
      }
      finalize_and_publish_competition_results: {
        Args: { p_competition_id: string }
        Returns: boolean
      }
      get_category_winners_archive: {
        Args: {
          p_category_id: string
          p_level?: Database["public"]["Enums"]["competition_level"]
          p_limit?: number
          p_month: number
          p_offset?: number
          p_year: number
        }
        Returns: {
          competition_id: string
          competition_level: Database["public"]["Enums"]["competition_level"]
          competition_slug: string
          competition_title: string
          edition_date: string
          edition_month: number
          edition_year: number
          full_name: string
          is_external: boolean
          profile_id: string
          profile_slug: string
          public_affiliation: string
          result_id: string
          result_outcome: Database["public"]["Enums"]["competition_participant_outcome"]
        }[]
      }
      get_competition_leaderboard: {
        Args: {
          p_academic_year?: string
          p_category_id?: string
          p_competition_level?: Database["public"]["Enums"]["competition_level"]
          p_limit?: number
          p_offset?: number
        }
        Returns: {
          avatar_url: string
          competitions_participated: number
          department_or_institution: string
          full_name: string
          leaderboard_rank: number
          podium_finishes: number
          profile_id: string
          profile_type: Database["public"]["Enums"]["profile_type"]
          second_place: number
          slug: string
          third_place: number
          total_points: number
          wins: number
        }[]
      }
      get_competition_winners_gallery: {
        Args: {
          p_category_id?: string
          p_competition_id?: string
          p_limit?: number
          p_offset?: number
          p_year?: number
        }
        Returns: {
          avatar_url: string
          category_name: string
          competition_id: string
          competition_slug: string
          competition_title: string
          competition_year: number
          department_or_institution: string
          full_name: string
          marks_obtained: number
          profile_id: string
          published_at: string
          result_id: string
          slug: string
        }[]
      }
      get_explore_by_month: {
        Args: { p_end: string; p_limit: number; p_start: string }
        Returns: {
          allow_team: boolean
          category_id: string
          certificate_delivery_method: string | null
          certificate_verification_enabled: boolean
          competition_level: Database["public"]["Enums"]["competition_level"]
          competition_status: Database["public"]["Enums"]["competition_status"]
          created_at: string
          created_by: string | null
          department_id: string | null
          description: string | null
          eligibility_configuration: Json | null
          eligibility_rules: string | null
          eligible_participant_types: Json | null
          ends_at: string | null
          external_participants_allowed: boolean
          featured_at: string | null
          featured_media_id: string | null
          highlights: Json | null
          hostel_id: string | null
          id: string
          important_information: Json | null
          internal_notes: string | null
          is_featured: boolean
          is_public: boolean
          judging_criteria: string | null
          max_participants: number | null
          max_team_size: number | null
          merit_certificate_enabled: boolean
          min_team_size: number | null
          mode: Database["public"]["Enums"]["competition_mode"]
          organization_id: string | null
          participation_certificate_enabled: boolean
          prize_details: string | null
          public_id: string
          published_at: string | null
          registration_approval_mode: string
          registration_close_at: string | null
          registration_fee: number | null
          registration_open_at: string | null
          reporting_instructions: string | null
          result_date: string | null
          result_visibility: string
          rules: string | null
          scheduled_publish_at: string | null
          short_description: string | null
          slug: string
          starts_at: string | null
          submission_close_at: string | null
          submission_open_at: string | null
          submission_requirements: Json | null
          theme: string | null
          title: string
          updated_at: string
          venue_details: string | null
          venue_name: string | null
          waitlist_enabled: boolean
          winner_certificate_enabled: boolean
        }[]
        SetofOptions: {
          from: "*"
          to: "competitions"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_latest_category_winners: {
        Args: { p_category_id: string }
        Returns: {
          competition_id: string
          competition_level: Database["public"]["Enums"]["competition_level"]
          competition_slug: string
          competition_title: string
          edition_date: string
          edition_month: number
          edition_year: number
          full_name: string
          is_external: boolean
          profile_id: string
          profile_slug: string
          public_affiliation: string
          result_id: string
          result_outcome: Database["public"]["Enums"]["competition_participant_outcome"]
        }[]
      }
      get_private_profile_fields: {
        Args: { p_profile_id: string }
        Returns: {
          date_of_birth: string
          email: string
          gender: Database["public"]["Enums"]["gender_type"]
          phone: string
        }[]
      }
      is_competition_admin: {
        Args: { p_competition_id?: string }
        Returns: boolean
      }
      is_hostel_bmc_with_permission: {
        Args: { perm_key: string; target_hostel_id: string }
        Returns: boolean
      }
      is_organization_admin: {
        Args: { target_org_id: string }
        Returns: boolean
      }
      is_platform_admin: { Args: never; Returns: boolean }
      is_platform_admin_rpc: { Args: never; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
      is_super_admin_rpc: { Args: never; Returns: boolean }
      resolve_competition_tie: {
        Args: {
          p_competition_id: string
          p_notes?: string
          p_registration_id: string
          p_tie_break_score: number
        }
        Returns: boolean
      }
      save_competition_workflow: {
        Args: { p_competition_id: string; p_payload: Json }
        Returns: undefined
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      validate_finite_numeric: {
        Args: { p_max: number; p_min: number; p_scale: number; p_val: Json }
        Returns: number
      }
    }
    Enums: {
      academic_status: "studying" | "completed" | "discontinued"
      alumni_verification_status: "pending" | "verified" | "rejected"
      approval_status: "pending" | "approved" | "rejected"
      audit_severity: "info" | "warning" | "critical"
      business_claim_status: "pending" | "approved" | "rejected"
      business_listing_status:
        | "draft"
        | "pending_review"
        | "published"
        | "suspended"
        | "closed"
        | "archived"
      business_verification_status:
        | "unverified"
        | "pending_verification"
        | "verified"
        | "rejected"
      campaign_status:
        | "draft"
        | "pending_approval"
        | "active"
        | "paused"
        | "goal_achieved"
        | "completed"
        | "archived"
        | "cancelled"
      certificate_type:
        | "winner"
        | "runner_up"
        | "second_runner_up"
        | "participation"
        | "appreciation"
        | "volunteer"
        | "organizer"
        | "judge"
        | "speaker"
        | "special_recognition"
      competition_level:
        | "department"
        | "hostel"
        | "university"
        | "inter_university"
        | "district"
        | "state"
        | "national"
      competition_mode: "offline" | "online" | "hybrid"
      competition_participant_outcome:
        | "eligible"
        | "participated"
        | "first"
        | "second"
        | "third"
        | "disqualified"
        | "withdrawn"
        | "absent"
      competition_position: "first" | "second" | "third" | "participant"
      competition_result_status:
        | "draft"
        | "evaluated"
        | "finalized"
        | "published"
      competition_status:
        | "draft"
        | "registration_open"
        | "registration_closed"
        | "submission_open"
        | "submission_closed"
        | "judging"
        | "completed"
        | "cancelled"
      connection_request_status: "pending" | "accepted" | "rejected"
      content_type:
        | "news"
        | "event"
        | "announcement"
        | "annual_function"
        | "voice_of_ravenshaw"
        | "blog"
        | "page_section"
        | "custom_block"
        | "press_release"
        | "editorial"
        | "opinion_piece"
        | "interview"
        | "magazine_article"
        | "research_news"
        | "campaign_update"
        | "fund_report"
        | "success_story"
        | "business_news"
        | "business_promo"
      course_level_type: "plus_two" | "ug" | "pg" | "phd" | "other"
      donation_frequency: "none" | "monthly" | "quarterly" | "yearly"
      donation_status: "pending" | "successful" | "failed" | "refunded"
      donation_type: "one_time" | "recurring"
      donation_visibility: "public" | "public_hide_amount" | "anonymous"
      editorial_role:
        | "chief_editor"
        | "managing_editor"
        | "section_editor"
        | "reviewer"
        | "proofreader"
        | "publisher"
      entity_type:
        | "university"
        | "department"
        | "hostel"
        | "organization"
        | "profile"
        | "competition"
        | "campaign"
        | "gallery_album"
        | "content"
        | "batch"
        | "program"
        | "event"
        | "achievement"
        | "endowment_fund"
        | "sponsor"
        | "business"
      fund_allocation_status: "pending" | "approved" | "disbursed" | "utilized"
      fund_type:
        | "permanent"
        | "named"
        | "scholarship"
        | "department"
        | "hostel"
        | "memorial"
        | "general"
        | "research"
      gender_type: "male" | "female" | "other" | "prefer_not_to_say"
      hostel_type: "boys" | "girls"
      hostel_type_enum:
        | "university_boys"
        | "university_girls"
        | "private_sponsored"
      job_posting_status: "active" | "closed"
      media_type: "image" | "video" | "document"
      mentorship_request_status:
        | "draft"
        | "pending"
        | "accepted"
        | "rejected"
        | "completed"
        | "cancelled"
      mentorship_session_status: "scheduled" | "completed" | "cancelled"
      notification_type:
        | "system"
        | "competition"
        | "verification"
        | "achievement"
        | "donation"
        | "general"
      organization_type_enum:
        | "ncc"
        | "nss"
        | "yrc"
        | "rotaract"
        | "cell"
        | "society"
        | "club"
        | "council"
        | "other"
      payment_provider:
        | "razorpay"
        | "cashfree"
        | "phonepe"
        | "stripe"
        | "manual"
        | "payu"
      payment_status:
        | "pending"
        | "processing"
        | "paid"
        | "failed"
        | "cancelled"
        | "refunded"
      placement_drive_status:
        | "draft"
        | "published"
        | "registration_open"
        | "registration_closed"
        | "shortlisting"
        | "assessment"
        | "interview"
        | "offer_released"
        | "completed"
        | "archived"
      placement_job_type:
        | "full_time"
        | "internship"
        | "apprenticeship"
        | "research"
        | "campus_placement"
        | "off_campus"
      placement_registration_status:
        | "applied"
        | "withdrawn"
        | "waitlisted"
        | "shortlisted"
        | "rejected"
        | "selected"
        | "offer_accepted"
        | "offer_declined"
      placement_round_type:
        | "written_test"
        | "coding_test"
        | "technical_interview"
        | "group_discussion"
        | "hr_interview"
        | "managerial_interview"
        | "presentation"
        | "final_interview"
        | "other"
      profile_status:
        | "unclaimed"
        | "pending"
        | "active"
        | "verified"
        | "rejected"
        | "suspended"
        | "archived"
      profile_type:
        | "student"
        | "teacher"
        | "alumni"
        | "external_participant"
        | "admin"
        | "super_admin"
        | "department_cr"
        | "hostel_bmc"
        | "organization_admin"
        | "contributor"
        | "volunteer"
        | "recruiter"
      publication_type:
        | "magazine"
        | "journal"
        | "newsletter"
        | "report"
        | "brochure"
        | "booklet"
      reaction_type: "like" | "love" | "celebrate" | "support"
      registration_status:
        | "pending_payment"
        | "registered"
        | "submitted"
        | "withdrawn"
        | "disqualified"
      report_format: "pdf" | "csv" | "excel"
      report_frequency: "daily" | "weekly" | "monthly"
      report_status: "pending" | "processing" | "completed" | "failed"
      sponsor_type:
        | "corporate"
        | "media"
        | "academic"
        | "ngo"
        | "government"
        | "individual"
        | "title"
        | "knowledge"
        | "technology"
        | "community"
      sponsorship_tier: "gold" | "silver" | "bronze" | "title" | "associate"
      success_story_category:
        | "entrepreneurship"
        | "civil_services"
        | "research"
        | "corporate"
        | "startup"
        | "international"
      verification_status: "pending" | "approved" | "rejected"
      visibility_type: "public" | "ravenshaw_only" | "private"
      widget_type:
        | "line_chart"
        | "bar_chart"
        | "pie_chart"
        | "area_chart"
        | "table"
        | "kpi_card"
        | "trend_indicator"
        | "leaderboard"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      academic_status: ["studying", "completed", "discontinued"],
      alumni_verification_status: ["pending", "verified", "rejected"],
      approval_status: ["pending", "approved", "rejected"],
      audit_severity: ["info", "warning", "critical"],
      business_claim_status: ["pending", "approved", "rejected"],
      business_listing_status: [
        "draft",
        "pending_review",
        "published",
        "suspended",
        "closed",
        "archived",
      ],
      business_verification_status: [
        "unverified",
        "pending_verification",
        "verified",
        "rejected",
      ],
      campaign_status: [
        "draft",
        "pending_approval",
        "active",
        "paused",
        "goal_achieved",
        "completed",
        "archived",
        "cancelled",
      ],
      certificate_type: [
        "winner",
        "runner_up",
        "second_runner_up",
        "participation",
        "appreciation",
        "volunteer",
        "organizer",
        "judge",
        "speaker",
        "special_recognition",
      ],
      competition_level: [
        "department",
        "hostel",
        "university",
        "inter_university",
        "district",
        "state",
        "national",
      ],
      competition_mode: ["offline", "online", "hybrid"],
      competition_participant_outcome: [
        "eligible",
        "participated",
        "first",
        "second",
        "third",
        "disqualified",
        "withdrawn",
        "absent",
      ],
      competition_position: ["first", "second", "third", "participant"],
      competition_result_status: [
        "draft",
        "evaluated",
        "finalized",
        "published",
      ],
      competition_status: [
        "draft",
        "registration_open",
        "registration_closed",
        "submission_open",
        "submission_closed",
        "judging",
        "completed",
        "cancelled",
      ],
      connection_request_status: ["pending", "accepted", "rejected"],
      content_type: [
        "news",
        "event",
        "announcement",
        "annual_function",
        "voice_of_ravenshaw",
        "blog",
        "page_section",
        "custom_block",
        "press_release",
        "editorial",
        "opinion_piece",
        "interview",
        "magazine_article",
        "research_news",
        "campaign_update",
        "fund_report",
        "success_story",
        "business_news",
        "business_promo",
      ],
      course_level_type: ["plus_two", "ug", "pg", "phd", "other"],
      donation_frequency: ["none", "monthly", "quarterly", "yearly"],
      donation_status: ["pending", "successful", "failed", "refunded"],
      donation_type: ["one_time", "recurring"],
      donation_visibility: ["public", "public_hide_amount", "anonymous"],
      editorial_role: [
        "chief_editor",
        "managing_editor",
        "section_editor",
        "reviewer",
        "proofreader",
        "publisher",
      ],
      entity_type: [
        "university",
        "department",
        "hostel",
        "organization",
        "profile",
        "competition",
        "campaign",
        "gallery_album",
        "content",
        "batch",
        "program",
        "event",
        "achievement",
        "endowment_fund",
        "sponsor",
        "business",
      ],
      fund_allocation_status: ["pending", "approved", "disbursed", "utilized"],
      fund_type: [
        "permanent",
        "named",
        "scholarship",
        "department",
        "hostel",
        "memorial",
        "general",
        "research",
      ],
      gender_type: ["male", "female", "other", "prefer_not_to_say"],
      hostel_type: ["boys", "girls"],
      hostel_type_enum: [
        "university_boys",
        "university_girls",
        "private_sponsored",
      ],
      job_posting_status: ["active", "closed"],
      media_type: ["image", "video", "document"],
      mentorship_request_status: [
        "draft",
        "pending",
        "accepted",
        "rejected",
        "completed",
        "cancelled",
      ],
      mentorship_session_status: ["scheduled", "completed", "cancelled"],
      notification_type: [
        "system",
        "competition",
        "verification",
        "achievement",
        "donation",
        "general",
      ],
      organization_type_enum: [
        "ncc",
        "nss",
        "yrc",
        "rotaract",
        "cell",
        "society",
        "club",
        "council",
        "other",
      ],
      payment_provider: [
        "razorpay",
        "cashfree",
        "phonepe",
        "stripe",
        "manual",
        "payu",
      ],
      payment_status: [
        "pending",
        "processing",
        "paid",
        "failed",
        "cancelled",
        "refunded",
      ],
      placement_drive_status: [
        "draft",
        "published",
        "registration_open",
        "registration_closed",
        "shortlisting",
        "assessment",
        "interview",
        "offer_released",
        "completed",
        "archived",
      ],
      placement_job_type: [
        "full_time",
        "internship",
        "apprenticeship",
        "research",
        "campus_placement",
        "off_campus",
      ],
      placement_registration_status: [
        "applied",
        "withdrawn",
        "waitlisted",
        "shortlisted",
        "rejected",
        "selected",
        "offer_accepted",
        "offer_declined",
      ],
      placement_round_type: [
        "written_test",
        "coding_test",
        "technical_interview",
        "group_discussion",
        "hr_interview",
        "managerial_interview",
        "presentation",
        "final_interview",
        "other",
      ],
      profile_status: [
        "unclaimed",
        "pending",
        "active",
        "verified",
        "rejected",
        "suspended",
        "archived",
      ],
      profile_type: [
        "student",
        "teacher",
        "alumni",
        "external_participant",
        "admin",
        "super_admin",
        "department_cr",
        "hostel_bmc",
        "organization_admin",
        "contributor",
        "volunteer",
        "recruiter",
      ],
      publication_type: [
        "magazine",
        "journal",
        "newsletter",
        "report",
        "brochure",
        "booklet",
      ],
      reaction_type: ["like", "love", "celebrate", "support"],
      registration_status: [
        "pending_payment",
        "registered",
        "submitted",
        "withdrawn",
        "disqualified",
      ],
      report_format: ["pdf", "csv", "excel"],
      report_frequency: ["daily", "weekly", "monthly"],
      report_status: ["pending", "processing", "completed", "failed"],
      sponsor_type: [
        "corporate",
        "media",
        "academic",
        "ngo",
        "government",
        "individual",
        "title",
        "knowledge",
        "technology",
        "community",
      ],
      sponsorship_tier: ["gold", "silver", "bronze", "title", "associate"],
      success_story_category: [
        "entrepreneurship",
        "civil_services",
        "research",
        "corporate",
        "startup",
        "international",
      ],
      verification_status: ["pending", "approved", "rejected"],
      visibility_type: ["public", "ravenshaw_only", "private"],
      widget_type: [
        "line_chart",
        "bar_chart",
        "pie_chart",
        "area_chart",
        "table",
        "kpi_card",
        "trend_indicator",
        "leaderboard",
      ],
    },
  },
} as const

