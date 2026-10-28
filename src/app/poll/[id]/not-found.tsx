import Link from "next/link";
import { catStyle } from "@/lib/colors";

export default function PollNotFound() {
  return (
    <section className="box box-lg mx-auto flex max-w-xl flex-col items-start gap-4 p-8">
      <span className="tag" style={catStyle(1)}>
        404
      </span>
      <h1 className="text-[clamp(1.75rem,3vw,2.5rem)]">ไม่พบโพลนี้</h1>
      <p className="text-ink-muted">ลิงก์อาจไม่ถูกต้อง หรือโพลถูกลบไปแล้ว</p>
      <Link href="/" className="btn btn-primary">
        สร้างโพลใหม่ →
      </Link>
    </section>
  );
}
