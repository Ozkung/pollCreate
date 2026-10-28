import { CreatePollForm } from "./create-poll-form";

export default function Home() {
  return (
    <div className="flex flex-col gap-9">
      <div className="flex flex-col gap-2">
        <h1 className="text-[28px] leading-tight">สร้างโพลใหม่</h1>
        <p className="text-muted">
          ตั้งคำถาม ใส่ตัวเลือก แล้วแชร์ลิงก์ให้เพื่อนโหวต
        </p>
      </div>
      <CreatePollForm />
    </div>
  );
}
