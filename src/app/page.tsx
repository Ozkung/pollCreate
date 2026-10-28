import { CreatePollForm } from "./create-poll-form";

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">สร้างโพลใหม่</h1>
        <p className="mt-1 text-sm text-muted">
          ตั้งคำถาม ใส่ตัวเลือก แล้วแชร์ลิงก์ให้เพื่อนโหวต
        </p>
      </div>
      <CreatePollForm />
    </div>
  );
}
