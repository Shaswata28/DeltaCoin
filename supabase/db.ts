import { supabase } from './client'
import type { Transaction, TransactionType, Budget, Wallet, Notification } from './client'

export async function getUserWallet(userId?: string): Promise<Wallet | null> {
  try {
    let targetUserId = userId;
    
    if (!targetUserId) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')
      targetUserId = user.id;
    }

    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', targetUserId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    throw error
  }
}

export interface HomeWalletData {
  balance: number;
  monthlySpent: number;
  monthlyLimit: number;
  recentTransactions: {
    id: string;
    type: 'send' | 'receive';
    amount: number;
    recipient: string;
    category: string;
    timestamp: Date;
    status: 'completed' | 'pending' | 'failed';
  }[];
}

export async function getHomeWalletData(): Promise<HomeWalletData> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', user.id)
      .single()

    if (walletError) throw walletError

    const currentDate = new Date()
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`
    
    const { data: budget, error: budgetError } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)
      .eq('month', currentMonth)
      .single()

    if (budgetError && budgetError.code !== 'PGRST116') throw budgetError

    const monthlyLimit = budget ? 
      Number(budget.canteen) + 
      Number(budget.library) + 
      Number(budget.lab) + 
      Number(budget.club) + 
      Number(budget.other) : 0

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

    const { data: monthlyTransactions, error: monthlyTransactionsError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', firstDayOfMonth.toISOString().split('T')[0])
      .lte('date', lastDayOfMonth.toISOString().split('T')[0])
      .eq('type', 'expense')

    if (monthlyTransactionsError) throw monthlyTransactionsError

    const monthlySpent = monthlyTransactions
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const { data: recentTransactionsData, error: recentTransactionsError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    if (recentTransactionsError) throw recentTransactionsError

    const recentTransactions = recentTransactionsData.map(t => ({
      id: t.id,
      type: t.type === 'income' ? 'receive' as const : 'send' as const,
      amount: Number(t.amount),
      recipient: t.description || 'Unknown',
      category: t.category,
      timestamp: new Date(t.created_at),
      status: 'completed' as const
    }))

    return {
      balance: Number(wallet.balance),
      monthlySpent,
      monthlyLimit,
      recentTransactions
    }
  } catch (error) {
    throw error
  }
}

export async function getUserTransactionCount(): Promise<number> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    const { count, error } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (error) throw error
    return count || 0
  } catch (error) {
    throw error
  }
}

export async function getCategorySpending(month: string): Promise<Record<string, number>> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    const [year, monthNum] = month.split('-').map(num => parseInt(num))
    
    const lastDay = new Date(year, monthNum, 0).getDate()
    
    const startDate = `${month}-01`
    const endDate = `${month}-${String(lastDay).padStart(2, '0')}`

    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('category, amount')
      .eq('user_id', user.id)
      .eq('type', 'expense')
      .gte('date', startDate)
      .lte('date', endDate)

    if (error) throw error

    const categoryTotals: Record<string, number> = {}
    transactions?.forEach(transaction => {
      const category = transaction.category
      categoryTotals[category] = (categoryTotals[category] || 0) + Number(transaction.amount)
    })

    return categoryTotals
  } catch (error) {
    throw error
  }
}

export async function getUnreadNotificationsCount(): Promise<number> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('read_status', false)

    if (error) throw error
    return count || 0
  } catch (error) {
    throw error
  }
}

export async function getUserTransactionCount(): Promise<number> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    const { count, error } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (error) throw error
    return count || 0
  } catch (error) {
    throw error
  }
}

export async function getCategorySpending(month: string): Promise<Record<string, number>> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    const [year, monthNum] = month.split('-').map(num => parseInt(num))
    
    const lastDay = new Date(year, monthNum, 0).getDate()
    
    const startDate = `${month}-01`
    const endDate = `${month}-${String(lastDay).padStart(2, '0')}`

    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('category, amount')
      .eq('user_id', user.id)
      .eq('type', 'expense')
      .gte('date', startDate)
      .lte('date', endDate)

    if (error) throw error

    const categoryTotals: Record<string, number> = {}
    transactions?.forEach(transaction => {
      const category = transaction.category
      categoryTotals[category] = (categoryTotals[category] || 0) + Number(transaction.amount)
    })

    return categoryTotals
  } catch (error) {
    throw error
  }
}

export async function getUserNotifications(readStatusFilter?: boolean): Promise<Notification[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (readStatusFilter !== undefined) {
      query = query.eq('read_status', readStatusFilter)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  } catch (error) {
    throw error
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read_status: true })
      .eq('id', notificationId)

    if (error) throw error
  } catch (error) {
    throw error
  }
}

export async function markAllNotificationsAsRead(): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    const { error } = await supabase
      .from('notifications')
      .update({ read_status: true })
      .eq('user_id', user.id)
      .eq('read_status', false)

    if (error) throw error
  } catch (error) {
    throw error
  }
}

export async function deleteAllNotifications(): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', user.id)

    if (error) throw error
  } catch (error) {
    throw error
  }
}
