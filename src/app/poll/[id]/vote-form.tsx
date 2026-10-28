"use client";

import { useActionState } from "react";
import { voteAction, type ActionState } from "@/app/actions";
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
          className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-4 py-3 hover:border-accent has-checked:border-accent has-checked:bg-accent-soft"
        >
          <input
            type={inputType}
            name="choice"
            value={i}
            required={!poll.allowMultiple}
            className="accent-accent"
          />
          <span>{opt.text}</span>
        </label>
      ))}

      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-lg bg-accent px-4 py-2.5 font-semibold text-white hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "กำลังส่ง..." : "โหวต"}
      </button>
    </form>
  );
}
