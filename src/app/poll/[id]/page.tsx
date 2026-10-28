import { Suspense } from "react";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPoll, VOTER_COOKIE } from "@/lib/polls";
import { VoteForm } from "./vote-form";
import { Results } from "./results";
import { ShareLink } from "./share-link";
import { AutoRefresh } from "./auto-refresh";

export default function PollPage({ params }: PageProps<"/poll/[id]">) {
  return (
    <Suspense fallback={<p className="text-muted">กำลังโหลดโพล…</p>}>
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
    <div className="flex flex-col gap-9">
      <div className="card flex flex-col gap-2 p-6">
        <h1 className="text-[28px] leading-tight">{poll.question}</h1>
        <p className="text-muted">
          {poll.allowMultiple ? "เลือกได้หลายข้อ" : "เลือกได้ 1 ข้อ"} ·{" "}
          {poll.totalVoters} คนโหวตแล้ว
        </p>
        <div className="mt-6">
          {poll.myVote ? (
            <>
              <Results poll={poll} />
              <AutoRefresh intervalMs={5000} />
            </>
          ) : (
            <VoteForm poll={poll} />
          )}
        </div>
      </div>
      <ShareLink />
      <Link href="/" className="link self-start">
        สร้างโพลใหม่
      </Link>
    </div>
  );
}
