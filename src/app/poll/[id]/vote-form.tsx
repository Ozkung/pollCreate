"use client";

import { useActionState } from "react";
import { voteAction, type ActionState } from "@/app/actions";
import { FormError } from "@/app/form-error";
import type { Poll } from "@/lib/polls";

const initialState: ActionState = { error: null };

export function VoteForm({ poll }: { poll: Poll }) {
  const [state, formAction, pending] = useActionState(
    voteAction.bind(null, poll.id),
    initialState,
  );
  const inputType = poll.allowMultiple ? "checkbox" : "radio";

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {poll.options.map((opt, i) => (
        <label
          key={i}
          className="flex min-h-11 cursor-pointer items-center gap-3 border border-border px-4 py-3 transition-colors duration-200 ease-out hover:bg-surface has-checked:bg-surface-raised has-checked:font-bold"
        >
          <input
            type={inputType}
            name="choice"
            value={i}
            required={!poll.allowMultiple}
            className="size-4 accent-foreground"
          />
          <span>{opt.text}</span>
        </label>
      ))}

      <FormError message={state.error} />

      <button type="submit" disabled={pending} className="btn btn-strong mt-3">
        {pending ? "กำลังส่ง…" : "โหวต →"}
      </button>
    </form>
  );
}
