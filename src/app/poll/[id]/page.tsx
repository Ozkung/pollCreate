import { Suspense } from "react";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPoll, VOTER_COOKIE } from "@/lib/polls";
import { catStyle } from "@/lib/colors";
import { SidebarWidget } from "@/app/sidebar-widget";
import { VoteForm } from "./vote-form";
import { Results } from "./results";
import { ShareLink } from "./share-link";
import { AutoRefresh } from "./auto-refresh";

const dateFormat = new Intl.DateTimeFormat("th-TH", { dateStyle: "long" });

export default function PollPage({ params }: PageProps<"/poll/[id]">) {
  return (
    <Suspense fallback={<p className="text-ink-muted">กำลังโหลดโพล…</p>}>
      <PollContent params={params} />
    </Suspense>
  );
}

async function PollContent({ params }: Pick<PageProps<"/poll/[id]">, "params">) {
  const { id } = await params;
  const voterId = (await cookies()).get(VOTER_COOKIE)?.value;
  const poll = getPoll(id, voterId);
  if (!poll) notFound();

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)]">
      <section className="box box-lg flex flex-col gap-3 p-6 sm:p-8">
        <span className="tag self-start" style={catStyle(poll.allowMultiple ? 2 : 4)}>
          {poll.allowMultiple ? "เลือกได้หลายข้อ" : "เลือกได้ 1 ข้อ"}
        </span>
        <p className="text-sm font-medium text-ink-muted">
          {dateFormat.format(new Date(poll.createdAt))} · {poll.totalVoters} คนโหวตแล้ว
        </p>
        <h1 className="text-[clamp(1.75rem,3vw,2.5rem)]">{poll.question}</h1>
        <div className="mt-5">
          {poll.myVote ? (
            <>
              <Results poll={poll} />
              <AutoRefresh intervalMs={5000} />
            </>
          ) : (
            <VoteForm poll={poll} />
          )}
        </div>
      </section>

      <aside className="flex flex-col gap-8">
        <SidebarWidget title="แชร์โพลนี้">
          <ShareLink />
        </SidebarWidget>
        <SidebarWidget title="อยากถามอะไรอีก?">
          <p className="text-ink-muted">สร้างโพลใหม่ได้ในไม่กี่วินาที</p>
          <Link href="/" className="btn self-start">
            สร้างโพลใหม่ →
          </Link>
        </SidebarWidget>
      </aside>
    </div>
  );
}
