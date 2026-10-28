"use client";

import { useState, useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

export function ShareLink() {
  const url = useSyncExternalStore(
    noopSubscribe,
    () => window.location.href,
    () => "",
  );
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <p className="mb-2 text-sm font-medium">แชร์โพลนี้</p>
      <div className="flex gap-2">
        <input
          readOnly
          value={url}
          onFocus={(e) => e.target.select()}
          aria-label="ลิงก์โพล"
          className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={copy}
          disabled={!url}
          className="shrink-0 rounded-lg bg-accent-soft px-3 py-2 text-sm font-medium text-accent hover:opacity-90"
        >
          {copied ? "คัดลอกแล้ว ✓" : "คัดลอกลิงก์"}
        </button>
      </div>
    </div>
  );
}
