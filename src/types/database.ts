export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          age: number | null
          default_track_length: number
          wheel_diameter: number
          share_data_enabled: boolean
          share_age: boolean
          share_lap_times: boolean
          share_gear_ratios: boolean
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          age?: number | null
          default_track_length?: number
          wheel_diameter?: number
          share_data_enabled?: boolean
          share_age?: boolean
          share_lap_times?: boolean
          share_gear_ratios?: boolean
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          age?: number | null
          default_track_length?: number
          wheel_diameter?: number
          share_data_enabled?: boolean
          share_age?: boolean
          share_lap_times?: boolean
          share_gear_ratios?: boolean
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      chainrings: {
        Row: {
          id: string
          user_id: string
          teeth: number
          brand: string | null
          purchase_date: string | null
          is_favorite: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          teeth: number
          brand?: string | null
          purchase_date?: string | null
          is_favorite?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          teeth?: number
          brand?: string | null
          purchase_date?: string | null
          is_favorite?: boolean
          created_at?: string
        }
        Relationships: []
      }
      sprockets: {
        Row: {
          id: string
          user_id: string
          teeth: number
          brand: string | null
          purchase_date: string | null
          is_favorite: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          teeth: number
          brand?: string | null
          purchase_date?: string | null
          is_favorite?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          teeth?: number
          brand?: string | null
          purchase_date?: string | null
          is_favorite?: boolean
          created_at?: string
        }
        Relationships: []
      }
      lap_sessions: {
        Row: {
          id: string
          user_id: string
          event_type: string
          track_name: string | null
          track_length: number
          chainring_id: string | null
          sprocket_id: string | null
          notes: string | null
          session_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_type: string
          track_name?: string | null
          track_length?: number
          chainring_id?: string | null
          sprocket_id?: string | null
          notes?: string | null
          session_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_type?: string
          track_name?: string | null
          track_length?: number
          chainring_id?: string | null
          sprocket_id?: string | null
          notes?: string | null
          session_date?: string
          created_at?: string
        }
        Relationships: []
      }
      lap_times: {
        Row: {
          id: string
          session_id: string
          lap_number: number
          time_ms: number
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          lap_number: number
          time_ms: number
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          lap_number?: number
          time_ms?: number
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Chainring = Database['public']['Tables']['chainrings']['Row']
export type ChainringInsert = Database['public']['Tables']['chainrings']['Insert']
export type ChainringUpdate = Database['public']['Tables']['chainrings']['Update']

export type Sprocket = Database['public']['Tables']['sprockets']['Row']
export type SprocketInsert = Database['public']['Tables']['sprockets']['Insert']
export type SprocketUpdate = Database['public']['Tables']['sprockets']['Update']

export type LapSession = Database['public']['Tables']['lap_sessions']['Row']
export type LapSessionInsert = Database['public']['Tables']['lap_sessions']['Insert']
export type LapSessionUpdate = Database['public']['Tables']['lap_sessions']['Update']

export type LapTime = Database['public']['Tables']['lap_times']['Row']
export type LapTimeInsert = Database['public']['Tables']['lap_times']['Insert']
export type LapTimeUpdate = Database['public']['Tables']['lap_times']['Update']

// Session with related data
export interface LapSessionWithDetails extends LapSession {
  chainring?: Chainring | null
  sprocket?: Sprocket | null
  lap_times: LapTime[]
}

// Event types for track cycling
export const EVENT_TYPES = [
  'Sprint',
  'Individual Pursuit',
  'Team Pursuit',
  'Keirin',
  'Madison',
  'Omnium',
  'Points Race',
  'Elimination Race',
  'Scratch Race',
  'Derny Pace',
  'Flying Lap',
  'Time Trial',
] as const

export type EventType = typeof EVENT_TYPES[number]
