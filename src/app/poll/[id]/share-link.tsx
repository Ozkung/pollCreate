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
    <div className="flex flex-col gap-2">
      <p className="font-bold">แชร์โพลนี้</p>
      <div className="flex gap-2">
        <input
          readOnly
          value={url}
          onFocus={(e) => e.target.select()}
          aria-label="ลิงก์โพล"
          className="field min-w-0 flex-1"
        />
        <button
          type="button"
          onClick={copy}
          disabled={!url}
          className="btn shrink-0"
        >
          {copied ? "คัดลอกแล้ว" : "คัดลอกลิงก์"}
        </button>
      </div>
    </div>
  );
}
