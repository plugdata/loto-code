# API Documentation - Loto Key System

> Base URL: `http://localhost:3001/api`
> Auth: JWT Cookie (httpOnly) — ส่ง `credentials: 'include'` ทุก request
> Response Format: `{ success: true, data: {...} }` หรือ `{ success: false, message: "error" }`

---

## สรุปการใช้งาน API ในแต่ละหน้า (src/pages)

| หน้า | ไฟล์จริง | API ที่ใช้ |
|------|----------|-----------|
| **loginPage** | `components/login/loginHandlers.js` | `auth.login` |
| **registerPage** | `components/register/registerHandlers.js` | `auth.register` |
| **keyPage** | `components/key/keyPage.js`, `keyHandlers.js` | `lotteryTypes.check`, `transactions.get`, `customers.get`, `settings.get`, `betTypes.get`, `restricted.check`, `transactions.add`, `transactions.delete` |
| **settingsPage** | `components/settings/settingsPage.js`, `settingsHandlers.js` | `settings.get`, `settings.update`, `lotteryTypes.get`, `lotteryTypes.add`, `lotteryTypes.update`, `lotteryTypes.delete`, `lotteryTypes.getLogs`, `rounds.get`, `rounds.getNextNumber`, `rounds.add`, `rounds.update`, `rounds.delete`, `restricted.get`, `restricted.add`, `restricted.removeById` |
| **summaryPage** | `components/summary/summaryPage.js` | `summary.get`, `transactions.get` |
| **customerPage** | `components/customer/customerPage.js`, `customerHandlers.js` | `customers.get`, `customers.add`, `customers.delete` |
| **usersPage** | `components/users/usersPage.js`, `usersHandlers.js` | `users.get`, `users.add`, `users.delete` |
| **lotterySelectPage** | `components/lotterySelect/lotterySelectPage.js` | `lotteryTypes.get`, `settings.get`, `rounds.getOpen` |

---

## PART 1: API ที่ใช้งานจริง (31 endpoints)

### 1. Auth — การยืนยันตัวตน (Public)

#### POST /api/auth/login
- **ใช้ใน:** loginPage
- **Body:** `{ username: string, password: string }`
- **Response:** `{ success: true, data: { access_token: string, user: { id, username, role } } }`
- **Cookie:** ตั้ง `access_token` httpOnly cookie อัตโนมัติ

#### POST /api/auth/register
- **ใช้ใน:** registerPage
- **Body:** `{ username: string, password: string, displayName?: string, phone?: string, lineId?: string, role?: string }`
- **Response:** `{ success: true, data: { id, username, role } }`
- **Error 409:** Username already exists

---

### 2. Settings — ตั้งค่าระบบ (Protected)

#### GET /api/settings
- **ใช้ใน:** keyPage, settingsPage, lotterySelectPage
- **Permission:** `settings.read`
- **Response:** `{ success: true, data: { isLotteryOpen, closingTime, payRate2Digit, payRate3Digit, payRates, autoReverse, manualMode, minBet, maxBet2Digit, maxBet3Digit, ... } }`

#### PUT /api/settings
- **ใช้ใน:** settingsPage (toggle lottery, save time, save rates, save limits, toggle reverse, toggle manual)
- **Permission:** `settings.write`
- **Body:** `{ isLotteryOpen?: boolean, closingTime?: string, payRate2Digit?: number, payRate3Digit?: number, payRates?: object, autoReverse?: boolean, manualMode?: boolean, minBet?: number, maxBet2Digit?: number, maxBet3Digit?: number }`
- **Response:** `{ success: true }`

---

### 3. Transactions — รายการแทงหวย (Protected)

#### GET /api/transactions
- **ใช้ใน:** keyPage, summaryPage
- **Permission:** `numbers.read`
- **Response:** `{ success: true, data: [{ id, bet_type_code, bet_type_label, number, amount, customer_name, user_name, created_at, ... }] }`

#### POST /api/transactions
- **ใช้ใน:** keyPage
- **Permission:** `numbers.create`
- **Body:** `{ bet_type_code: string, bet_type_label: string, number: string, amount: number, customer_id?: number, customer_name?: string, user_id?: number, user_name?: string }`
- **Response:** `{ success: true, data: { id, ... } }`

#### DELETE /api/transactions/:id
- **ใช้ใน:** keyPage
- **Permission:** `numbers.delete`
- **Params:** `id` (integer)
- **Response:** `{ success: true }`

---

### 4. Restricted Numbers — หวยอั้น (Protected)

#### GET /api/restricted
- **ใช้ใน:** settingsPage
- **Permission:** `numbers.read`
- **Query:** `?lotteryTypeId=1` (optional)
- **Response:** `{ success: true, data: [{ id, number, maxAmount, type, lotteryTypeId, ... }] }`

#### POST /api/restricted
- **ใช้ใน:** settingsPage
- **Permission:** `numbers.create`
- **Body:** `{ number: string, maxAmount: number, type: string, lotteryTypeId?: number }`
- **Response:** `{ success: true, data: [...] }` (returns updated list)

#### DELETE /api/restricted/id/:id
- **ใช้ใน:** settingsPage
- **Permission:** `numbers.delete`
- **Params:** `id` (integer)
- **Response:** `{ success: true, data: [...] }` (returns updated list)

#### GET /api/restricted/check/:number
- **ใช้ใน:** keyPage
- **Permission:** `numbers.read`
- **Params:** `number` (string, URL-encoded)
- **Query:** `?lotteryTypeId=1` (optional)
- **Response:** `{ success: true, restricted: boolean, data: { maxAmount: number } }`

---

### 5. Bet Types — ประเภทแทง (Protected)

#### GET /api/bet-types
- **ใช้ใน:** keyPage
- **Permission:** `numbers.read`
- **Response:** `{ success: true, data: { digit2: [{ key, code, label, shortcut }], digit3: [...], special: [...] } }`

---

### 6. Summary — สรุปยอด (Protected)

#### GET /api/summary
- **ใช้ใน:** summaryPage
- **Permission:** `numbers.read`
- **Response:** `{ success: true, data: { totalBills: number, totalAmount: number, totalCustomers: number, topNumbers: [...] } }`

---

### 7. Customers — จัดการลูกค้า (Protected)

#### GET /api/customers
- **ใช้ใน:** keyPage, customerPage
- **Permission:** `numbers.read`
- **Response:** `{ success: true, data: [{ id: 0, name: "-- ลูกค้าทั่วไป --" }, { id, name, phone, ... }] }`

#### POST /api/customers
- **ใช้ใน:** customerPage
- **Permission:** `numbers.create`
- **Body:** `{ name: string, phone?: string }`
- **Response:** `{ success: true, data: { id, name, phone } }`

#### DELETE /api/customers/:id
- **ใช้ใน:** customerPage
- **Permission:** `numbers.delete`
- **Params:** `id` (string/integer)
- **Response:** `{ success: true }`

---

### 8. Users — จัดการผู้ใช้ (Protected)

#### GET /api/users
- **ใช้ใน:** usersPage
- **Permission:** `users.read`
- **Response:** `{ success: true, data: [{ id, username, displayName, role, status, ... }] }`

#### POST /api/users
- **ใช้ใน:** usersPage (apiClient → `api.users.add`)
- **Note:** ⚠️ Route ไม่มีใน backend routes (users.routes.js มีเฉพาะ GET, PATCH, DELETE) — อาจเป็น bug
- **Body:** `{ username: string, displayName: string, password: string, role: string }`

#### DELETE /api/users/:id
- **ใช้ใน:** usersPage
- **Permission:** `users.delete`
- **Params:** `id` (string/integer)
- **Response:** `{ success: true }`

---

### 9. Lottery Types — ประเภทหวย (Protected)

#### GET /api/lottery-types
- **ใช้ใน:** settingsPage, lotterySelectPage
- **Response:** `{ success: true, data: [{ id, name, code, isOpen, openTime, closeTime, icon, sortOrder, ... }] }`

#### GET /api/lottery-types/check/:code
- **ใช้ใน:** keyPage
- **Params:** `code` (string, URL-encoded)
- **Response:** `{ success: true, data: { exists: boolean, isOpen: boolean, name: string, closeTime: string, ... } }`

#### POST /api/lottery-types
- **ใช้ใน:** settingsPage
- **Body:** `{ name: string, code: string, openTime: string, closeTime: string, icon?: string }`
- **Response:** `{ success: true, data: { id, ... } }`

#### PATCH /api/lottery-types/:id
- **ใช้ใน:** settingsPage (toggle, save time)
- **Params:** `id` (integer)
- **Body:** `{ isOpen?: boolean, openTime?: string, closeTime?: string, ... }`
- **Response:** `{ success: true, data: { id, ... } }`

#### DELETE /api/lottery-types/:id
- **ใช้ใน:** settingsPage
- **Params:** `id` (integer)
- **Response:** `{ success: true, message: "Deleted" }`

#### GET /api/lottery-types/:id/logs
- **ใช้ใน:** settingsPage
- **Params:** `id` (integer)
- **Response:** `{ success: true, data: [{ id, action, changes, createdAt, ... }] }`

---

### 10. Rounds — จัดการงวดหวย (Protected)

#### GET /api/rounds
- **ใช้ใน:** settingsPage
- **Query:** `?lotteryTypeId=1&status=open` (optional)
- **Response:** `{ success: true, data: [{ id, roundNumber, roundDate, status, lotteryTypeId, note, ... }] }`

#### GET /api/rounds/open
- **ใช้ใน:** lotterySelectPage
- **Response:** `{ success: true, data: [{ id, roundNumber, roundDate, lotteryTypeId, ... }] }`

#### GET /api/rounds/next-number/:lotteryTypeId
- **ใช้ใน:** settingsPage
- **Params:** `lotteryTypeId` (integer)
- **Response:** `{ success: true, data: { next: number, hasRounds: boolean } }`

#### POST /api/rounds
- **ใช้ใน:** settingsPage
- **Body:** `{ roundDate: string, lotteryTypeId: number, roundNumber: number, note?: string }`
- **Response:** `{ success: true, data: { id, ... } }`

#### PATCH /api/rounds/:id
- **ใช้ใน:** settingsPage (close/reopen round)
- **Params:** `id` (integer)
- **Body:** `{ status?: string, note?: string, ... }`
- **Response:** `{ success: true, data: { id, ... } }`

#### DELETE /api/rounds/:id
- **ใช้ใน:** settingsPage
- **Params:** `id` (integer)
- **Response:** `{ success: true, message: "Deleted" }`

---

## PART 2: API ที่ไม่ได้ใช้งาน

### A. อยู่ใน apiClient.js แต่ไม่มีหน้าไหนเรียกใช้

| API Method | Endpoint | หมายเหตุ |
|-----------|----------|----------|
| `api.transactions.clear()` | DELETE /api/transactions | ลบรายการทั้งหมด — ไม่มี UI เรียก |
| `api.restricted.remove(number)` | DELETE /api/restricted/:number | Legacy — ถูกแทนที่ด้วย `removeById` |
| `api.auth.profile()` | GET /api/auth/profile | ดึงข้อมูลผู้ใช้ปัจจุบัน — ไม่มีหน้าเรียก |
| `api.auth.logout()` | POST /api/auth/logout | Logout — ไม่มี UI เรียก (ใช้ localStorage clear แทน?) |
| `api.rounds.getById(id)` | GET /api/rounds/:id | ดึงงวดเดี่ยว — ไม่มีหน้าเรียก |
| `api.rounds.getReport(id)` | GET /api/rounds/:id/report | ดึงรายงานงวด — ไม่มีหน้าเรียก |
| `api.rounds.addBulk(data)` | POST /api/rounds/bulk | สร้างงวดหลายรายการ — ไม่มี UI เรียก |

### B. อยู่ใน Backend Routes แต่ไม่มีใน apiClient.js เลย

| Endpoint | Route File | หมายเหตุ |
|----------|-----------|----------|
| GET /api/customers/:id | customers.routes.js | ดึงลูกค้ารายเดี่ยว |
| PATCH /api/customers/:id | customers.routes.js | อัปเดตข้อมูลลูกค้า |
| GET /api/users/:id | users.routes.js | ดึงผู้ใช้รายเดี่ยว |
| PATCH /api/users/:id | users.routes.js | อัปเดตข้อมูลผู้ใช้ |

### C. ⚠️ ปัญหาที่พบ

| ปัญหา | รายละเอียด |
|-------|-----------|
| `api.users.add()` → POST /api/users | Frontend เรียก POST /api/users แต่ backend **ไม่มี POST route** (มีเฉพาะ GET, PATCH, DELETE) — ควรเพิ่ม POST route หรือเปลี่ยนไปใช้ auth/register |

---

## PART 3: Swagger UI Spec

> ดูไฟล์ `swagger.yaml` สำหรับ OpenAPI 3.0 specification ที่โหลดใน Swagger UI ได้
