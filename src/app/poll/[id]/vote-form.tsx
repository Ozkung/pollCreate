"use client";

import { useActionState } from "react";
import { voteAction, type ActionState } from "@/app/actions";
import { FormError } from "@/app/form-error";
import { catStyle } from "@/lib/colors";
import type { Poll } from "@/lib/polls";

const initialState: ActionState = { error: null };

export function VoteForm({ poll }: { poll: Poll }) {
  const [state, formAction, pending] = useActionState(
    voteAction.bind(null, poll.id),
    initialState,
  );
  const inputType = poll.allowMultiple ? "checkbox" : "radio";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {poll.options.map((opt, i) => (
        <label
          key={i}
          style={catStyle(i)}
          className="group box lift flex min-h-14 cursor-pointer items-center gap-3 px-4 py-3 has-checked:bg-cat has-checked:font-semibold has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent"
        >
          <input
            type={inputType}
            name="choice"
            value={i}
            required={!poll.allowMultiple}
            className="sr-only"
          />
          <span className="num">{i + 1}</span>
          <span className="flex-1">{opt.text}</span>
          <span aria-hidden className="hidden text-xl font-extrabold group-has-checked:inline">
            ✓
          </span>
        </label>
      ))}

      <FormError message={state.error} />

      <button type="submit" disabled={pending} className="btn btn-primary mt-2 self-start">
        {pending ? "กำลังส่ง…" : "โหวต →"}
      </button>
    </form>
  );
}
