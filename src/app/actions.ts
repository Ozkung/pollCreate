"use server";

import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import {
  createPoll,
  votePoll,
  ValidationError,
  VOTER_COOKIE,
} from "@/lib/polls";

export type ActionState = { error: string | null };

export async function createPollAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let id: string;
  try {
    const poll = await createPoll({
      question: String(formData.get("question") ?? ""),
      options: formData.getAll("option").map(String),
      allowMultiple: formData.get("allowMultiple") === "on",
    });
    id = poll.id;
  } catch (err) {
    if (err instanceof ValidationError) return { error: err.message };
    throw err;
  }
  redirect(`/poll/${id}`);
}

export async function voteAction(
  pollId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const cookieStore = await cookies();
  let voterId = cookieStore.get(VOTER_COOKIE)?.value;
  if (!voterId || !/^[a-f0-9]{32}$/.test(voterId)) {
    voterId = crypto.randomBytes(16).toString("hex");
    cookieStore.set(VOTER_COOKIE, voterId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  try {
    await votePoll(pollId, voterId, formData.getAll("choice").map(Number));
  } catch (err) {
    if (err instanceof ValidationError) return { error: err.message };
    throw err;
  }
  refresh();
  return { error: null };
}
