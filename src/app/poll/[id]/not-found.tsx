import Link from "next/link";

export default function PollNotFound() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
      <h1 className="text-xl font-bold">ไม่พบโพลนี้</h1>
      <p className="mt-2 text-sm text-muted">ลิงก์อาจไม่ถูกต้อง หรือโพลถูกลบไปแล้ว</p>
      <Link
        href="/"
        className="mt-4 inline-block rounded-lg bg-accent px-4 py-2 font-semibold text-white"
      >
        สร้างโพลใหม่
      </Link>
    </div>
  );
}
