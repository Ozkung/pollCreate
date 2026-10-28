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
    <div className="flex flex-col gap-3">
      <input
        readOnly
        value={url}
        onFocus={(e) => e.target.select()}
        aria-label="ลิงก์โพล"
        className="field text-sm"
      />
      <button
        type="button"
        onClick={copy}
        disabled={!url}
        className="btn btn-primary self-start"
      >
        {copied ? "คัดลอกแล้ว ✓" : "คัดลอกลิงก์"}
      </button>
    </div>
  );
}
