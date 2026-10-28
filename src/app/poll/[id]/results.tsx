import type { Poll } from "@/lib/polls";

export function Results({ poll }: { poll: Poll }) {
  const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);
  const maxVotes = Math.max(...poll.options.map((o) => o.votes));

  return (
    <ul className="flex flex-col gap-6">
      {poll.options.map((opt, i) => {
        const percent = totalVotes ? Math.round((opt.votes / totalVotes) * 100) : 0;
        const mine = poll.myVote?.includes(i);
        const leading = opt.votes > 0 && opt.votes === maxVotes;
        return (
          <li key={i} className="flex flex-col gap-2">
            <div className="flex justify-between gap-3">
              <span className={leading ? "font-bold" : undefined}>
                {opt.text}
                {mine && (
                  <span className="ml-2 rounded-[3px] border border-border px-1 text-sm font-bold">
                    คุณเลือก
                  </span>
                )}
              </span>
              <span className="shrink-0 tabular-nums text-muted">
                {opt.votes} โหวต · {percent}%
              </span>
            </div>
            <div className="h-3 border border-border">
              <div
                className="h-full bg-foreground transition-[width] duration-500 ease-out"
                style={{ width: `${percent}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
