import 'react-native-get-random-values';
import { supabase } from './client'
import type { User } from './client'

export interface SignUpData {
  email: string
  password: string
  fullName: string
  studentId: string
  contactNumber: string
  username: string
  pin: string
}

export interface SignInData {
  email: string
  password: string
}

function isValidStudentId(studentId: string): boolean {
  return /^\d{9}$/.test(studentId)
}

function isValidPin(pin: string): boolean {
  return /^\d{5}$/.test(pin)
}

function isValidContactNumber(contactNumber: string): boolean {
  return /^\d+$/.test(contactNumber)
}

export async function signUp(userData: SignUpData) {
  try {
    if (!isValidStudentId(userData.studentId)) {
      throw new Error('Student ID must be exactly 9 digits')
    }
    if (!isValidPin(userData.pin)) {
      throw new Error('PIN must be exactly 5 digits')
    }
    if (!isValidContactNumber(userData.contactNumber)) {
      throw new Error('Contact number must contain only digits')
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    })

    if (authError) throw authError

    if (authData.user) {
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          full_name: userData.fullName,
          student_id: userData.studentId,
          contact_number: userData.contactNumber,
          username: userData.username,
          pin: userData.pin,
          password: userData.password,
        })
        .select()
        .single()

      if (profileError) throw profileError

      const { error: walletError } = await supabase
        .from('wallets')
        .insert({
          user_id: authData.user.id,
          balance: 0,
        })

      if (walletError) throw walletError

      return { user: authData.user, profile: profileData }
    }

    return { user: null, profile: null }
  } catch (error) {
    throw error
  }
}

export async function signIn(credentials: SignInData) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (error) throw error

    if (data.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (userError) throw userError

      return { user: userData }
    }

    throw new Error('Invalid email or password')
  } catch (error) {
    throw error
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    throw error
  }
}

export async function getCurrentSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  } catch (error) {
    throw error
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    throw error
  }
}

export async function getCurrentUserProfile(): Promise<User | null> {
  try {
    const user = await getCurrentUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    throw error
  }
}

export async function updateUserProfile(updates: Partial<Omit<User, 'id' | 'created_at'>>, userId?: string) {
  try {
    let targetUserId = userId;
    
    if (!targetUserId) {
      const user = await getCurrentUser()
      if (!user) throw new Error('No authenticated user')
      targetUserId = user.id;
    }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', targetUserId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    throw error
  }
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return !!session
  } catch (error) {
    return false
  }
}