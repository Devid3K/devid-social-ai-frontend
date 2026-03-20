export interface User {
  id: number
  email: string
  name: string
  role: string
  isActive: boolean
  createdAt: string
}

export interface LoginResponse {
  token: string
  user: User
}
