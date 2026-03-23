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
        const resp = await ApiService.v1.Finance.Transactions({
          page: params?.page ?? this.page,
          limit: params?.limit ?? this.limit,
          type: params?.type,
          startDate: params?.startDate,
          endDate: params?.endDate,
        })
        const payload = resp.data?.data ?? resp.data
        this.list = payload.data ?? payload
        this.total = payload.total ?? this.list.length
        this.page = payload.page ?? params?.page ?? this.page
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'โหลดรายการไม่สำเร็จ'
      } finally {
        this.loading = false
      }
    },

    async create(data: Partial<Transaction>) {
      this.error = null
      try {
        const resp = await ApiService.v1.Finance.CreateTransaction(data)
        const tx = resp.data?.data ?? resp.data
        this.list.unshift(tx)
        this.total += 1
        return tx as Transaction
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'สร้างรายการไม่สำเร็จ'
        throw error
      }
    },

    async update(id: number, data: Partial<Transaction>) {
      this.error = null
      try {
        const resp = await ApiService.v1.Finance.UpdateTransaction(id, data)
        const tx = resp.data?.data ?? resp.data
        const index = this.list.findIndex((t) => t.id === id)
        if (index !== -1) this.list[index] = tx
        return tx as Transaction
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'แก้ไขรายการไม่สำเร็จ'
        throw error
      }
    },

    async delete(id: number) {
      try {
        await ApiService.v1.Finance.DeleteTransaction(id)
        this.list = this.list.filter((t) => t.id !== id)
        this.total = Math.max(0, this.total - 1)
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'ลบรายการไม่สำเร็จ'
        throw error
      }
    },

    async fetchSummary(params?: { startDate?: string; endDate?: string }) {
      try {
        const resp = await ApiService.v1.Finance.Summary(params)
        this.summary = resp.data?.data ?? resp.data
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'โหลดสรุปไม่สำเร็จ'
      }
    },

    async calculateTax(data: { grossIncome: number; personalDeduction?: number; employmentDeduction?: number; otherDeductions?: number }) {
      this.loading = true
      this.error = null
      try {
        const resp = await ApiService.v1.Finance.CalculateTax(data)
        this.taxCalculation = resp.data?.data ?? resp.data
        return this.taxCalculation as TaxCalculation
      } catch (error: any) {
        this.error = error?.response?.data?.message ?? error?.message ?? 'คำนวณภาษีไม่สำเร็จ'
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
