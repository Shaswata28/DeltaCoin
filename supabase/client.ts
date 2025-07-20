import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types based on your database schema
export interface User {
  id: string
  full_name: string
  student_id: string // 9 digits
  contact_number: string // numeric
  username: string
  pin: string // 5 digits
  profile_picture_url?: string
  created_at: string
}

export interface Wallet {
  id: string
  user_id: string
  balance: number // numeric(10,2)
  created_at: string
}