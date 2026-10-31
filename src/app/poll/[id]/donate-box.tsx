"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { promptPayPayload } from "@/lib/promptpay";
import { catStyle } from "@/lib/colors";

const AMOUNTS = [20, 50, 100];

export function DonateBox({
  promptPayId,
  recipientName,
}: {
  promptPayId: string;
  recipientName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [qrSvg, setQrSvg] = useState("");

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    QRCode.toString(promptPayPayload(promptPayId, amount), {
      type: "svg",
      margin: 1,
      errorCorrectionLevel: "M",
    }).then((svg) => {
      if (!cancelled) setQrSvg(svg);
    });
    return () => {
      cancelled = true;
    };
  }, [open, promptPayId, amount]);

  if (!open) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-ink-muted">ชอบเว็บนี้ไหม? เลี้ยงกาแฟคนทำได้นะ</p>
        <button type="button" onClick={() => setOpen(true)} className="btn btn-primary">
          ☕ Donate
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4" style={catStyle(0)}>
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-2xl">☕ Donate ผ่าน PromptPay</h2>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="ปิด"
          className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border-2 border-ink bg-surface font-bold"
        >
          ✕
        </button>
      </div>

      <div role="radiogroup" aria-label="จำนวนเงิน" className="flex flex-wrap gap-2">
        {[undefined, ...AMOUNTS].map((value, i) => {
          const selected = amount === value;
          return (
            <button
              key={value ?? "any"}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setAmount(value)}
              style={catStyle(i)}
              className={`tag min-h-11 px-4 text-sm ${selected ? "" : "bg-surface"}`}
            >
              {value ? `฿${value}` : "ระบุเองในแอป"}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-3 rounded-[var(--radius-md)] border-2 border-ink bg-cat p-4 sm:flex-row sm:items-center">
        <div
          role="img"
          aria-label={`QR PromptPay${amount ? ` จำนวน ${amount} บาท` : ""}`}
          className="size-48 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border-2 border-ink bg-white [&_svg]:size-full"
          dangerouslySetInnerHTML={{ __html: qrSvg }}
        />
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <span className="font-heading text-lg font-bold">
            {amount ? `฿${amount}` : "จำนวนเท่าไหร่ก็ได้"}
          </span>
          {recipientName && <span>ผู้รับ: {recipientName}</span>}
          <span className="text-sm">สแกนด้วยแอปธนาคารใดก็ได้</span>
        </div>
      </div>
      <p className="text-sm text-ink-muted">ขอบคุณที่สนับสนุนครับ 🙏</p>
    </div>
  );
}
