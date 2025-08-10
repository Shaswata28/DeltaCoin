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

export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  user_id: string
  amount: number // numeric(10,2)
  type: TransactionType
  category: string
  description: string
  date: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'transaction' | 'budget_alert' | 'friend_request' | 'money_request' | 'system'
  read_status: boolean
  related_entity_id?: string
  created_at: string
}

export interface Budget {
  id: string
  user_id: string
  month: string // Format: YYYY-MM
  canteen: number // numeric
  library: number // numeric
  lab: number // numeric
  club: number // numeric
  other: number // numeric
  created_at: string
}