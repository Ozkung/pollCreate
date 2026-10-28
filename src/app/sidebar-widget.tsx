import type { ReactNode } from "react";

export function SidebarWidget({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="box flex flex-col gap-4 p-6">
      <h4 className="flex flex-col gap-2 text-lg">
        {title}
        <span aria-hidden className="h-1 w-10 rounded-full bg-accent" />
      </h4>
      {children}
    </section>
  );
}
