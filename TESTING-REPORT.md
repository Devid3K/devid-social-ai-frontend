# Devid Social AI — Testing Report & Missing Items

> ทดสอบเมื่อ: 2026-03-23
> Backend: http://localhost:4000 | Frontend: http://localhost:3000

---

## สถานะ API Endpoints ทั้งหมด

| Module | Endpoint | Status | หมายเหตุ |
|---|---|---|---|
| **Auth** | POST `/auth/login` | ✅ ใช้ได้ | login สำเร็จ, return token + user |
| **Auth** | GET `/auth/profile` | ✅ ใช้ได้ | return user data |
| **Auth** | PATCH `/auth/change-password` | ✅ ใช้ได้ | — |
| **Dashboard** | GET `/dashboard/overview` | ✅ ใช้ได้ | return followers, views, revenue |
| **Dashboard** | GET `/dashboard/growth` | ✅ ใช้ได้ | return date-binned data |
| **Dashboard** | GET `/dashboard/revenue` | ✅ ใช้ได้ | return date-binned data |
| **Dashboard** | GET `/dashboard/ai-suggestions` | ✅ ใช้ได้ | hardcoded suggestions (ไม่ใช่ AI จริง) |
| **Dashboard** | GET `/dashboard/platform-comparison` | ✅ ใช้ได้ | — |
| **Script** | GET `/ai-script` | ✅ ใช้ได้ | list scripts |
| **Script** | POST `/ai-script/generate` | ❌ ต้องมี API key | ต้องใส่ GROQ_API_KEY หรือ GEMINI_API_KEY |
| **Script** | POST `/ai-script/:id/viral-score` | ❌ ต้องมี API key | ต้องใส่ GROQ_API_KEY |
| **Video** | GET `/ai-video/styles` | ✅ ใช้ได้ | return 7 styles |
| **Video** | GET `/ai-video/jobs` | ✅ ใช้ได้ | list video jobs |
| **Video** | POST `/ai-video/generate` | ❌ ต้องมี API key | ต้องใส่ KLING_API_KEY หรือ REPLICATE_API_TOKEN |
| **Trends** | GET `/trends/hashtags` | ✅ ใช้ได้ | Thai fallback data ทำงาน |
| **Trends** | GET `/trends/tiktok-products` | ✅ ใช้ได้ | Thai fallback data ทำงาน |
| **Trends** | POST `/trends/analyze` | ✅ ใช้ได้ (fallback) | ใช้ fallback data ถ้าไม่มี SERPAPI_KEY |
| **Posts** | GET `/posts` | ✅ ใช้ได้ | list posts |
| **Posts** | POST `/posts` | ✅ ใช้ได้ | create draft |
| **Posts** | POST `/posts/:id/publish` | ❌ ต้องมี API key | ต้องมี platform access token |
| **Posts** | POST `/posts/:id/schedule` | ✅ ใช้ได้ | BullMQ delayed job |
| **Social Accounts** | GET `/social-accounts` | ✅ ใช้ได้ | list accounts |
| **Social Accounts** | POST `/social-accounts/:id/sync` | ❌ ต้องมี API key | ต้องมี platform access token |
| **Prompt History** | GET `/prompt-history` | ✅ ใช้ได้ | — |
| **Prompt History** | GET `/prompt-history/stats` | ✅ ใช้ได้ | — |
| **Finance** | GET `/finance/transactions` | ✅ ใช้ได้ | — |
| **Finance** | GET `/finance/summary` | ✅ ใช้ได้ | — |
| **Finance** | POST `/finance/tax-calculate` | ✅ ใช้ได้ | DTO field: `grossIncome` (ไม่ใช่ annualIncome) |
| **Finance** | GET `/finance/export` | ✅ ใช้ได้ | CSV download |
| **Notifications** | GET `/notifications` | ✅ ใช้ได้ | — |
| **Users** | GET `/users` | ✅ ใช้ได้ | super_admin only |

---

## API Keys ที่ต้องใส่ (ทั้งหมดยังเป็น placeholder)

### จำเป็นต้องมี (Core Features จะพัง)

| Key | ใช้ทำอะไร | หาได้ที่ | Free Tier |
|---|---|---|---|
| `GROQ_API_KEY` | สร้างบทละคร AI (primary) | [console.groq.com](https://console.groq.com) → API Keys | ✅ ฟรี (rate limited) |
| `GEMINI_API_KEY` | สร้างบทละคร AI (fallback) | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) | ✅ ฟรี (15 RPM) |

### แนะนำให้มี (เสริม Features)

| Key | ใช้ทำอะไร | หาได้ที่ | Free Tier |
|---|---|---|---|
| `KLING_API_KEY` | สร้างวิดีโอ AI (primary) | [klingai.com](https://klingai.com) Developer Console | ❌ ต้องจ่าย |
| `REPLICATE_API_TOKEN` | สร้างวิดีโอ AI (fallback) | [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens) | ✅ ฟรี $5 credit |
| `SERPAPI_KEY` | Google Trends data | [serpapi.com/manage-api-key](https://serpapi.com/manage-api-key) | ✅ ฟรี 100 searches/เดือน |

### ต้องมีตอน Deploy จริง (Social Platform Posting)

| Key | ใช้ทำอะไร | หาได้ที่ | ข้อจำกัด |
|---|---|---|---|
| `FACEBOOK_APP_ID` | โพสต์ Facebook Reels | [developers.facebook.com](https://developers.facebook.com) → My Apps | ต้องผ่าน App Review |
| `FACEBOOK_APP_SECRET` | Facebook authentication | เดียวกับข้างบน (Settings → Basic) | — |
| `INSTAGRAM_CLIENT_ID` | โพสต์ Instagram Reels | Facebook App → Products → Instagram | ต้องผ่าน App Review |
| `INSTAGRAM_CLIENT_SECRET` | Instagram authentication | เดียวกับข้างบน | — |
| `YOUTUBE_API_KEY` | โพสต์ YouTube Shorts | [console.cloud.google.com](https://console.cloud.google.com) → YouTube Data API v3 | ต้อง OAuth consent screen |
| `TIKTOK_CLIENT_KEY` | โพสต์ TikTok | [developers.tiktok.com](https://developers.tiktok.com) → Manage Apps | ต้อง Content Posting API approval |
| `TIKTOK_CLIENT_SECRET` | TikTok authentication | เดียวกับข้างบน | — |
| `TIKTOK_API_KEY` | TikTok Research API (trends) | [developers.tiktok.com](https://developers.tiktok.com) → Research API | ต้องสมัคร Research API access |

---

## หน้า Frontend — สถานะ

| หน้า | Path | UI | Data | หมายเหตุ |
|---|---|---|---|---|
| Login | `/login` | ✅ | ✅ | login/redirect ทำงาน |
| Dashboard | `/dashboard` | ✅ | ✅ | overview, cards, charts (placeholder), ai-suggestions |
| Script Generation | `/scripts` | ✅ | ⚠️ | UI โหลดได้ แต่ generate ต้องมี Groq/Gemini key |
| Video Generation | `/videos` | ✅ | ⚠️ | style picker ทำงาน แต่ generate ต้องมี Kling/Replicate key |
| Trend Analysis | `/trends` | ✅ | ✅ | Thai fallback data ทำงานโดยไม่ต้องมี key |
| Auto Post | `/posts` | ✅ | ✅ | list/create/schedule ทำงาน, publish ต้องมี platform token |
| Social Accounts | `/accounts` | ✅ | ✅ | CRUD ทำงาน, sync ต้องมี platform token |
| Prompt History | `/prompt-history` | ✅ | ✅ | list + stats ทำงาน |
| TikTok Trends | `/tiktok-trends` | ✅ | ✅ | ใช้ fallback data |
| Finance | `/finance` | ✅ | ✅ | transactions, summary, chart ทำงาน |
| Tax Calculator | `/finance/tax` | ✅ | ✅ | คำนวณภาษีไทยขั้นบันได |
| Realtime | `/realtime` | ✅ | ✅ | Socket.IO connection + events |
| User Management | `/users` | ✅ | ✅ | super_admin only |
| Profile | `/profile` | ✅ | ✅ | ดูข้อมูลตัวเอง |

---

## Bugs ที่พบและแก้ไขแล้ว

| Bug | สาเหตุ | วิธีแก้ |
|---|---|---|
| Login error "Cannot read 'role'" | `resp.data` ได้ ResponseInterceptor wrapper ซ้อน | แก้ auth store: `resp.data?.data ?? resp.data` |
| เข้า `/` แล้ว 404 | ไม่มี route สำหรับ `/` | เพิ่ม `{ path: '/', redirect: '/dashboard' }` |
| Frontend 404 ทุก API call | ไม่มี `frontend/.env` → VITE_API_URL undefined | สร้าง `.env` ตั้ง VITE_API_URL |
| ResponseInterceptor ไม่ทำงาน | ไม่ได้ register globally ใน main.ts | เพิ่ม `app.useGlobalInterceptors()` |
| HttpExceptionFilter ไม่ทำงาน | ไม่ได้ register globally ใน main.ts | เพิ่ม `app.useGlobalFilters()` |

---

## สิ่งที่ยังขาด / TODO

### ระดับ Critical (ต้องทำก่อน production)

| Item | รายละเอียด |
|---|---|
| ❌ OAuth Flow | ยังไม่มี OAuth redirect flow สำหรับ Social Accounts — ต้องใส่ accessToken เองในฟอร์ม |
| ❌ Real API Keys | ทุก key ยังเป็น placeholder — ต้องสมัครและใส่ key จริง |
| ❌ HTTPS/SSL | nginx.conf ยังไม่มี SSL — ต้องเพิ่ม cert สำหรับ production |
| ❌ Rate Limiting | ไม่มี rate limit สำหรับ API endpoints |

### ระดับ Important (ควรทำ)

| Item | รายละเอียด |
|---|---|
| ⚠️ Dashboard Chart Library | Follower Growth + Revenue charts ยังเป็น placeholder (ไม่มี chart library) |
| ⚠️ AI Suggestions | Dashboard AI suggestions ยังเป็น hardcoded ไม่ได้ต่อ AI จริง |
| ⚠️ Email Verification | สมัครแล้วใช้ได้เลย ไม่มี email verify |
| ⚠️ Password Reset | ไม่มี forgot password flow |
| ⚠️ File Upload | รองรับแค่ AI-generated video ยังไม่มี manual upload |
| ⚠️ Analytics Sync Cron | QUEUE_NAMES.ANALYTICS_SYNC defined แต่ยังไม่มี processor |

### ระดับ Nice-to-have

| Item | รายละเอียด |
|---|---|
| 💡 CI/CD Pipeline | ไม่มี GitHub Actions config |
| 💡 Unit Tests | Jest setup แล้วแต่ test cases น้อย |
| 💡 E2E Tests | Playwright setup แล้วแต่ยังไม่มี test cases |
| 💡 Monitoring | ไม่มี centralized logging (ELK, CloudWatch) |
| 💡 MinIO Auto Bucket | ต้องสร้าง bucket `social-ai-media` เองผ่าน MinIO Console |

---

## Quick Start — ใส่ Key ขั้นต่ำเพื่อทดสอบ

แค่ใส่ 2 key นี้ใน `backend/.env` ก็ใช้ Script Generation ได้ทันที:

```bash
# 1. สมัคร Groq (ฟรี) → https://console.groq.com
GROQ_API_KEY=gsk_xxxxxxxxxxxxx

# 2. สมัคร Google AI Studio (ฟรี) → https://aistudio.google.com/apikey
GEMINI_API_KEY=AIzaxxxxxxxxxxxxxxxxx
```

เพิ่ม Replicate ก็ใช้ Video Generation ได้:

```bash
# 3. สมัคร Replicate (ฟรี $5) → https://replicate.com/account/api-tokens
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxx
```

เพิ่ม SerpAPI ก็ดู Google Trends จริงได้:

```bash
# 4. สมัคร SerpAPI (ฟรี 100/เดือน) → https://serpapi.com/manage-api-key
SERPAPI_KEY=xxxxxxxxxxxxx
```
