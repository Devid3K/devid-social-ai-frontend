import { createRouter, createWebHistory } from 'vue-router'
import { ROUTE_NAMES } from '@/constants/routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ─── Root redirect ───────────────────────────────────────────
    {
      path: '/',
      redirect: '/dashboard',
    },

    // ─── Auth (Blank layout) ───────────────────────────────────────
    {
      path: '/login',
      name: ROUTE_NAMES.LOGIN,
      component: () => import('@/views/Auth/Login.vue'),
      meta: { layout: 'Blank', auth: false },
    },
    {
      path: '/logout',
      name: ROUTE_NAMES.LOGOUT,
      component: () => import('@/views/Auth/Logout.vue'),
      meta: { layout: 'Blank', auth: false },
    },

    // ─── Authenticated routes ──────────────────────────────────────
    {
      path: '/dashboard',
      name: ROUTE_NAMES.DASHBOARD,
      component: () => import('@/views/Dashboard/index.vue'),
      meta: { auth: true },
    },
    {
      path: '/scripts',
      name: ROUTE_NAMES.SCRIPTS,
      component: () => import('@/views/ScriptGeneration/index.vue'),
      meta: { auth: true },
    },
    {
      path: '/videos',
      name: ROUTE_NAMES.VIDEOS,
      component: () => import('@/views/VideoGeneration/index.vue'),
      meta: { auth: true },
    },
    {
      path: '/trends',
      name: ROUTE_NAMES.TRENDS,
      component: () => import('@/views/TrendAnalysis/index.vue'),
      meta: { auth: true },
    },
    {
      path: '/posts',
      name: ROUTE_NAMES.POSTS,
      component: () => import('@/views/AutoPost/index.vue'),
      meta: { auth: true },
    },
    {
      path: '/posts/new',
      name: ROUTE_NAMES.NEW_POST,
      component: () => import('@/views/AutoPost/NewPost.vue'),
      meta: { auth: true },
    },
    {
      path: '/accounts',
      name: ROUTE_NAMES.ACCOUNTS,
      component: () => import('@/views/SocialAccounts/index.vue'),
      meta: { auth: true },
    },
    {
      path: '/prompt-history',
      name: ROUTE_NAMES.PROMPT_HISTORY,
      component: () => import('@/views/PromptHistory/index.vue'),
      meta: { auth: true },
    },
    {
      path: '/realtime',
      name: ROUTE_NAMES.REALTIME,
      component: () => import('@/views/Realtime/index.vue'),
      meta: { auth: true },
    },
    {
      path: '/tiktok-trends',
      name: ROUTE_NAMES.TIKTOK_TRENDS,
      component: () => import('@/views/TikTokTrends/index.vue'),
      meta: { auth: true },
    },
    {
      path: '/finance',
      name: ROUTE_NAMES.FINANCE,
      component: () => import('@/views/Finance/index.vue'),
      meta: { auth: true },
    },
    {
      path: '/finance/tax',
      name: ROUTE_NAMES.TAX_CALCULATOR,
      component: () => import('@/views/Finance/TaxCalculator.vue'),
      meta: { auth: true },
    },
    {
      path: '/users',
      name: ROUTE_NAMES.USERS,
      component: () => import('@/views/UserManagement/index.vue'),
      meta: { auth: true, roles: ['super_admin'] },
    },
    {
      path: '/profile',
      name: ROUTE_NAMES.PROFILE,
      component: () => import('@/views/Profile.vue'),
      meta: { auth: true },
    },

    // ─── 404 ──────────────────────────────────────────────────────
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'),
    },
  ],
})

// ─── Navigation Guard ──────────────────────────────────────────────
router.beforeEach((to, _from, next) => {
  const token = JSON.parse(localStorage.getItem('token') || 'null') as string | null

  // Protected route: no token → redirect to login
  if (to.meta.auth && !token) {
    return next({ name: ROUTE_NAMES.LOGIN })
  }

  // Already logged in and visiting login page → redirect to dashboard
  if (to.name === ROUTE_NAMES.LOGIN && token) {
    return next({ name: ROUTE_NAMES.DASHBOARD })
  }

  next()
})

export default router
