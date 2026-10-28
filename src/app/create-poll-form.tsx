"use client";

import { useActionState, useState } from "react";
import { createPollAction, type ActionState } from "./actions";
import {
  MAX_OPTIONS,
  MAX_OPTION_LENGTH,
  MAX_QUESTION_LENGTH,
} from "@/lib/limits";

const initialState: ActionState = { error: null };

let nextKey = 0;
const newOption = () => ({ key: nextKey++, value: "" });

export function CreatePollForm() {
  const [state, formAction, pending] = useActionState(
    createPollAction,
    initialState,
  );
  const [options, setOptions] = useState(() => [newOption(), newOption()]);

  const updateOption = (key: number, value: string) =>
    setOptions((opts) => opts.map((o) => (o.key === key ? { ...o, value } : o)));
  const removeOption = (key: number) =>
    setOptions((opts) => opts.filter((o) => o.key !== key));

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">คำถาม</span>
        <input
          name="question"
          required
          maxLength={MAX_QUESTION_LENGTH}
          placeholder="เช่น มื้อเที่ยงวันนี้กินอะไรดี?"
          className="rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
        />
      </label>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">ตัวเลือก</legend>
        {options.map((opt, i) => (
          <div key={opt.key} className="flex gap-2">
            <input
              name="option"
              value={opt.value}
              onChange={(e) => updateOption(opt.key, e.target.value)}
              required={i < 2}
              maxLength={MAX_OPTION_LENGTH}
              placeholder={`ตัวเลือกที่ ${i + 1}`}
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
            />
            {options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(opt.key)}
                aria-label={`ลบตัวเลือกที่ ${i + 1}`}
                className="rounded-lg px-3 text-muted hover:bg-accent-soft hover:text-danger"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        {options.length < MAX_OPTIONS && (
          <button
            type="button"
            onClick={() => setOptions((opts) => [...opts, newOption()])}
            className="self-start rounded-lg px-2 py-1 text-sm font-medium text-accent hover:bg-accent-soft"
          >
            + เพิ่มตัวเลือก
          </button>
        )}
      </fieldset>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="allowMultiple" className="accent-accent" />
        อนุญาตให้เลือกได้หลายข้อ
      </label>

      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-accent px-4 py-2.5 font-semibold text-white hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "กำลังสร้าง..." : "สร้างโพล"}
      </button>
    </form>
  );
}
