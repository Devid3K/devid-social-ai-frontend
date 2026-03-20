import axios from '@/plugins/axios'

// ─── Auth ─────────────────────────────────────────────────
const Auth = {
  Login: (data: { email: string; password: string }) => axios.post('/api/v1/auth/login', data),
  Logout: () => axios.post('/api/v1/auth/logout'),
  Profile: () => axios.get('/api/v1/auth/profile'),
  ChangePassword: (data: { oldPassword: string; newPassword: string }) =>
    axios.patch('/api/v1/auth/change-password', data),
}

// ─── Users ────────────────────────────────────────────────
const Users = {
  List: (params?: any) => axios.get('/api/v1/users', { params }),
  Create: (data: any) => axios.post('/api/v1/users', data),
  GetById: (id: number) => axios.get(`/api/v1/users/${id}`),
  Update: (id: number, data: any) => axios.patch(`/api/v1/users/${id}`, data),
  Delete: (id: number) => axios.delete(`/api/v1/users/${id}`),
}

// ─── Social Accounts ──────────────────────────────────────
const SocialAccounts = {
  List: (params?: any) => axios.get('/api/v1/social-accounts', { params }),
  Create: (data: any) => axios.post('/api/v1/social-accounts', data),
  Update: (id: number, data: any) => axios.patch(`/api/v1/social-accounts/${id}`, data),
  Delete: (id: number) => axios.delete(`/api/v1/social-accounts/${id}`),
  Sync: (id: number) => axios.post(`/api/v1/social-accounts/${id}/sync`),
  Analytics: (id: number, params?: any) =>
    axios.get(`/api/v1/social-accounts/${id}/analytics`, { params }),
}

// ─── AI Script ────────────────────────────────────────────
const AiScript = {
  Generate: (data: any) => axios.post('/api/v1/ai-script/generate', data),
  List: (params?: any) => axios.get('/api/v1/ai-script', { params }),
  GetById: (id: number) => axios.get(`/api/v1/ai-script/${id}`),
  Select: (id: number, data: { scriptIndex: number }) =>
    axios.post(`/api/v1/ai-script/${id}/select`, data),
  ViralScore: (id: number) => axios.post(`/api/v1/ai-script/${id}/viral-score`),
}

// ─── AI Video ─────────────────────────────────────────────
const AiVideo = {
  Styles: () => axios.get('/api/v1/ai-video/styles'),
  Generate: (data: any) => axios.post('/api/v1/ai-video/generate', data),
  Jobs: (params?: any) => axios.get('/api/v1/ai-video/jobs', { params }),
  GetJob: (id: number) => axios.get(`/api/v1/ai-video/jobs/${id}`),
  DeleteJob: (id: number) => axios.delete(`/api/v1/ai-video/jobs/${id}`),
}

// ─── Trends ───────────────────────────────────────────────
const Trends = {
  Analyze: (data: any) => axios.post('/api/v1/trends/analyze', data),
  Hashtags: (params?: any) => axios.get('/api/v1/trends/hashtags', { params }),
  Platform: (platform: string) => axios.get(`/api/v1/trends/platform/${platform}`),
  ViralScore: (data: any) => axios.post('/api/v1/trends/viral-score', data),
  TikTokProducts: (params?: any) => axios.get('/api/v1/trends/tiktok-products', { params }),
  ChannelFit: (accountId: number) => axios.get(`/api/v1/trends/channel-fit/${accountId}`),
}

// ─── Posts ────────────────────────────────────────────────
const Posts = {
  List: (params?: any) => axios.get('/api/v1/posts', { params }),
  Create: (data: any) => axios.post('/api/v1/posts', data),
  Update: (id: number, data: any) => axios.patch(`/api/v1/posts/${id}`, data),
  Delete: (id: number) => axios.delete(`/api/v1/posts/${id}`),
  Publish: (id: number) => axios.post(`/api/v1/posts/${id}/publish`),
  Schedule: (id: number, data: { scheduledAt: string }) =>
    axios.post(`/api/v1/posts/${id}/schedule`, data),
  Performance: (id: number) => axios.get(`/api/v1/posts/${id}/performance`),
}

// ─── Dashboard ────────────────────────────────────────────
const Dashboard = {
  Overview: () => axios.get('/api/v1/dashboard/overview'),
  Growth: (params?: any) => axios.get('/api/v1/dashboard/growth', { params }),
  Revenue: (params?: any) => axios.get('/api/v1/dashboard/revenue', { params }),
  AiSuggestions: () => axios.get('/api/v1/dashboard/ai-suggestions'),
  PlatformComparison: () => axios.get('/api/v1/dashboard/platform-comparison'),
}

// ─── Prompt History ───────────────────────────────────────
const PromptHistory = {
  List: (params?: any) => axios.get('/api/v1/prompt-history', { params }),
  GetById: (id: number) => axios.get(`/api/v1/prompt-history/${id}`),
  Delete: (id: number) => axios.delete(`/api/v1/prompt-history/${id}`),
  Stats: () => axios.get('/api/v1/prompt-history/stats'),
}

// ─── Finance ──────────────────────────────────────────────
const Finance = {
  Transactions: (params?: any) => axios.get('/api/v1/finance/transactions', { params }),
  CreateTransaction: (data: any) => axios.post('/api/v1/finance/transactions', data),
  UpdateTransaction: (id: number, data: any) =>
    axios.patch(`/api/v1/finance/transactions/${id}`, data),
  DeleteTransaction: (id: number) => axios.delete(`/api/v1/finance/transactions/${id}`),
  Summary: (params?: any) => axios.get('/api/v1/finance/summary', { params }),
  CalculateTax: (data: any) => axios.post('/api/v1/finance/tax-calculate', data),
  Export: (params?: any) =>
    axios.get('/api/v1/finance/export', { params, responseType: 'blob' }),
}

// ─── Notifications ────────────────────────────────────────
const Notifications = {
  List: () => axios.get('/api/v1/notifications'),
  MarkRead: (id: number) => axios.patch(`/api/v1/notifications/${id}/read`),
  MarkAllRead: () => axios.patch('/api/v1/notifications/read-all'),
  Delete: (id: number) => axios.delete(`/api/v1/notifications/${id}`),
}

export const ApiService = {
  v1: {
    Auth,
    Users,
    SocialAccounts,
    AiScript,
    AiVideo,
    Trends,
    Posts,
    Dashboard,
    PromptHistory,
    Finance,
    Notifications,
  },
}
