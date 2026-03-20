<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
      <n-button type="primary" @click="openCreateModal">+ Add User</n-button>
    </div>

    <n-alert v-if="userStore.error" type="error" :title="userStore.error" closable />

    <!-- Search / filter -->
    <div class="flex gap-3 items-center">
      <n-input v-model:value="search" placeholder="Search users..." clearable class="max-w-xs" />
      <n-select
        v-model:value="roleFilter"
        :options="roleOptions"
        placeholder="All Roles"
        clearable
        class="w-36"
        @update:value="handleFilter"
      />
    </div>

    <!-- Table -->
    <n-card>
      <n-data-table
        :columns="columns"
        :data="userStore.list"
        :loading="userStore.loading"
        :pagination="pagination"
        :bordered="false"
        size="small"
        @update:page="handlePageChange"
      />
    </n-card>

    <!-- Create / Edit modal -->
    <n-modal v-model:show="showModal" preset="card" :title="editingUser ? 'Edit User' : 'Create User'" class="w-full max-w-md">
      <n-form :model="formData" label-placement="top" @submit.prevent="handleSave">
        <n-form-item label="Name">
          <n-input v-model:value="formData.name" placeholder="Full name" />
        </n-form-item>
        <n-form-item label="Email">
          <n-input v-model:value="formData.email" type="email" placeholder="user@example.com" />
        </n-form-item>
        <n-form-item v-if="!editingUser" label="Password">
          <n-input v-model:value="formData.password" type="password" show-password-on="click" placeholder="••••••••" />
        </n-form-item>
        <n-form-item label="Role">
          <n-select v-model:value="formData.role" :options="roleOptions" />
        </n-form-item>
        <div class="flex justify-end gap-2 mt-2">
          <n-button @click="showModal = false">Cancel</n-button>
          <n-button type="primary" attr-type="submit" :loading="userStore.loading">
            {{ editingUser ? 'Save Changes' : 'Create User' }}
          </n-button>
        </div>
      </n-form>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h, onMounted } from 'vue'
import { NButton, NTag, NSwitch } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { useUserManagementStore } from '@/stores/user-management'
import type { User } from '@/types/auth.d'
import { UserRole } from '@/enums'

const userStore = useUserManagementStore()
const showModal = ref(false)
const editingUser = ref<User | null>(null)
const search = ref('')
const roleFilter = ref<UserRole | null>(null)

const formData = ref({
  name: '',
  email: '',
  password: '',
  role: UserRole.USER as UserRole,
})

const roleOptions = [
  { label: 'User', value: UserRole.USER },
  { label: 'Super Admin', value: UserRole.SUPER_ADMIN },
]

const columns: DataTableColumns<User> = [
  {
    title: 'Name',
    key: 'name',
    render: (row) => row.name ?? row.email,
  },
  { title: 'Email', key: 'email', ellipsis: { tooltip: true } },
  {
    title: 'Role',
    key: 'role',
    width: 120,
    render: (row) =>
      h(NTag, { type: row.role === UserRole.SUPER_ADMIN ? 'warning' : 'default', size: 'small' }, () => row.role),
  },
  {
    title: 'Active',
    key: 'isActive',
    width: 80,
    render: (row) =>
      h(NSwitch, {
        value: row.isActive ?? true,
        size: 'small',
        onUpdateValue: (val: boolean) => userStore.update(row.id, { isActive: val }),
      }),
  },
  {
    title: 'Joined',
    key: 'createdAt',
    width: 120,
    render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-',
  },
  {
    title: '',
    key: 'actions',
    width: 120,
    render: (row) => [
      h(NButton, { size: 'tiny', class: 'mr-1', onClick: () => openEditModal(row) }, () => 'Edit'),
      h(NButton, { size: 'tiny', type: 'error', onClick: () => userStore.delete(row.id) }, () => 'Delete'),
    ],
  },
]

const pagination = computed(() => ({
  page: userStore.page,
  pageSize: userStore.limit,
  itemCount: userStore.total,
  showSizePicker: false,
}))

onMounted(() => {
  userStore.fetch()
})

function openCreateModal() {
  editingUser.value = null
  formData.value = { name: '', email: '', password: '', role: UserRole.USER }
  showModal.value = true
}

function openEditModal(user: User) {
  editingUser.value = user
  formData.value = { name: user.name ?? '', email: user.email, password: '', role: user.role as UserRole }
  showModal.value = true
}

async function handleSave() {
  if (editingUser.value) {
    await userStore.update(editingUser.value.id, formData.value)
  } else {
    await userStore.create(formData.value)
  }
  showModal.value = false
}

function handleFilter() {
  userStore.fetch({ page: 1, role: roleFilter.value ?? undefined })
}

function handlePageChange(page: number) {
  userStore.fetch({ page, role: roleFilter.value ?? undefined })
}
</script>
