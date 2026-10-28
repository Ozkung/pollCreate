import { catStyle } from "@/lib/colors";
import { CreatePollForm } from "./create-poll-form";
import { SidebarWidget } from "./sidebar-widget";

const steps = [
  { title: "ตั้งคำถาม", detail: "พิมพ์สิ่งที่อยากถาม" },
  { title: "ใส่ตัวเลือก", detail: "ได้ตั้งแต่ 2 ถึง 20 ข้อ" },
  { title: "แชร์ลิงก์", detail: "ส่งให้เพื่อนโหวตแล้วดูผลสดๆ" },
];

const features = ["เลือกข้อเดียว", "เลือกหลายข้อ", "ผลแบบเรียลไทม์", "แชร์ลิงก์", "โหวตได้ครั้งเดียว"];

export default function Home() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)]">
      <section className="box box-lg flex flex-col gap-6 p-6 sm:p-8">
        <div className="flex flex-col gap-3">
          <span className="tag self-start" style={catStyle(0)}>
            โพลใหม่
          </span>
          <h1 className="text-[clamp(1.75rem,3vw,2.5rem)]">สร้างโพลใหม่</h1>
          <p className="text-ink-muted">ตั้งคำถาม ใส่ตัวเลือก แล้วแชร์ลิงก์ให้เพื่อนโหวต</p>
        </div>
        <CreatePollForm />
      </section>

      <aside className="flex flex-col gap-8">
        <SidebarWidget title="วิธีใช้งาน">
          <ol className="flex flex-col gap-4">
            {steps.map((step, i) => (
              <li key={step.title} className="flex items-start gap-3">
                <span className="num" style={catStyle(i + 1)}>
                  {i + 1}
                </span>
                <div className="flex flex-col">
                  <span className="font-heading font-bold leading-tight">{step.title}</span>
                  <span className="text-sm text-ink-muted">{step.detail}</span>
                </div>
              </li>
            ))}
          </ol>
        </SidebarWidget>
        <SidebarWidget title="ทำอะไรได้บ้าง">
          <ul className="flex flex-wrap gap-2">
            {features.map((f, i) => (
              <li key={f} className="tag" style={catStyle(i)}>
                {f}
              </li>
            ))}
          </ul>
        </SidebarWidget>
      </aside>
    </div>
  );
}
