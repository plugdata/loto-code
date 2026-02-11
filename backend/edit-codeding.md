# การแก้ไขข้อผิดพลาด Swagger UI Parser Error (Line 12)

**ปัญหาที่พบ:**
เกิด Error `Parser error on line 12: end of the stream or a document separator is expected` เมื่อเปิดหน้า Swagger UI

**สาเหตุ:**
ในไฟล์ `backend/src/routes/swagger.routes.js` มีการตั้งค่า `swaggerUI({ url: '/api/doc' })` ซึ่งค่า `/api/doc` นี้ชี้กลับมาที่ตัวหน้า Swagger UI เอง (ซึ่งส่งค่ากลับมาเป็น HTML) แทนที่จะชี้ไปที่ไฟล์ JSON ของ OpenAPI Spec ทำให้ตัว Parser ของ Swagger พยายามอ่าน HTML เป็น YAML/JSON จึงเกิดข้อผิดพลาด

**การแก้ไข:**
ได้ทำการแก้ไขไฟล์ `backend/src/routes/swagger.routes.js` โดยเปลี่ยน URL ของ Spec ให้ถูกต้อง ดังนี้:

```javascript
// ก่อนแก้ไข
swagger.get('/', swaggerUI({ url: '/api/doc' }));

// หลังแก้ไข
swagger.get('/', swaggerUI({ url: '/api/doc/doc' }));
```

**ผลลัพธ์:**
ตอนนี้ Swagger UI สามารถดึงข้อมูล JSON จาก `/api/doc/doc` มาแสดงผลได้อย่างถูกต้องแล้วที่ URL `http://localhost:3001/api/doc/`

---

# การแก้ไขข้อผิดพลาด Login API Request Failed

**ปัญหาที่พบ:**
เมื่อพยายาม Login หรือสมัครสมาชิก ระบบแจ้งเตือนว่า "API request failed" แม้ว่าจะกรอกข้อมูลถูกต้อง

**สาเหตุ:**
เกิดจากความไม่ตรงกัน (Mismatch) ของรูปแบบข้อมูลระหว่าง Backend และ Frontend:
1. **Frontend (`apiClient.js`)**: ถูกเขียนให้รอรับข้อมูลในรูปแบบ `{ success: true, data: ... }` หากไม่มีฟิลด์ `success` หรือเป็น `false` จะทำการ Throw Error ทันที
2. **Backend (`auth.routes.js`)**: ในตอนแรกส่งข้อมูลกลับไปเป็นก้อนข้อมูลดิบ (Raw Data) เช่น `{ access_token: "..." }` โดยไม่มีการหุ้ม (Wrap) ด้วยโครงสร้างที่ Frontend ต้องการ

**การแก้ไข:**
ได้ทำการแก้ไขไฟล์ `backend/src/routes/auth.routes.js` เพื่อปรับรูปแบบการส่งข้อมูลกลับ (Response) ให้มีโครงสร้างตามที่ Frontend ต้องการ ทั้งในส่วนของ Login, Register และ Profile:

```javascript
// ตัวอย่างการแก้ไขในส่วน Login
// ก่อนแก้ไข: return c.json(token, 200);
// หลังแก้ไข:
return c.json({ success: true, data: token }, 200);
```

**ผลลัพธ์:**
Frontend สามารถอ่านข้อมูลการ Login ได้ถูกต้อง ไม่เกิด Error และสามารถเก็บข้อมูลผู้ใช้ลงใน `localStorage` เพื่อเข้าสู่ระบบต่อไปได้

---

# การแก้ไขข้อผิดพลาด Prisma 7 และการเพิ่มสถานะออนไลน์ (User Status & Permission)

**ปัญหาที่พบ:**
1. เกิด Error `P1012: The datasource property url is no longer supported` เมื่อพยายามรัน Prisma Command
2. ระบบไม่สามารถแสดงสถานะ ออนไลน์/ออฟไลน์ ของผู้ใช้ได้
3. พบ Error 403 Forbidden เมื่อ Admin พยายามเข้าหน้าจัดการผู้ใช้หลังจากอัปเดตระบบ Permission

**สาเหตุ:**
1. **Prisma 7**: มีการเปลี่ยนแปลงวิธีกำหนดค่า Datasource ในเวอร์ชั่นล่าสุด โดยไม่อนุญาตให้ใช้ `url` ในไฟล์ `schema.prisma` หากมีการใช้งานไฟล์คอนฟิกภายนอก
2. **Database Sync**: มีการเพิ่มฟิลด์ `status` และ `displayName` ใน Schema แต่ไม่ได้ทำการ Sync ลงฐานข้อมูลจริง ทำให้เกิด Internal Server Error (500) เมื่อพยายาม Login
3. **Permission Session**: หลังจากเปลี่ยนระบบเป็น Permission-based ทำให้ Session เดิมของผู้ใช้ไม่มีข้อมูลสิทธิ์ (Permissions) ฝังอยู่ใน Token

**การแก้ไข:**
1. **Prisma Configuration**: แก้ไขไฟล์ `backend/src/prisma/schema.prisma` โดยนำฟิลด์ `url` ออก และแก้ไขไฟล์ `backend/src/db/connection.js` ให้รับ `datasourceUrl` ผ่าน `PrismaClient` แทน
2. **Granular Permissions**: ปรับปรุงไฟล์ `backend/src/config/permissions.js` โดยแยกสิทธิ์จัดการผู้ใช้ออกมาเด่นชัด (เช่น `users.read`, `users.create`) และอัปเดต Route ต่างๆ ให้ตรวจสอบสิทธิ์ที่ตรงกับหน้าที่
3. **Status Tracking**: 
    - แก้ไข `auth.service.js` ให้ทำการอัปเดตสถานะเป็น `online` เมื่อ Login และ `offline` เมื่อ Logout (พร้อมใส่ try-catch เพื่อความปลอดภัย)
    - แก้ไขหน้า `usersPage.js` ให้แสดงจุดสีสถานะ และใช้ `displayName` ในการแสดงผลแทน Username
4. **Database Migration**: รันคำสั่ง `npx prisma db push` เพื่อปรับโครงสร้างฐานข้อมูลให้รองรับฟิลด์ใหม่

**ผลลัพธ์:**
- ระบบ Prisma ทำงานร่วมกันได้สมบูรณ์ตามมาตรฐานเวอร์ชั่น 7
- หน้าจัดการผู้ใช้ (User Management) แสดงสถานะและชื่อแสดงผลได้อย่างถูกต้อง
- ระบบสิทธิ์ (Permissions) มีความปลอดภัยและละเอียดขึ้น โดยผู้ใช้ต้อง Logout และ Login ใหม่เพื่อรับ Token ชุดใหม่
