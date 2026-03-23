import type { TransactionType } from '@/enums'

export interface Transaction {
  id: number
  userId: number
  type: TransactionType
  amount: number
  description: string | null
  category: string | null
  platform: string | null
  socialAccountId: number | null
  socialAccount?: { id: number; platform: string; accountName: string } | null
  transactionDate: string
  createdAt: string
  updatedAt: string
}

export interface FinanceSummary {
  totalIncome: number
  totalExpense: number
  totalCommission: number
  netProfit: number
  totalTransactions: number
  period: {
    startDate: string | null
    endDate: string | null
  }
}

export interface TaxCalculation {
  grossIncome: number
  deductions: {
    employment: number
    personal: number
    other: number
    total: number
  }
  taxableIncome: number
  taxAmount: number
  effectiveRate: number
  netIncome: number
  brackets: TaxBracket[]
}

export interface TaxBracket {
  min: number
  max: number | null
  rate: number
  taxAmount: number
}
