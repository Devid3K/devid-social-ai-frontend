<template>
  <n-card title="รายรับ / รายจ่าย">
    <div v-if="chartData.length === 0" class="flex items-center justify-center h-32 text-gray-400 text-sm">
      ยังไม่มีข้อมูลสำหรับแสดงกราฟ
    </div>
    <div v-else class="space-y-2">
      <div v-for="item in chartData" :key="item.label" class="flex items-center gap-3">
        <span class="text-xs text-gray-500 w-20 text-right shrink-0">{{ item.label }}</span>
        <div class="flex-1 flex gap-1 h-6">
          <div
            v-if="item.income > 0"
            class="bg-green-500 rounded-sm h-full"
            :style="{ width: `${(item.income / maxAmount) * 100}%` }"
            :title="`รายรับ: ฿${item.income.toLocaleString()}`"
          />
          <div
            v-if="item.expense > 0"
            class="bg-red-400 rounded-sm h-full"
            :style="{ width: `${(item.expense / maxAmount) * 100}%` }"
            :title="`รายจ่าย: ฿${item.expense.toLocaleString()}`"
          />
        </div>
        <span class="text-xs text-gray-500 w-24 shrink-0">
          ฿{{ (item.income - item.expense).toLocaleString() }}
        </span>
      </div>
      <div class="flex gap-4 mt-2 text-xs text-gray-500">
        <span class="flex items-center gap-1"><span class="w-3 h-3 bg-green-500 rounded-sm inline-block" /> รายรับ</span>
        <span class="flex items-center gap-1"><span class="w-3 h-3 bg-red-400 rounded-sm inline-block" /> รายจ่าย</span>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Transaction } from '@/types/finance.d'

const props = withDefaults(
  defineProps<{
    data?: Transaction[]
  }>(),
  { data: () => [] }
)

const chartData = computed(() => {
  const grouped: Record<string, { income: number; expense: number }> = {}

  for (const tx of props.data) {
    const date = new Date(tx.transactionDate ?? tx.createdAt)
    const label = `${date.getMonth() + 1}/${date.getFullYear()}`
    if (!grouped[label]) grouped[label] = { income: 0, expense: 0 }
    const amount = Number(tx.amount ?? 0)
    if (tx.type === 'income' || tx.type === 'commission') {
      grouped[label].income += amount
    } else {
      grouped[label].expense += amount
    }
  }

  return Object.entries(grouped)
    .map(([label, vals]) => ({ label, ...vals }))
    .slice(-6)
})

const maxAmount = computed(() => {
  let max = 1
  for (const item of chartData.value) {
    max = Math.max(max, item.income + item.expense)
  }
  return max
})
</script>
