import Link from "next/link";

export default function PollNotFound() {
  return (
    <div className="card flex flex-col gap-4 p-6">
      <h1 className="text-[28px] leading-tight">ไม่พบโพลนี้</h1>
      <p className="text-muted">ลิงก์อาจไม่ถูกต้อง หรือโพลถูกลบไปแล้ว</p>
      <Link href="/" className="link self-start">
        สร้างโพลใหม่
      </Link>
    </div>
  );
}
