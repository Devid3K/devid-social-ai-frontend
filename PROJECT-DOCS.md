# Devid Social AI — Project Documentation

> Social Media AI Content Creation Platform
> สร้างคอนเทนต์ AI สำหรับ TikTok, Facebook Reel, Instagram Reel, YouTube Short

---

## สารบัญ

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features & Pages](#features--pages)
- [Data Flow](#data-flow)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running Development](#running-development)
- [Deployment](#deployment)
- [Known Gaps & TODOs](#known-gaps--todos)

---

## Overview

**devid-social-ai** คือแพลตฟอร์มสร้างคอนเทนต์ AI สำหรับขายของออนไลน์

**Flow หลัก:**
1. ใส่ข้อมูลสินค้า → AI สร้างบทละครไทย (Script Generation)
2. เลือกสไตล์วิดีโอ → AI สร้างวิดีโอ (Video Generation)
3. วิเคราะห์เทรนด์ → แนะนำ hashtag, เวลาโพสต์ (Trend Analysis)
4. โพสต์อัตโนมัติ → TikTok / Facebook Reel / IG Reel / YouTube Short (Auto-Post)
5. ติดตามยอดขาย / รายรับ-รายจ่าย (Finance)

**Theme:** Cool + Nature + Anime Cute (Indigo primary #6366F1)

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| NestJS + TypeScript | API Framework |
| Prisma ORM | Database ORM (MySQL 8.0) |
| Redis 7 | Cache + Queue backend |
| BullMQ | Job queues (video gen, scheduled posts) |
| Socket.IO | Realtime events |
| MinIO | Object storage (วิดีโอ, รูป) |
| Passport + JWT | Authentication |
| Swagger | API Documentation |

### Frontend
| Technology | Purpose |
|---|---|
| Vue 3 + TypeScript | SPA Framework |
| Vite 5 | Build tool |
| Pinia (Options API) | State management |
| Naive UI | UI Component library |
| TailwindCSS | Styling (ไม่ใช้ CSS files) |
| Axios | HTTP client |
| Socket.IO Client | Realtime updates |

### AI Providers
| Provider | Model | Role |
|---|---|---|
| Groq SDK | llama-3.3-70b-versatile | Script generation (primary) |
| Google Generative AI | gemini-1.5-flash | Script generation (fallback) |
| Kling AI | text2video / image2video | Video generation (primary) |
| Replicate | minimax/video-01 | Video generation (fallback) |
| SerpAPI | Google Trends | Trend data |
| TikTok Research API | Trending hashtags | Thai trend data |

### Infrastructure
| Service | Port | Purpose |
|---|---|---|
| Backend (NestJS) | 4000 | API Server |
| Frontend (Vite dev) | 3000 | Dev server |
| Frontend (Nginx prod) | 80 | Production |
| MySQL 8.0 | 8080 | Database |
| Redis 7 Alpine | 6379 | Queue + Cache |
| MinIO | 9000 / 9001 | Object Storage |

---

## Architecture

```
┌──────────────────────────────────────────────────┐
│                   Frontend (Vue 3)               │
│  Pinia Store → ApiService.v1.Module.Method()     │
│  Socket.IO Client ← realtime events             │
└────────────────────────┬─────────────────────────┘
                         │ HTTP + WebSocket
                         ▼
┌──────────────────────────────────────────────────┐
│              Backend (NestJS)                     │
│  /api/v1/* ── JWT Auth ── ResponseInterceptor    │
│                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ AiScript │  │ AiVideo  │  │ TrendAnalysis│   │
│  │ Groq     │  │ Kling    │  │ SerpAPI      │   │
│  │ Gemini   │  │ Replicate│  │ TikTok API   │   │
│  └──────────┘  └──────────┘  └──────────────┘   │
│                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ AutoPost │  │ Finance  │  │ Notifications│   │
│  │ TikTok   │  │ Tax calc │  │ Socket emit  │   │
│  │ Facebook │  │ CSV exp  │  │              │   │
│  │ Instagram│  └──────────┘  └──────────────┘   │
│  │ YouTube  │                                    │
│  └──────────┘                                    │
│       │                                          │
│  BullMQ Queue ◄── Redis                         │
│       │                                          │
│  Prisma ORM ◄── MySQL 8.0                       │
│  MinIO ◄── วิดีโอ / รูปภาพ                       │
└──────────────────────────────────────────────────┘
```

### Request/Response Flow

```
Client Request
  → Axios (Bearer token)
  → NestJS Global Prefix /api/v1
  → JwtAuthGuard (ตรวจ token)
  → Controller (@CurrentUser decorator ดึง userId)
  → Service (business logic)
  → Prisma (database)
  → ResponseInterceptor wraps { data, message, statusCode }
  → Client
```

### Error Flow

```
Exception thrown
  → HttpExceptionFilter catches
  → Returns { data: null, message, statusCode, path, timestamp }
  → Axios error interceptor shows Thai notification
  → 401 → auto redirect to /login
```

---

## Features & Pages

### 1. Authentication (`/login`, `/logout`)
- **Layout:** Blank (ไม่มี sidebar)
- **Flow:** Email + Password → JWT token → localStorage
- **Guard:** ทุกหน้าที่ `meta.auth: true` ต้อง login ก่อน
- **Logout:** Clear localStorage → redirect `/login`

### 2. Dashboard (`/dashboard`)
- **Overview:** ยอด followers รวม, views, revenue, จำนวน platform
- **Growth chart:** กราฟ follower growth (7d / 30d / 90d)
- **Revenue chart:** กราฟรายได้ (income - expense)
- **AI Suggestions:** คำแนะนำจาก AI (content, timing, trend, engagement, monetization)
- **Platform comparison:** เปรียบเทียบ metrics ทุก platform
- **API:** `GET /dashboard/overview`, `/growth`, `/revenue`, `/ai-suggestions`, `/platform-comparison`

### 3. Script Generation (`/scripts`)
- **Input:** ชื่อสินค้า, คำอธิบาย, กลุ่มเป้าหมาย, platform, จำนวน (1-5), โทน, ความยาว (15-180 วินาที)
- **AI Process:** Groq (primary) → Gemini (fallback) → สร้างบทละครไทยแบบ drama hook-first
- **Output:** ScriptVariant[] — title, content, hooks, hashtags ต่อ variant
- **Viral Score:** วิเคราะห์คะแนน viral พร้อม breakdown (hook, emotion, trend, CTA, uniqueness)
- **Storage:** บันทึก AiScript + PromptHistory
- **API:** `POST /ai-scripts/generate`, `GET /ai-scripts`, `PATCH /ai-scripts/:id/select`, `POST /ai-scripts/:id/viral-score`

### 4. Video Generation (`/videos`)
- **Input:** prompt, provider (kling/replicate), style (anime/realistic/drama/kawaii/cinematic/nature/dark), duration (3-30s), aspect ratio
- **Queue:** BullMQ job → Kling API (primary) → Replicate (fallback)
- **Progress:** poll ทุก 5 วินาที, Socket.IO emit `video:progress`, `video:complete`, `video:failed`
- **Storage:** VideoJob record + MinIO สำหรับไฟล์วิดีโอ
- **API:** `POST /ai-videos/generate`, `GET /ai-videos`, `GET /ai-videos/:id`, `GET /ai-videos/styles`

### 5. Trend Analysis (`/trends`)
- **Sources:** SerpAPI (Google Trends) + TikTok Research API
- **Thai Fallback:** ถ้าไม่มี TikTok API key → ใช้ curated Thai hashtag data (15 hashtags, 8 products)
- **Viral Score:** base 50 + Google signal (+20) + hashtag engagement (+20) + platform bonus (+5)
- **AI Interpretation:** ส่งข้อมูลเทรนด์ให้ Groq วิเคราะห์เป็นภาษาไทย
- **API:** `POST /trends/analyze`, `GET /trends/hashtags`, `GET /trends/platform/:platform`, `POST /trends/viral-score`, `GET /trends/tiktok-products`, `GET /trends/channel-fit/:accountId`

### 6. Auto-Post (`/posts`, `/posts/new`)
- **Create:** เลือก social account, platform, caption, hashtags, link video job
- **Publish:** ส่งวิดีโอไปยัง platform ที่เลือกทันที
- **Schedule:** ตั้งเวลาโพสต์ล่วงหน้า → BullMQ delayed job
- **Platforms:**
  - **TikTok** — Content Posting API (video URL → upload → publish)
  - **Facebook** — Reels API (3-step: init upload → upload video → publish)
  - **Instagram** — Container API (create container → poll status → media_publish)
  - **YouTube** — Resumable Upload API (categoryId: 22 People & Blogs, privacyStatus: public)
- **Performance:** ดึงยอด views, likes, shares, comments จาก platform API
- **API:** `GET /posts`, `POST /posts`, `PATCH /posts/:id`, `DELETE /posts/:id`, `POST /posts/:id/publish`, `POST /posts/:id/schedule`, `GET /posts/:id/performance`

### 7. Social Accounts (`/accounts`)
- **CRUD:** เพิ่ม/แก้ไข/ลบ social account (TikTok, Facebook, Instagram, YouTube)
- **Sync:** ดึง follower count, metadata จาก platform
- **Analytics:** ดึงข้อมูล analytics snapshots
- **API:** `GET /social-accounts`, `POST /social-accounts`, `PATCH /social-accounts/:id`, `DELETE /social-accounts/:id`, `POST /social-accounts/:id/sync`

### 8. Prompt History (`/prompt-history`)
- **Modules:** script, video, post — กรองตาม module ได้
- **Stats:** จำนวนรวม, แยกตาม module, 7 วันล่าสุด, top 5 performers
- **Auto-log:** ทุกครั้งที่สร้าง script/video/post จะบันทึก prompt + response อัตโนมัติ
- **API:** `GET /prompt-history`, `GET /prompt-history/stats`, `GET /prompt-history/:id`, `DELETE /prompt-history/:id`

### 9. Finance (`/finance`, `/finance/tax`)
- **Transactions:** รายรับ-รายจ่าย (income, expense, commission, withdrawal, transfer)
- **Summary:** สรุปรวม income / expense / commission / net profit
- **Tax Calculator:** คำนวณภาษีไทยแบบขั้นบันได (8 ขั้น, 0-35%)
- **CSV Export:** ส่งออก transactions เป็น CSV
- **API:** `GET /finance/transactions`, `POST /finance/transactions`, `GET /finance/summary`, `POST /finance/tax-calculate`, `GET /finance/export`

### 10. TikTok Trends (`/tiktok-trends`)
- **Dedicated page** สำหรับดู TikTok trending products, hashtags
- **ใช้ข้อมูลจาก Trend Analysis module**

### 11. Realtime (`/realtime`)
- **Socket.IO namespace:** `/realtime`
- **Events:** video:progress, video:complete, video:failed, notification:new
- **Presence:** join-room, leave-room, online user count
- **Heartbeat:** ping/pong

### 12. Notifications (bell icon ที่ header)
- **Types:** video_complete, post_published, trend_alert, system
- **Realtime:** Socket.IO emit ทันทีเมื่อมี notification ใหม่
- **API:** `GET /notifications`, `PATCH /notifications/:id/read`, `PATCH /notifications/read-all`, `DELETE /notifications/:id`

### 13. User Management (`/users`) — super_admin only
- **CRUD:** สร้าง/แก้ไข/ลบ user (เฉพาะ super_admin)
- **Role guard:** `meta.roles: ['super_admin']`

### 14. Profile (`/profile`)
- **แก้ไขข้อมูลส่วนตัว** ชื่อ, email, avatar

---

## Data Flow

### Script → Video → Post Flow

```
[1] User กรอกข้อมูลสินค้า
     │
     ▼
[2] POST /ai-scripts/generate
     │  Groq AI สร้างบทละคร (fallback: Gemini)
     │  บันทึก AiScript + PromptHistory
     ▼
[3] User เลือก script variant ที่ชอบ
     │  PATCH /ai-scripts/:id/select
     ▼
[4] POST /ai-videos/generate
     │  BullMQ job → Kling AI (fallback: Replicate)
     │  Socket.IO emit video:progress (30%→90%)
     │  บันทึก VideoJob + PromptHistory
     ▼
[5] Video complete → video:complete event
     │  วิดีโอพร้อมใช้งาน
     ▼
[6] POST /posts (สร้าง draft, link videoJobId)
     │
     ├──→ POST /posts/:id/publish   (โพสต์ทันที)
     │    Platform API → platformPostId
     │
     └──→ POST /posts/:id/schedule  (ตั้งเวลา)
          BullMQ delayed job → publish เมื่อถึงเวลา
```

### Finance Flow

```
Post published → track viewCount/likeCount/etc.
     │
     ▼
User บันทึก income/expense/commission
     │  POST /finance/transactions
     ▼
Dashboard revenue chart ← GET /finance/summary
     │
     ▼
Tax calculator ← POST /finance/tax-calculate
     │  ภาษีขั้นบันได (0%, 5%, 10%, 15%, 20%, 25%, 30%, 35%)
     ▼
CSV export ← GET /finance/export
```

---

## Database Schema

### Enums

```prisma
enum UserRole       { super_admin, user }
enum Platform       { tiktok, facebook, instagram, youtube }
enum VideoJobStatus { queued, processing, completed, failed }
enum PostStatus     { draft, scheduled, published, failed }
enum TransactionType { income, expense, commission, withdrawal, transfer }
enum NotificationType { video_complete, post_published, trend_alert, system }
```

### Models (14 ตาราง)

| Model | Key Fields | Relations |
|---|---|---|
| **User** | email, passwordHash, displayName, role, avatarUrl | → SocialAccount[], AiScript[], VideoJob[], Post[], Transaction[], Notification[] |
| **SocialAccount** | userId, platform, accountId, accountName, accessToken, refreshToken, followerCount | → User, AnalyticsSnapshot[], Post[], Transaction[] |
| **AnalyticsSnapshot** | socialAccountId, followerCount, viewCount, likeCount, engagementRate, snapshotDate | → SocialAccount |
| **Product** | userId, name, description, targetAudience, category, price | → User |
| **AiScript** | userId, productId, prompt, generatedScripts (JSON), selectedIndex, viralScore, platform | → User, VideoJob[], PromptHistory[] |
| **VideoJob** | userId, aiScriptId, prompt, provider, status, videoUrl, thumbnailUrl, progress, styleTemplate, duration, externalJobId | → User, AiScript, Post[], PromptHistory[] |
| **Post** | userId, socialAccountId, videoJobId, platform, caption, hashtags (JSON), status, scheduledAt, publishedAt, platformPostId, viewCount, likeCount, shareCount, commentCount, revenue, errorMessage | → User, SocialAccount, VideoJob |
| **PromptHistory** | userId, module, prompt, response (JSON), aiScriptId, videoJobId, engagementScore | → User, AiScript, VideoJob |
| **TrendSnapshot** | userId, platform, keywords (JSON), hashtags (JSON), viralScore, data (JSON) | → User |
| **Transaction** | userId, socialAccountId, type, amount, currency, description, transactionDate, metadata (JSON) | → User, SocialAccount |
| **Notification** | userId, type, title, message, data (JSON), readAt | → User |
| **AutoPostTemplate** | userId, name, platform, templatePattern (JSON), metadata (JSON) | → User |

---

## API Endpoints

### Auth (`/api/v1/auth`)
| Method | Path | Description |
|---|---|---|
| POST | `/auth/register` | สมัครสมาชิก |
| POST | `/auth/login` | เข้าสู่ระบบ → JWT token |
| GET | `/auth/profile` | ดูข้อมูลตัวเอง |

### Dashboard (`/api/v1/dashboard`)
| Method | Path | Description |
|---|---|---|
| GET | `/dashboard/overview` | ภาพรวม followers, views, revenue |
| GET | `/dashboard/growth?period=7d` | กราฟ follower growth |
| GET | `/dashboard/revenue?period=30d` | กราฟรายได้ |
| GET | `/dashboard/ai-suggestions` | AI คำแนะนำ |
| GET | `/dashboard/platform-comparison` | เปรียบเทียบ platform |

### AI Scripts (`/api/v1/ai-scripts`)
| Method | Path | Description |
|---|---|---|
| POST | `/ai-scripts/generate` | สร้างบทละคร AI |
| GET | `/ai-scripts` | รายการ scripts |
| GET | `/ai-scripts/:id` | ดู script |
| PATCH | `/ai-scripts/:id/select` | เลือก variant |
| POST | `/ai-scripts/:id/viral-score` | วิเคราะห์ viral score |
| DELETE | `/ai-scripts/:id` | ลบ script |

### AI Videos (`/api/v1/ai-videos`)
| Method | Path | Description |
|---|---|---|
| POST | `/ai-videos/generate` | สร้างวิดีโอ AI |
| GET | `/ai-videos` | รายการ video jobs |
| GET | `/ai-videos/:id` | ดู video job |
| GET | `/ai-videos/styles` | ดู styles ทั้งหมด |
| DELETE | `/ai-videos/:id` | ลบ video job |

### Trends (`/api/v1/trends`)
| Method | Path | Description |
|---|---|---|
| POST | `/trends/analyze` | วิเคราะห์เทรนด์ |
| GET | `/trends/hashtags?platform=tiktok` | ดู hashtags |
| GET | `/trends/platform/:platform` | เทรนด์ตาม platform |
| POST | `/trends/viral-score` | คำนวณ viral score |
| GET | `/trends/tiktok-products` | สินค้า TikTok trending |
| GET | `/trends/channel-fit/:accountId` | วิเคราะห์ channel fit |

### Posts (`/api/v1/posts`)
| Method | Path | Description |
|---|---|---|
| GET | `/posts?status=draft` | รายการ posts (filter by status) |
| POST | `/posts` | สร้าง post draft |
| PATCH | `/posts/:id` | แก้ไข post |
| DELETE | `/posts/:id` | ลบ post |
| POST | `/posts/:id/publish` | โพสต์ทันที |
| POST | `/posts/:id/schedule` | ตั้งเวลาโพสต์ |
| GET | `/posts/:id/performance` | ดูยอด views/likes/shares |

### Social Accounts (`/api/v1/social-accounts`)
| Method | Path | Description |
|---|---|---|
| GET | `/social-accounts` | รายการ accounts |
| POST | `/social-accounts` | เพิ่ม account |
| PATCH | `/social-accounts/:id` | แก้ไข |
| DELETE | `/social-accounts/:id` | ลบ |
| POST | `/social-accounts/:id/sync` | sync ข้อมูลจาก platform |

### Finance (`/api/v1/finance`)
| Method | Path | Description |
|---|---|---|
| GET | `/finance/transactions` | รายการธุรกรรม |
| POST | `/finance/transactions` | สร้างธุรกรรม |
| PATCH | `/finance/transactions/:id` | แก้ไข |
| DELETE | `/finance/transactions/:id` | ลบ |
| GET | `/finance/summary` | สรุปรายรับ-จ่าย |
| POST | `/finance/tax-calculate` | คำนวณภาษี |
| GET | `/finance/export` | ส่งออก CSV |

### Notifications (`/api/v1/notifications`)
| Method | Path | Description |
|---|---|---|
| GET | `/notifications` | รายการ notifications |
| PATCH | `/notifications/:id/read` | mark as read |
| PATCH | `/notifications/read-all` | mark all read |
| DELETE | `/notifications/:id` | ลบ |

### Prompt History (`/api/v1/prompt-history`)
| Method | Path | Description |
|---|---|---|
| GET | `/prompt-history?module=script` | รายการ (filter by module) |
| GET | `/prompt-history/stats` | สถิติ |
| GET | `/prompt-history/:id` | ดูรายละเอียด |
| DELETE | `/prompt-history/:id` | ลบ |

### Users (`/api/v1/users`) — super_admin only
| Method | Path | Description |
|---|---|---|
| GET | `/users` | รายการ users |
| GET | `/users/:id` | ดู user |
| POST | `/users` | สร้าง user |
| PATCH | `/users/:id` | แก้ไข user |
| DELETE | `/users/:id` | ลบ user |

**Swagger Docs:** `http://localhost:4000/api/docs`

---

## Environment Variables

### Backend (`backend/.env`)

#### App
| Variable | ตัวอย่าง | คำอธิบาย | หาได้ที่ |
|---|---|---|---|
| `PORT` | `4000` | Server port | ตั้งเอง |
| `NODE_ENV` | `development` | Environment | ตั้งเอง |

#### Database
| Variable | ตัวอย่าง | คำอธิบาย | หาได้ที่ |
|---|---|---|---|
| `DATABASE_URL` | `mysql://root:password@localhost:8080/social_ai_db` | MySQL connection string | ตั้งเอง / Docker Compose |
| `MYSQL_ROOT_PASSWORD` | `rootpassword` | MySQL root password | ตั้งเอง |
| `MYSQL_DATABASE` | `social_ai_db` | Database name | ตั้งเอง |
| `MYSQL_USER` | `social_ai_user` | MySQL user | ตั้งเอง |
| `MYSQL_PASSWORD` | `password` | MySQL password | ตั้งเอง |

#### Redis
| Variable | ตัวอย่าง | คำอธิบาย | หาได้ที่ |
|---|---|---|---|
| `REDIS_URL` | `redis://localhost:6379` | Redis connection URL | ตั้งเอง / Docker Compose |

#### JWT
| Variable | ตัวอย่าง | คำอธิบาย | หาได้ที่ |
|---|---|---|---|
| `JWT_SECRET` | `your-super-secret-key` | JWT signing secret | สุ่มเอง (ใช้ `openssl rand -hex 32`) |
| `JWT_EXPIRY` | `7d` | Token expiration | ตั้งเอง |

#### MinIO (Object Storage)
| Variable | ตัวอย่าง | คำอธิบาย | หาได้ที่ |
|---|---|---|---|
| `MINIO_ENDPOINT` | `localhost` | MinIO server host | Docker Compose |
| `MINIO_PORT` | `9000` | MinIO API port | Docker Compose |
| `MINIO_ACCESS_KEY` | `minioadmin` | MinIO access key | Docker Compose / MinIO Console |
| `MINIO_SECRET_KEY` | `minioadmin` | MinIO secret key | Docker Compose / MinIO Console |
| `MINIO_BUCKET` | `social-ai-media` | Bucket name | ตั้งเอง |
| `MINIO_USE_SSL` | `false` | SSL mode | ตั้งเอง |

#### AI — Script Generation
| Variable | ตัวอย่าง | คำอธิบาย | หาได้ที่ |
|---|---|---|---|
| `GROQ_API_KEY` | `gsk_xxx...` | Groq API key (LLaMA 3.3) | [console.groq.com](https://console.groq.com) → API Keys |
| `GEMINI_API_KEY` | `AIza...` | Google Gemini API key | [aistudio.google.com](https://aistudio.google.com/apikey) → Get API Key |

#### AI — Video Generation
| Variable | ตัวอย่าง | คำอธิบาย | หาได้ที่ |
|---|---|---|---|
| `KLING_API_KEY` | `xxx...` | Kling AI API key | [klingai.com](https://klingai.com) → Developer Console |
| `REPLICATE_API_TOKEN` | `r8_xxx...` | Replicate API token | [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens) |

#### Trend APIs
| Variable | ตัวอย่าง | คำอธิบาย | หาได้ที่ |
|---|---|---|---|
| `SERPAPI_KEY` | `xxx...` | SerpAPI key (Google Trends) | [serpapi.com/manage-api-key](https://serpapi.com/manage-api-key) |
| `TIKTOK_API_KEY` | `xxx...` | TikTok Research API key | [developers.tiktok.com](https://developers.tiktok.com) → Research API |

#### Social Platform APIs
| Variable | ตัวอย่าง | คำอธิบาย | หาได้ที่ |
|---|---|---|---|
| `FACEBOOK_APP_ID` | `123456789` | Facebook App ID | [developers.facebook.com](https://developers.facebook.com) → My Apps → Settings |
| `FACEBOOK_APP_SECRET` | `abc123...` | Facebook App Secret | เดียวกับ App ID (Settings → Basic) |
| `INSTAGRAM_CLIENT_ID` | `123456789` | Instagram Client ID | Facebook App → Products → Instagram Basic Display |
| `INSTAGRAM_CLIENT_SECRET` | `abc123...` | Instagram Client Secret | เดียวกับ Client ID |
| `YOUTUBE_API_KEY` | `AIza...` | YouTube Data API v3 key | [console.cloud.google.com](https://console.cloud.google.com) → APIs → YouTube Data API v3 |
| `TIKTOK_CLIENT_KEY` | `xxx...` | TikTok for Developers client key | [developers.tiktok.com](https://developers.tiktok.com) → Manage Apps |
| `TIKTOK_CLIENT_SECRET` | `xxx...` | TikTok client secret | เดียวกับ Client Key |

### Frontend (`frontend/.env`)

| Variable | ตัวอย่าง | คำอธิบาย |
|---|---|---|
| `VITE_API_URL` | `http://localhost:4000` | Backend API URL |
| `VITE_SOCKET_URL` | `http://localhost:4000` | Socket.IO URL |
| `VITE_APP_NAME` | `devid-social-ai` | App name |
| `VITE_APP_VERSION` | `1.0.0` | App version |

---

## Installation

### Prerequisites

- **Node.js** 20+
- **MySQL** 8.0 (หรือใช้ Docker)
- **Redis** 7+ (หรือใช้ Docker)
- **MinIO** (หรือใช้ Docker)

### 1. Clone & Install

```bash
git clone <repo-url> devid-social-ai
cd devid-social-ai

# Backend
cd backend
cp .env.example .env    # แก้ไข .env ใส่ API keys
npm install

# Frontend
cd ../frontend
cp .env.example .env    # แก้ไข .env ถ้าจำเป็น
npm install
```

### 2. Start Infrastructure (Docker)

```bash
cd backend
docker compose up -d mysql redis minio
```

รอ MySQL healthy (~10 วินาที), จากนั้น:

```bash
# สร้าง database schema
npx prisma migrate deploy
# หรือ dev mode:
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# (Optional) Seed data
npx prisma db seed
```

### 3. MinIO Setup

เข้า MinIO Console: `http://localhost:9001`
- Login: minioadmin / minioadmin
- สร้าง bucket ชื่อ `social-ai-media`

---

## Running Development

### Backend

```bash
cd backend
npm run start:dev
# Server: http://localhost:4000
# Swagger: http://localhost:4000/api/docs
```

### Frontend

```bash
cd frontend
npm run dev
# Dev server: http://localhost:3000
```

### ทั้งคู่พร้อมกัน

เปิด 2 terminal:
```bash
# Terminal 1
cd backend && npm run start:dev

# Terminal 2
cd frontend && npm run dev
```

---

## Deployment

### Docker Compose (Production)

```bash
# Build & run ทุก service
cd backend
docker compose up -d --build

# Frontend (แยก compose)
cd ../frontend
docker compose up -d --build
```

### Production Architecture

```
Internet
  │
  ▼
Nginx (port 80)
  ├── / → Vue SPA (static files)
  ├── /api → Proxy to NestJS (port 4000)
  └── /socket.io → Proxy WebSocket to NestJS
         │
         ▼
    NestJS Backend (port 4000)
         │
    ┌────┼────┐
    │    │    │
  MySQL Redis MinIO
```

### Multi-stage Dockerfiles

**Backend Dockerfile:**
- `development` → npm start:dev (hot reload)
- `builder` → npm run build + prisma generate
- `production` → node dist/main (optimized)

**Frontend Dockerfile:**
- `development` → npm run dev --host (Vite)
- `builder` → npm run build-only
- `production` → nginx:alpine serve static

### Environment ที่ต้องตั้งใน Production

```bash
# ต้องเปลี่ยนจาก default:
JWT_SECRET=<random-64-char-hex>
MYSQL_ROOT_PASSWORD=<strong-password>
MYSQL_PASSWORD=<strong-password>
MINIO_ACCESS_KEY=<strong-key>
MINIO_SECRET_KEY=<strong-key>

# ต้องใส่ API keys จริง:
GROQ_API_KEY=gsk_xxx
GEMINI_API_KEY=AIza_xxx
KLING_API_KEY=xxx
REPLICATE_API_TOKEN=r8_xxx
SERPAPI_KEY=xxx
FACEBOOK_APP_ID=xxx
FACEBOOK_APP_SECRET=xxx
INSTAGRAM_CLIENT_ID=xxx
INSTAGRAM_CLIENT_SECRET=xxx
YOUTUBE_API_KEY=xxx
TIKTOK_CLIENT_KEY=xxx
TIKTOK_CLIENT_SECRET=xxx
```

---

## Known Gaps & TODOs

### ยังไม่ได้ทำ / ยังไม่สมบูรณ์

| Item | Status | หมายเหตุ |
|---|---|---|
| OAuth flow สำหรับ Social Accounts | ขาด | ตอนนี้ต้องใส่ accessToken เอง, ยังไม่มี OAuth redirect flow |
| TikTok Content Posting API approval | ขาด | ต้องสมัคร TikTok for Developers + ขอ approval สำหรับ Content Posting API |
| Facebook/Instagram App Review | ขาด | ต้องผ่าน App Review สำหรับ `publish_video`, `instagram_content_publish` permissions |
| YouTube OAuth 2.0 consent screen | ขาด | ต้องตั้ง OAuth consent screen ใน Google Cloud Console |
| Real API keys ใน .env | ขาด | ทุก AI/Platform API ใช้ placeholder, ต้องใส่ key จริง |
| MinIO bucket auto-creation | ขาด | ต้องสร้าง bucket `social-ai-media` เองผ่าน MinIO Console |
| Rate limiting | ขาด | ยังไม่มี rate limit สำหรับ API endpoints |
| Email verification | ขาด | สมัครแล้วใช้ได้เลย ไม่มี email verify |
| Password reset flow | ขาด | ไม่มี forgot password |
| File upload (custom video) | ขาด | รองรับแค่ AI-generated video, ยังไม่มี manual upload |
| CI/CD pipeline | ขาด | ไม่มี GitHub Actions / CI/CD config |
| Unit tests | บางส่วน | Jest setup แล้วแต่ test cases ยังน้อย |
| E2E tests | ขาด | Playwright setup แล้วแต่ยังไม่มี test cases |
| Monitoring & logging | ขาด | ไม่มี centralized logging (e.g., ELK, CloudWatch) |
| HTTPS / SSL | ขาด | Nginx config เป็น HTTP only, ต้องเพิ่ม SSL cert |
| Cron job: analytics sync | ขาด | QUEUE_NAMES.ANALYTICS_SYNC defined แต่ยังไม่มี processor |
| Dashboard AI suggestions | mock | ใช้ hardcoded suggestions, ยังไม่ได้ต่อ AI จริง |
