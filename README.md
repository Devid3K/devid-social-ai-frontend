# devid-social-ai Frontend

ระบบ Social Media AI Content Creation Platform ฝั่ง Frontend
สร้างด้วย Vue 3 + TypeScript + Vite + Pinia + Naive UI + TailwindCSS

## เกี่ยวกับโปรเจค

ช่วยให้ creator ใส่ข้อมูลสินค้า → AI สร้างบทละครสั้น → เลือกรูปแบบวิดีโอ → สร้างวิดีโอ → โพสต์อัตโนมัติพร้อม hashtag บน TikTok, Facebook Reel, Instagram Reel, YouTube Short

## Tech Stack

| Layer | เทคโนโลยี |
|-------|----------|
| Framework | Vue 3 + TypeScript |
| Build Tool | Vite |
| State Management | Pinia |
| UI Library | Naive UI |
| Styling | TailwindCSS |
| HTTP Client | Axios |
| Realtime | Socket.IO Client |
| Router | Vue Router 4 |
| Data Fetching | TanStack Query |
| Date | Moment.js |

## การติดตั้ง (Development)

```bash
# 1. คัดลอก environment file
cp .env.example .env

# 2. ติดตั้ง dependencies
npm install

# 3. Start development server
npm run dev
```

เปิดที่ http://localhost:5173

## การรันด้วย Docker

```bash
# Development (hot reload)
docker compose -f docker-compose.dev.yml up

# Production (Nginx)
docker compose up

# หยุด
docker compose down
```

## โครงสร้างโฟลเดอร์

```
src/
├── app-layouts/         # Layout components
│   ├── Blank/           # Layout ว่างเปล่า (สำหรับ Login)
│   ├── VerticalNav/     # Layout หลัก (sidebar + header)
│   └── common/          # Shared layout components
├── assets/              # รูปภาพ, ไอคอน
├── components/          # Reusable components แยกตาม feature
│   ├── common/          # ใช้ทั่วไป
│   ├── dashboard/       # Dashboard components
│   ├── script/          # Script generation components
│   ├── video/           # Video generation components
│   ├── trend/           # Trend analysis components
│   ├── post/            # Auto-post components
│   └── finance/         # Finance components
├── composables/         # Vue composables (useXxx)
├── constants/           # ค่าคงที่ทั้งหมด (re-export ผ่าน index.ts)
├── enums/               # Enum ทั้งหมด (re-export ผ่าน index.ts)
├── plugins/             # Axios, Naive UI, Socket.IO setup
├── router/              # Vue Router + route guards
├── services/            # ApiService — HTTP calls ทั้งหมด
├── stores/              # Pinia stores (Options API)
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── views/               # Page components แยกตาม route
    ├── Auth/            # Login, Logout
    ├── Dashboard/       # Dashboard หลัก
    ├── ScriptGeneration/ # AI Script Gen
    ├── VideoGeneration/ # AI Video Gen
    ├── TrendAnalysis/   # Trend Analysis
    ├── AutoPost/        # Auto Post + New Post
    ├── SocialAccounts/  # Manage social accounts
    ├── PromptHistory/   # Prompt history log
    ├── Realtime/        # Live metrics
    ├── TikTokTrends/    # TikTok trending products
    ├── Finance/         # Finance + Tax Calculator
    └── UserManagement/  # User CRUD (super_admin)
```

## Pages & Routes

| Route | หน้า | คำอธิบาย |
|-------|------|---------|
| `/login` | Auth/Login | เข้าสู่ระบบ |
| `/dashboard` | Dashboard | ภาพรวม analytics ทุก platform |
| `/scripts` | ScriptGeneration | ใส่ข้อมูลสินค้า → AI gen บท |
| `/videos` | VideoGeneration | เลือก style → gen video |
| `/trends` | TrendAnalysis | วิเคราะห์ trend + hashtag |
| `/posts` | AutoPost | รายการโพสต์ทั้งหมด |
| `/posts/new` | AutoPost/NewPost | สร้างโพสต์ใหม่ |
| `/accounts` | SocialAccounts | จัดการ social accounts |
| `/prompt-history` | PromptHistory | ประวัติ prompt + ผลลัพธ์ |
| `/realtime` | Realtime | live metrics |
| `/tiktok-trends` | TikTokTrends | สินค้า trending บน TikTok |
| `/finance` | Finance | รายได้/ค่าใช้จ่าย |
| `/finance/tax` | Finance/TaxCalculator | คำนวณภาษี |
| `/users` | UserManagement | จัดการ users (super_admin) |
| `/profile` | Profile | โปรไฟล์ผู้ใช้ |

## Environment Variables

| ตัวแปร | คำอธิบาย | ค่าตัวอย่าง |
|--------|---------|------------|
| `VITE_API_URL` | URL ของ Backend API | `http://localhost:3000` |
| `VITE_SOCKET_URL` | URL สำหรับ Socket.IO | `http://localhost:3000` |
| `VITE_APP_NAME` | ชื่อแอป | `devid-social-ai` |
| `VITE_APP_VERSION` | เวอร์ชันแอป | `1.0.0` |

## Scripts

| คำสั่ง | คำอธิบาย |
|--------|---------|
| `npm run dev` | รัน development server |
| `npm run build` | Build สำหรับ production |
| `npm run preview` | Preview production build |
| `npm run type-check` | ตรวจ TypeScript types |
| `npm run lint` | Lint + fix code |
