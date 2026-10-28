import { catStyle } from "@/lib/colors";
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
          <li key={i} className="flex flex-col gap-2" style={catStyle(i)}>
            <div className="flex items-center gap-3">
              <span className="num">{i + 1}</span>
              <span className={`flex-1 ${leading ? "font-bold" : ""}`}>
                {opt.text}
                {mine && <span className="tag ml-2 bg-surface">คุณเลือก</span>}
              </span>
              <span className="shrink-0 font-heading font-bold tabular-nums">{percent}%</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-5 flex-1 overflow-hidden rounded-full border-2 border-ink bg-surface">
                <div
                  className="h-full border-r-2 border-ink bg-cat transition-[width] duration-500 ease-out"
                  style={{ width: `${percent}%`, borderRightWidth: percent ? undefined : 0 }}
                />
              </div>
              <span className="w-16 shrink-0 text-right text-sm text-ink-muted tabular-nums">
                {opt.votes} โหวต
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
