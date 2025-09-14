export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      contact_requests: {
        Row: {
          approved_at: string | null
          created_at: string
          employer_contact: Json
          id: string
          job_id: string
          message: string | null
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          created_at?: string
          employer_contact: Json
          id?: string
          job_id: string
          message?: string | null
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          created_at?: string
          employer_contact?: Json
          id?: string
          job_id?: string
          message?: string | null
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          category: string
          created_at: string
          description: string
          employer_name: string | null
          id: string
          job_type: string
          location: string | null
          posted_by: string | null
          skills_required: string[] | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          category: string
          created_at?: string
          description: string
          employer_name?: string | null
          id?: string
          job_type: string
          location?: string | null
          posted_by?: string | null
          skills_required?: string[] | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          category?: string
          created_at?: string
          description?: string
          employer_name?: string | null
          id?: string
          job_type?: string
          location?: string | null
          posted_by?: string | null
          skills_required?: string[] | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      otps: {
        Row: {
          attempts: number
          created_at: string
          email: string
          expires_at: string
          id: string
          otp_code: string
          otp_type: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          otp_code: string
          otp_type: string
        }
        Update: {
          attempts?: number
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          otp_code?: string
          otp_type?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          availability: string | null
          category: string
          contact_info: Json | null
          created_at: string
          description: string | null
          email: string | null
          experience_level: string | null
          hourly_rate: number | null
          id: string
          location: string | null
          name: string
          portfolio_links: string[] | null
          profile_photo_url: string | null
          skills: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          availability?: string | null
          category: string
          contact_info?: Json | null
          created_at?: string
          description?: string | null
          email?: string | null
          experience_level?: string | null
          hourly_rate?: number | null
          id?: string
          location?: string | null
          name: string
          portfolio_links?: string[] | null
          profile_photo_url?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          availability?: string | null
          category?: string
          contact_info?: Json | null
          created_at?: string
          description?: string | null
          email?: string | null
          experience_level?: string | null
          hourly_rate?: number | null
          id?: string
          location?: string | null
          name?: string
          portfolio_links?: string[] | null
          profile_photo_url?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      website_content: {
        Row: {
          content: string | null
          crawled_at: string
          html_content: string | null
          id: string
          metadata: Json | null
          title: string | null
          url: string
        }
        Insert: {
          content?: string | null
          crawled_at?: string
          html_content?: string | null
          id?: string
          metadata?: Json | null
          title?: string | null
          url: string
        }
        Update: {
          content?: string | null
          crawled_at?: string
          html_content?: string | null
          id?: string
          metadata?: Json | null
          title?: string | null
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_otps: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_otp: {
        Args: { email_param: string; otp_type_param: string }
        Returns: string
      }
      get_public_jobs: {
        Args: Record<PropertyKey, never>
        Returns: {
          budget_max: number
          budget_min: number
          category: string
          created_at: string
          description: string
          employer_name: string
          id: string
          job_type: string
          location: string
          skills_required: string[]
          status: string
          title: string
          updated_at: string
        }[]
      }
      get_public_student_profiles: {
        Args: Record<PropertyKey, never>
        Returns: {
          availability: string
          category: string
          created_at: string
          description: string
          experience_level: string
          hourly_rate: number
          id: string
          location: string
          name: string
          portfolio_links: string[]
          profile_photo_url: string
          skills: string[]
          updated_at: string
        }[]
      }
      get_public_students: {
        Args: Record<PropertyKey, never>
        Returns: {
          availability: string
          category: string
          created_at: string
          description: string
          experience_level: string
          hourly_rate: number
          id: string
          location: string
          name: string
          portfolio_links: string[]
          profile_photo_url: string
          skills: string[]
          updated_at: string
        }[]
      }
      sanitize_html_input: {
        Args: { input_text: string }
        Returns: string
      }
      test_smtp_config: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      verify_otp: {
        Args: {
          email_param: string
          otp_code_param: string
          otp_type_param: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
  public: {
    Enums: {},
  },
} as const
