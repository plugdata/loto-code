# คู่มือการใช้งาน Git และ GitHub (Basic Git Update)

คู่มือนี้สรุปคำสั่งพื้นฐานที่จำเป็นสำหรับการอัปเดตโค้ดไปยัง GitHub สำหรับโปรเจกต์ Loto

## 1. การตั้งค่าสภาพแวดล้อม (Environment Setup)

หากต้องการเปลี่ยนหรือตั้งค่า Remote Repository ใหม่:
```powershell
# ตรวจสอบ Remote ปัจจุบัน
git remote -v

# ลบ Remote เดิม (ถ้ามีปัญหา)
git remote remove origin

# เพิ่ม Remote ใหม่
git remote add origin https://github.com/plugdata/loto-code.git

# เปลี่ยน URL ของ Remote เดิม
git remote set-url origin https://github.com/plugdata/loto-code.git
```

---

## 2. ขั้นตอนการอัปเดตโค้ดพื้นฐาน (Standard Workflow)

เมื่อมีการแก้ไขโค้ดและต้องการส่งขึ้น GitHub ให้ทำตามลำดับดังนี้:

### ขั้นตอนที่ 1: ตรวจสอบความเปลี่ยนแปลง
```powershell
git status
```

### ขั้นตอนที่ 2: เลือกไฟล์ที่ต้องการเพิ่ม (Stage)
```powershell
# เพิ่มไฟล์ทั้งหมด (ยกเว้นที่อยู่ใน .gitignore)
git add .

# หรือเพิ่มเฉพาะไฟล์ที่ต้องการ
git add path/to/file.js
```

### ขั้นตอนที่ 3: บันทึกความเปลี่ยนแปลง (Commit)
```powershell
git commit -m "คำอธิบายการแก้ไข (ภาษาไทยหรืออังกฤษก็ได้)"
```

### ขั้นตอนที่ 4: ส่งข้อมูลขึ้น GitHub (Push)
```powershell
# สำหรับครั้งแรกที่บังคับใช้ branch main
git push -u origin main

# ครั้งต่อไปสามารถใช้สั้นๆ ได้
git push
```

---

## 3. คำสั่งอื่นๆ ที่จำเป็น (Essential Commands)

| คำสั่ง | คำอธิบาย |
| :--- | :--- |
| `git pull` | ดึงโค้ดล่าสุดจาก GitHub ลงมาที่เครื่องเรา |
| `git log --oneline` | ดูประวัติการ commit แบบสั้นๆ |
| `git checkout -b branch-name` | สร้าง branch ใหม่สำหรับการพัฒนาฟีเจอร์ใหม่ |
| `git reset --hard` | **ระวัง!** ยกเลิกการแก้ไขทั้งหมดและกลับไปที่ commit ล่าสุด |

---

## 4. ข้อควรระวังสำหรับโปรเจกต์นี้
- **ไฟล์ `nul`**: เป็นชื่อไฟล์ต้องห้ามบน Windows หากพบปัญหา "invalid path 'nul'" ให้ข้ามไฟล์นี้ไปโดยใช้ `.gitignore`
- **`.gitignore`**: ไฟล์เหล่านี้จะไม่ถูกส่งขึ้น GitHub เช่น `node_modules`, `.env`, และ `.claude`
