import type { TransactionType } from '@/enums'

export interface Transaction {
  id: number
  type: TransactionType
  amount: number
  description: string
  category: string
  platform: string | null
  referenceId: string | null
  transactionDate: string
  createdAt: string
  updatedAt: string
}

export interface FinanceSummary {
  totalIncome: number
  totalExpense: number
  totalCommission: number
  netProfit: number
  taxableIncome: number
  period: {
    startDate: string
    endDate: string
  }
}

export interface TaxCalculation {
  grossIncome: number
  deductions: number
  taxableIncome: number
  taxAmount: number
  effectiveRate: number
  taxBrackets: TaxBracket[]
}

export interface TaxBracket {
  min: number
  max: number | null
  rate: number
  amount: number
}
