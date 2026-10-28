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

## เริ่มใช้งาน

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

ใช้ design system สไตล์ "Tiagofragoso" (editorial / print-forward)
- ใช้ฟอนต์ Times New Roman ทั้งหมด ส่วนภาษาไทยใช้ Noto Serif Thai เป็น fallback
- โทนขาวดำ มุมเหลี่ยม 0px และเส้นขอบดำ 1px
- สีน้ำเงิน `#0000EE` ใช้กับลิงก์เท่านั้น
- ปุ่มพื้นใส เมื่อ hover จะกลับสีและเลื่อนไปทางขวาเล็กน้อย
- ไม่มีสีแดง/เขียวสำหรับสถานะ: ข้อความ error ใช้ตัวหนาและเส้นขอบซ้ายแทน
- รองรับ light / dark ตามการตั้งค่าของระบบ

token ทั้งหมดอยู่ใน `src/app/globals.css`

## โครงสร้าง

| ไฟล์ | หน้าที่ |
| --- | --- |
| `src/app/page.tsx`, `create-poll-form.tsx` | หน้าสร้างโพล |
| `src/app/poll/[id]/` | หน้าโหวตและดูผล |
| `src/app/actions.ts` | Server Actions (`createPollAction`, `voteAction`) |
| `src/lib/polls.ts` | ตรวจข้อมูลและจัดเก็บโพล |

## การเก็บข้อมูล

ตอนนี้โพลจะถูกเก็บไว้ในไฟล์ `data/polls.json` บนเซิร์ฟเวอร์ ซึ่งเหมาะสำหรับการรันบนเครื่องหรือบนเซิร์ฟเวอร์เดียว
ถ้าจะ deploy แบบ serverless (เช่น Vercel) ต้องเปลี่ยน `src/lib/polls.ts` ไปใช้ฐานข้อมูลจริง เช่น Postgres หรือ Redis
