import { defineStore, acceptHMRUpdate } from 'pinia'
import { ApiService } from '@/services/apiService'
import type { Transaction, FinanceSummary, TaxCalculation } from '@/types/finance.d'

export const useFinanceStore = defineStore('finance', {
  state: () => ({
    loading: false,
    error: null as string | null,
    list: [] as Transaction[],
    summary: null as FinanceSummary | null,
    taxCalculation: null as TaxCalculation | null,
    // Pagination
    page: 1,
    limit: 20,
    total: 0,
  }),

  getters: {
    totalPages: (state) => Math.ceil(state.total / state.limit),
  },

  actions: {
    async fetch(params?: { page?: number; limit?: number; type?: string; startDate?: string; endDate?: string }) {
      this.loading = true
      this.error = null
      try {
        // TODO: map paginated response to list and total
        const resp = await ApiService.v1.Finance.Transactions({
          page: params?.page ?? this.page,
          limit: params?.limit ?? this.limit,
          type: params?.type,
          startDate: params?.startDate,
          endDate: params?.endDate,
        })
        this.list = resp.data.data ?? resp.data
        this.total = resp.data.total ?? this.list.length
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to load transactions'
      } finally {
        this.loading = false
      }
    },

    async create(data: Partial<Transaction>) {
      try {
        // TODO: append new transaction and refresh summary
        const resp = await ApiService.v1.Finance.CreateTransaction(data)
        this.list.unshift(resp.data)
        this.total += 1
        return resp.data as Transaction
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to create transaction'
        throw error
      }
    },

    async update(id: number, data: Partial<Transaction>) {
      try {
        // TODO: update transaction in list in-place
        const resp = await ApiService.v1.Finance.UpdateTransaction(id, data)
        const index = this.list.findIndex((t) => t.id === id)
        if (index !== -1) this.list[index] = resp.data
        return resp.data as Transaction
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to update transaction'
        throw error
      }
    },

    async delete(id: number) {
      try {
        await ApiService.v1.Finance.DeleteTransaction(id)
        this.list = this.list.filter((t) => t.id !== id)
        this.total = Math.max(0, this.total - 1)
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to delete transaction'
        throw error
      }
    },

    async fetchSummary(params?: { startDate?: string; endDate?: string }) {
      try {
        // TODO: map finance summary response
        const resp = await ApiService.v1.Finance.Summary(params)
        this.summary = resp.data
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to load finance summary'
        throw error
      }
    },

    async calculateTax(data: { grossIncome: number; deductions?: number }) {
      this.loading = true
      this.error = null
      try {
        // TODO: map tax calculation response
        const resp = await ApiService.v1.Finance.CalculateTax(data)
        this.taxCalculation = resp.data
        return resp.data as TaxCalculation
      } catch (error: any) {
        this.error = error?.message ?? 'Failed to calculate tax'
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})

if (import.meta.hot) {
  acceptHMRUpdate(useFinanceStore, import.meta.hot)
}
