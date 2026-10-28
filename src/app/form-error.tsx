/**
 * The design system has no semantic colours, so errors are set apart by
 * weight and a hairline rule instead of red.
 */
export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="border-l border-border pl-3 font-bold">
      {message}
    </p>
  );
}
