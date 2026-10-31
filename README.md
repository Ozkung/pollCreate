# Create Poll

เว็บสำหรับสร้างโพล แชร์ลิงก์ให้คนอื่นโหวต และดูผลแบบอัปเดตอัตโนมัติ

สร้างด้วย **Next.js 16** (App Router, Cache Components, Server Actions), **React 19** และ **Tailwind CSS 4**

## ฟีเจอร์

- สร้างโพล: ตั้งคำถาม และใส่ตัวเลือกได้ 2–20 ข้อ (เพิ่ม/ลบได้)
- ตั้งได้ว่าจะให้เลือกได้ข้อเดียวหรือหลายข้อ
- หน้าโพลมีลิงก์ให้กดคัดลอกเพื่อแชร์
- หนึ่งเบราว์เซอร์โหวตได้ครั้งเดียว (ใช้ cookie `voter_id`)
- โหวตแล้วจะเห็นผลเป็นกราฟแท่งพร้อมเปอร์เซ็นต์ และรีเฟรชเองทุก 5 วินาที
- ตรวจข้อมูลฝั่งเซิร์ฟเวอร์ เช่น คำถามว่าง ตัวเลือกซ้ำ หรือยาวเกินกำหนด
- หลังโหวตมีปุ่ม Donate (ไม่บังคับ) แสดง PromptPay QR ให้เลือกจำนวนเงิน ฿20 / ฿50 / ฿100 หรือให้ผู้ใช้ใส่จำนวนเองในแอปธนาคาร

## เริ่มใช้งาน

คัดลอก `.env.example` เป็น `.env.local` แล้วใส่ connection string ของ MongoDB

```bash
cp .env.example .env.local
```

```bash
npm install
npm run dev
```

เปิด http://localhost:3000

Production:

```bash
npm run build
npm start
```

## Design

ใช้ design system สไตล์ "Groovy" (playful neo-brutalist)
- พื้นสีครีม การ์ดสีขาว เส้นขอบดำ 2px และเงาแข็งแบบ offset (5px → 8px เมื่อ hover)
- หัวข้อใช้ Poppins / Prompt ส่วนเนื้อหาใช้ Inter / Noto Sans Thai (ฟอนต์ไทยเป็น fallback เพราะ Poppins/Inter ไม่มีตัวอักษรไทย)
- ตัวเลือกแต่ละข้อมี "สีหมวด" ของตัวเอง (เหลือง ชมพู ม่วง เขียว ฟ้า ส้ม) ใช้ทั้งในฟอร์มและแถบผลโหวต
- สีหลัก `#FF5C35` ใช้กับปุ่มหลัก ลิงก์ตอน hover และ focus ring
- เลย์เอาต์ 2 คอลัมน์ (เนื้อหา + sidebar) ตั้งแต่ 1024px ขึ้นไป และมีรูปตกแต่งพื้นหลังเฉพาะจอใหญ่
- รองรับ `prefers-reduced-motion`

token ทั้งหมดอยู่ใน `src/app/globals.css` และสีหมวดอยู่ใน `src/lib/colors.ts`

## โครงสร้าง

| ไฟล์ | หน้าที่ |
| --- | --- |
| `src/app/page.tsx`, `create-poll-form.tsx` | หน้าสร้างโพล |
| `src/app/poll/[id]/` | หน้าโหวตและดูผล |
| `src/app/actions.ts` | Server Actions (`createPollAction`, `voteAction`) |
| `src/lib/polls.ts` | ตรวจข้อมูลและจัดเก็บโพล |

## การเก็บข้อมูล

ใช้ MongoDB (`src/lib/db.ts`, `src/lib/polls.ts`) โดยอ่านค่าจาก environment variables
- `MONGODB_URI`: connection string
- `MONGODB_DB`: ชื่อฐานข้อมูล (ค่าเริ่มต้นคือ `pollcreate`)

collection ที่ใช้
- `polls`: คำถาม ตัวเลือก และจำนวนโหวตของแต่ละข้อ
- `votes`: ใครโหวตอะไร โดยมี unique index `{ pollId, voterId }` กันโหวตซ้ำในระดับฐานข้อมูล

index จะถูกสร้างให้อัตโนมัติตอนใช้งานครั้งแรก

## Donate (PromptPay)

ตั้งค่าใน `.env.local`
- `PROMPTPAY_ID`: เบอร์โทร (10 หลัก) เลขบัตรประชาชน/เลขผู้เสียภาษี (13 หลัก) หรือ e-Wallet ID (15 หลัก)
- `PROMPTPAY_NAME`: (ไม่บังคับ) ชื่อผู้รับที่แสดงใต้ QR

ถ้าไม่ตั้ง `PROMPTPAY_ID` หรือตั้งค่าผิดรูปแบบ ปุ่ม Donate จะถูกซ่อน
QR สร้างตามมาตรฐาน PromptPay (EMVCo) ใน `src/lib/promptpay.ts`
ตอน deploy ให้ตั้ง `MONGODB_URI` ของ production ใน environment ของ host เช่น Vercel และอย่า commit ไฟล์ `.env.local`
