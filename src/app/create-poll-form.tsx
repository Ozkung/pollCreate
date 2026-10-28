"use client";

import { useActionState, useState } from "react";
import { createPollAction, type ActionState } from "./actions";
import {
  MAX_OPTIONS,
  MAX_OPTION_LENGTH,
  MAX_QUESTION_LENGTH,
} from "@/lib/limits";
import { catStyle } from "@/lib/colors";
import { FormError } from "./form-error";

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
    <form action={formAction} className="flex flex-col gap-6">
      <label className="flex flex-col gap-2">
        <span className="font-heading font-bold">คำถาม</span>
        <input
          name="question"
          required
          maxLength={MAX_QUESTION_LENGTH}
          placeholder="เช่น มื้อเที่ยงวันนี้กินอะไรดี?"
          className="field"
        />
      </label>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 font-heading font-bold">ตัวเลือก</legend>
        {options.map((opt, i) => (
          <div key={opt.key} className="flex items-center gap-3">
            <span className="num" style={catStyle(i)} aria-hidden>
              {i + 1}
            </span>
            <input
              name="option"
              value={opt.value}
              onChange={(e) => updateOption(opt.key, e.target.value)}
              required={i < 2}
              maxLength={MAX_OPTION_LENGTH}
              placeholder={`ตัวเลือกที่ ${i + 1}`}
              aria-label={`ตัวเลือกที่ ${i + 1}`}
              className="field flex-1"
            />
            {options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(opt.key)}
                aria-label={`ลบตัวเลือกที่ ${i + 1}`}
                className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border-2 border-ink bg-surface font-bold transition-colors duration-[180ms] hover:bg-cat"
                style={catStyle(1)}
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
            className="link self-start py-2"
          >
            + เพิ่มตัวเลือก
          </button>
        )}
      </fieldset>

      <label className="flex items-center gap-3 font-medium">
        <input type="checkbox" name="allowMultiple" className="size-5 accent-accent" />
        อนุญาตให้เลือกได้หลายข้อ
      </label>

      <FormError message={state.error} />

      <button type="submit" disabled={pending} className="btn btn-primary self-start">
        {pending ? "กำลังสร้าง…" : "สร้างโพล →"}
      </button>
    </form>
  );
}
