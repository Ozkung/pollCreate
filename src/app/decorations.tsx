/** Background doodles ("Body Decorations"); hidden below the two-column breakpoint. */
export function Decorations() {
  const stroke = { stroke: "var(--ink)", strokeWidth: 2.5 };
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 hidden overflow-hidden lg:block">
      <svg className="absolute left-[3%] top-[22%]" width="56" height="56" viewBox="0 0 56 56">
        <path
          d="M28 4l6 16 17 1-13 11 5 17-15-10-15 10 5-17L5 21l17-1z"
          fill="var(--cat-yellow)"
          {...stroke}
          strokeLinejoin="round"
        />
      </svg>
      <svg className="absolute right-[3%] top-[14%]" width="80" height="28" viewBox="0 0 80 28">
        <path
          d="M2 14c8-12 14-12 19 0s11 12 19 0 14-12 19 0 11 12 19 0"
          fill="none"
          {...stroke}
          stroke="var(--accent)"
          strokeWidth={4}
          strokeLinecap="round"
        />
      </svg>
      <svg className="absolute bottom-[12%] left-[4%]" width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="20" fill="var(--cat-green)" {...stroke} />
      </svg>
      <svg className="absolute bottom-[18%] right-[4%]" width="60" height="60" viewBox="0 0 60 60">
        <path
          d="M30 6c14 0 24 8 24 22S44 54 28 54 6 46 6 32 16 6 30 6z"
          fill="var(--cat-purple)"
          {...stroke}
        />
      </svg>
    </div>
  );
}
