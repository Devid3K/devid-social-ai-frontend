import { defineStore, acceptHMRUpdate } from 'pinia'
import { ApiService } from '@/services/apiService'
import { UserRole } from '@/enums'
import type { User } from '@/types/auth.d'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    logged: false,
    role: null as UserRole | null,
    user: {} as User,
    token: null as string | null,
  }),

  getters: {
    isLogged: (state) => state.logged,
    isSuperAdmin: (state) => state.role === UserRole.SUPER_ADMIN,
  },

  actions: {
    async login(email: string, password: string) {
      try {
        const resp = await ApiService.v1.Auth.Login({ email, password })
        const { token, user } = resp.data

        this.logged = true
        this.token = token
        this.user = user
        this.role = user.role as UserRole

        localStorage.setItem('token', JSON.stringify(token))
        localStorage.setItem('user', JSON.stringify(user))
      } catch (error: any) {
        this.setLogout()
        throw error
      }
    },

    async logout() {
      try {
        await ApiService.v1.Auth.Logout()
      } catch {
        // Ignore logout API errors — always clear local state
      } finally {
        this.setLogout()
      }
    },

    setLogout() {
      this.logged = false
      this.role = null
      this.user = {} as User
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    initFromStorage() {
      const token = JSON.parse(localStorage.getItem('token') || 'null') as string | null
      const user = JSON.parse(localStorage.getItem('user') || 'null') as User | null

      if (token && user) {
        this.logged = true
        this.token = token
        this.user = user
        this.role = user.role as UserRole
      }
    },
  },

  persist: true,
})

if (import.meta.hot) {
  acceptHMRUpdate(useAuthStore, import.meta.hot)
}
