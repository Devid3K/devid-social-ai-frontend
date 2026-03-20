# devid-social-ai — Frontend

## Tech Stack
Vue 3 + TypeScript + Vite + Pinia + Naive UI + TailwindCSS + Vue Router + Axios

## กฏที่ต้องปฏิบัติตาม (MUST FOLLOW)
- CSS ใช้ Tailwind เท่านั้น — ห้ามเขียน CSS file ของตัวเอง
- API calls ใน Pinia store actions เท่านั้น — ห้ามเรียกใน component
- ห้าม hardcode ค่าใดๆ — ใช้ `import.meta.env.VITE_*` จาก `.env`
- ใช้ enum จาก `src/enums/` และ constants จาก `src/constants/` เสมอ
- ใช้ Naive UI เป็น UI library ตัวเดียว (ห้ามใช้ library อื่น)
- Responsive ทุกหน้า: sm (640px), md (768px), lg (1024px)
- ใช้ Pinia Options API pattern (ดูตัวอย่างใน stores/auth.ts)
- API service ใช้ pattern: `ApiService.v1.Module.Method()`

## Folder Conventions
- `src/enums/` — enum ทั้งหมด, re-export ผ่าน index.ts
- `src/constants/` — constants ทั้งหมด, re-export ผ่าน index.ts
- `src/stores/` — Pinia stores (Options API) เท่านั้น
- `src/services/apiService.ts` — API calls ทั้งหมด (ห้าม axios โดยตรงใน component/store อื่น)
- `src/components/` — แยก subdirectory ตาม feature
- `src/views/` — page components แยก subdirectory ตาม route

## Naming Conventions
- Components: kebab-case filename, PascalCase inside (e.g., `app-logo.vue`)
- Stores: camelCase (e.g., `useAuthStore`)
- Composables: camelCase, prefix `use` (e.g., `useNotifications.ts`)

## Reference Project
Pattern จาก: `/Users/devid3k/devid-project/oms-devid3k/`
- axios interceptors: `oms-devid3k/src/plugins/axios.js`
- store pattern: `oms-devid3k/src/stores/auth.ts`
- apiService pattern: `oms-devid3k/src/services/apiService.ts`
- router pattern: `oms-devid3k/src/router/index.ts`
