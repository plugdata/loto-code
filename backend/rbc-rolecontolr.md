1#กำหนด role
role -> admin ,agent , member , customer

2#กำหนด action
action -> create , read , update , delete , view

ตัวอย่าง role:[admin,agent] , action:[create,read] = admin กับ agent สามารถ create และ read ได้

3#กำหนด ishideall

ishideall = บล็อกไม่ให้เห็นและเข้าถึง API + UI 
ishideui = บล็อกไม่ให้เห็น UI 
guard = confirm ก่อนทำ 
 
 ตัวอย่าง ishideall:[admin,agent] = admin กับ agent ไม่สามารถเห็นและเข้าถึง API + UI ได้

4#กำหนด property
property -> field
ishidefield = ซ่อน field
isDisabled = แสดงได้ แต่แก้ไม่ได้
isRequired = บังคับกรอก

ตัวอย่าง ishidefield:[admin,agent] = admin กับ agent ไม่สามารถเห็นและเข้าถึง API + UI ได้

5#กำหนด before
before = ก่อนกระทำ  api และ hook
ตัวอย่าง before:[admin,agent] = admin กับ agent ไม่สามารถเห็นและเข้าถึง API + UI ได้

6#กำหนด after
after = หลังกระทำ  api และ hook
ตัวอย่าง after:[admin,agent] = admin กับ agent ไม่สามารถเห็นและเข้าถึง API + UI ได้

7#กำหนด validate
validate = ตรวจสอบข้อมูลก่อนกระทำ  api และ hook
ตัวอย่าง validate:[admin,agent] = admin กับ agent ไม่สามารถเห็นและเข้าถึง API + UI ได้

8#กำหนด Validation pattern 
  pattern: '^[0-9]{13}$' 
  pattern: '^[A-Za-zก-ฮ]+$'
  pattern: '^[0-9]+$'
  pattern: '^[^\s@]+@[^\s@]+\.[^\s@]+$'
และอื่นๆ ที่เกี่ยวกับ forms

ตัวอย่าง

before: async (request) => {
  const id = request.payload?.nationalId

  if (id && !/^[0-9]{13}$/.test(id)) {
    throw new Error('เลขบัตรต้องมี 13 หลัก')
  }

  return request
}

หรือ 

validate: {
  payload: {
    nationalId: {
      pattern: '^[0-9]{13}$',
      message: 'เลขบัตรต้องมี 13 หลัก'
    }
  }
}

หรือ 
before: async (request) => {
  const id = request.payload?.nationalId
  const pattern = /^[0-9]{13}$/
  if (pattern.test(id)) {
    throw new Error('เลขบัตรต้องมี 13 หลัก')
  }

  return request
}

9#กำหนด ใช้ context record และ params

ตัวอย่าง

context: {
  record: {
    id: '1',
    name: 'John Doe',
    email: [EMAIL_ADDRESS]'
  }
}

params: {
  id: '1',
  name: 'John Doe',
  email: [EMAIL_ADDRESS]'
}