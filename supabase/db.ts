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

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: 'transaction' | 'budget_alert' | 'friend_request' | 'money_request' | 'system',
  relatedEntityId?: string
): Promise<Notification> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        read_status: false,
        related_entity_id: relatedEntityId,
      })
      .select()
      .single()

    if (error) throw error
    return data
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

export async function updateWalletBalance(amount: number, operation: 'add' | 'subtract' = 'add', userId?: string) {
  try {
    if (!isValidAmount(amount)) {
      throw new Error('Invalid amount: must be a positive number')
    }

    let targetUserId = userId;
    
    if (!targetUserId) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')
      targetUserId = user.id;
    }

    const wallet = await getUserWallet(targetUserId)
    if (!wallet) throw new Error('Wallet not found')

    const newBalance = operation === 'add' 
      ? Number(wallet.balance) + amount 
      : Number(wallet.balance) - amount

    if (newBalance < 0) {
      throw new Error('Insufficient balance')
    }

    const roundedBalance = Math.round(newBalance * 100) / 100

    const { data, error } = await supabase
      .from('wallets')
      .update({ balance: roundedBalance })
      .eq('user_id', targetUserId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    throw error
  }
}

function isValidAmount(amount: number): boolean {
  return amount >= 0 && Number.isFinite(amount)
}

export interface CreateTransactionData {
  amount: number
  type: TransactionType
  category: string
  description?: string
  date?: string
}

export async function createTransaction(transactionData: CreateTransactionData & { stripe_payment_intent_id?: string }, userId?: string) {
  try {
    if (!isValidAmount(transactionData.amount)) {
      throw new Error('Invalid amount: must be a positive number')
    }

    let targetUserId = userId;
    
    if (!targetUserId) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')
      targetUserId = user.id;
    }

    const roundedAmount = Math.round(transactionData.amount * 100) / 100

    // Update wallet balance first
    const operation = transactionData.type === 'income' ? 'add' : 'subtract'
    await updateWalletBalance(roundedAmount, operation, targetUserId)

    // Only create transaction record AFTER successful balance update
    const transactionInsert: any = {
      user_id: targetUserId,
      amount: roundedAmount,
      type: transactionData.type,
      category: transactionData.category,
      description: transactionData.description || '',
      date: transactionData.date || new Date().toISOString().split('T')[0],
    }

    // Only add stripe fields if they exist in the schema
    if (transactionData.stripe_payment_intent_id) {
      transactionInsert.stripe_payment_intent_id = transactionData.stripe_payment_intent_id;
      transactionInsert.status = 'pending';
    }

    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert(transactionInsert)
      .select()
      .single()

    if (transactionError) {
      // If transaction record creation fails after successful balance update,
      // we need to revert the balance change
      const revertOperation = operation === 'add' ? 'subtract' : 'add'
      try {
        await updateWalletBalance(roundedAmount, revertOperation, targetUserId)
      } catch (revertError) {
        console.error('Failed to revert balance after transaction creation failure:', revertError)
        // Log this critical error but don't throw to avoid masking the original error
      }
      throw transactionError
    }

    // Create notification for the transaction
    const notificationTitle = transactionData.type === 'income' ? 'Top-up Successful' : 'Payment Successful'
    const notificationMessage = transactionData.type === 'income' 
      ? `Your account has been topped up with ৳${roundedAmount.toFixed(2)}`
      : `Payment of ৳${roundedAmount.toFixed(2)} to ${transactionData.category} was successful`

    await createNotification(
      targetUserId,
      notificationTitle,
      notificationMessage,
      'transaction',
      transaction.id
    )

    return transaction
  } catch (error) {
    throw error
  }
}

export async function getUserTransactions(limit?: number, offset?: number): Promise<Transaction[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (limit) query = query.limit(limit)
    if (offset) query = query.range(offset, offset + (limit || 10) - 1)

    const { data, error } = await query

    if (error) throw error
    return data || []
  } catch (error) {
    throw error
  }
}

export async function getTransactionsByCategory(category: string): Promise<Transaction[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .eq('category', category)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    throw error
  }
}

export async function getTransactionsByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    throw error
  }
}

export async function getBudgetProgress(month: string): Promise<{
  category: string;
  spent: number;
  limit: number;
  percentage: number;
}[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    const { data: budget, error: budgetError } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)
      .eq('month', month)
      .single()

    if (budgetError && budgetError.code !== 'PGRST116') throw budgetError
    if (!budget) return []

    const [year, monthNum] = month.split('-').map(num => parseInt(num))
    const lastDay = new Date(year, monthNum, 0).getDate()
    const startDate = `${month}-01`
    const endDate = `${month}-${String(lastDay).padStart(2, '0')}`

    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('category, amount')
      .eq('user_id', user.id)
      .eq('type', 'expense')
      .gte('date', startDate)
      .lte('date', endDate)

    if (transactionsError) throw transactionsError

    const categorySpending: Record<string, number> = {}
    transactions?.forEach(transaction => {
      const category = transaction.category.toLowerCase()
      categorySpending[category] = (categorySpending[category] || 0) + Number(transaction.amount)
    })

    const budgetCategories = {
      canteen: { name: 'Canteen', limit: Number(budget.canteen) },
      library: { name: 'Library', limit: Number(budget.library) },
      lab: { name: 'Lab', limit: Number(budget.lab) },
      club: { name: 'Club', limit: Number(budget.club) },
      other: { name: 'Other', limit: Number(budget.other) }
    }

    return Object.entries(budgetCategories).map(([key, { name, limit }]) => ({
      category: name,
      spent: categorySpending[key] || 0,
      limit,
      percentage: limit > 0 ? (categorySpending[key] || 0) / limit * 100 : 0
    }))
  } catch (error) {
    throw error
  }
}
