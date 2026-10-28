import { catStyle } from "@/lib/colors";

/** Callout: emoji + tinted box with an ink border. */
export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="flex items-center gap-2 rounded-[var(--radius-sm)] border-2 border-ink bg-cat px-4 py-3 font-semibold"
      style={catStyle(1)}
    >
      <span aria-hidden>⚠️</span>
      {message}
    </p>
  );
}
