import type { Poll } from "@/lib/polls";

export function Results({ poll }: { poll: Poll }) {
  const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);
  const maxVotes = Math.max(...poll.options.map((o) => o.votes));

  return (
    <ul className="flex flex-col gap-4">
      {poll.options.map((opt, i) => {
        const percent = totalVotes ? Math.round((opt.votes / totalVotes) * 100) : 0;
        const mine = poll.myVote?.includes(i);
        const leading = opt.votes > 0 && opt.votes === maxVotes;
        return (
          <li key={i}>
            <div className="mb-1 flex justify-between gap-3 text-sm">
              <span className={leading ? "font-semibold" : undefined}>
                {opt.text}
                {mine && <span className="ml-2 text-accent">✓ คุณเลือก</span>}
              </span>
              <span className="shrink-0 tabular-nums text-muted">
                {opt.votes} โหวต · {percent}%
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-accent-soft">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
