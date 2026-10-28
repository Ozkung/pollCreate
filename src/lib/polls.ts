import "server-only";
import crypto from "node:crypto";
import { MongoServerError, type Collection } from "mongodb";
import { getDb } from "./db";
import {
  MAX_OPTIONS,
  MAX_OPTION_LENGTH,
  MAX_QUESTION_LENGTH,
} from "./limits";

export const VOTER_COOKIE = "voter_id";

export type PollOption = { text: string; votes: number };

type PollDoc = {
  _id: string;
  question: string;
  options: PollOption[];
  allowMultiple: boolean;
  createdAt: Date;
  totalVoters: number;
};

type VoteDoc = {
  pollId: string;
  voterId: string;
  choices: number[];
  createdAt: Date;
};

export type Poll = {
  id: string;
  question: string;
  options: PollOption[];
  allowMultiple: boolean;
  createdAt: string;
  totalVoters: number;
  myVote: number[] | null;
};

export class ValidationError extends Error {}

const DUPLICATE_KEY = 11000;

let indexesReady: Promise<unknown> | undefined;

async function collections(): Promise<{
  polls: Collection<PollDoc>;
  votes: Collection<VoteDoc>;
}> {
  const db = await getDb();
  const polls = db.collection<PollDoc>("polls");
  const votes = db.collection<VoteDoc>("votes");
  // One vote per voter per poll is enforced by the database, not just by the app.
  indexesReady ??= votes
    .createIndex({ pollId: 1, voterId: 1 }, { unique: true })
    .catch((err) => {
      indexesReady = undefined;
      throw err;
    });
  await indexesReady;
  return { polls, votes };
}

function toPublic(poll: PollDoc, myVote: number[] | null): Poll {
  return {
    id: poll._id,
    question: poll.question,
    options: poll.options,
    allowMultiple: poll.allowMultiple,
    createdAt: poll.createdAt.toISOString(),
    totalVoters: poll.totalVoters,
    myVote,
  };
}

export async function createPoll(input: {
  question: string;
  options: string[];
  allowMultiple: boolean;
}): Promise<Poll> {
  const question = input.question.trim();
  if (!question) throw new ValidationError("กรุณาใส่คำถาม");
  if (question.length > MAX_QUESTION_LENGTH) {
    throw new ValidationError(`คำถามยาวเกิน ${MAX_QUESTION_LENGTH} ตัวอักษร`);
  }

  const options = input.options.map((o) => o.trim()).filter(Boolean);
  if (options.length < 2) throw new ValidationError("ต้องมีตัวเลือกอย่างน้อย 2 ข้อ");
  if (options.length > MAX_OPTIONS) {
    throw new ValidationError(`ตัวเลือกได้ไม่เกิน ${MAX_OPTIONS} ข้อ`);
  }
  if (options.some((o) => o.length > MAX_OPTION_LENGTH)) {
    throw new ValidationError(
      `ตัวเลือกแต่ละข้อยาวได้ไม่เกิน ${MAX_OPTION_LENGTH} ตัวอักษร`,
    );
  }
  const lower = options.map((o) => o.toLowerCase());
  if (new Set(lower).size !== lower.length) {
    throw new ValidationError("มีตัวเลือกซ้ำกัน");
  }

  const { polls } = await collections();
  const poll: PollDoc = {
    _id: crypto.randomBytes(5).toString("hex"),
    question,
    options: options.map((text) => ({ text, votes: 0 })),
    allowMultiple: input.allowMultiple,
    createdAt: new Date(),
    totalVoters: 0,
  };
  await polls.insertOne(poll);
  return toPublic(poll, null);
}

export async function getPoll(id: string, voterId?: string): Promise<Poll | null> {
  const { polls, votes } = await collections();
  const [poll, vote] = await Promise.all([
    polls.findOne({ _id: id }),
    voterId ? votes.findOne({ pollId: id, voterId }) : null,
  ]);
  return poll ? toPublic(poll, vote?.choices ?? null) : null;
}

export async function votePoll(
  id: string,
  voterId: string,
  choices: number[],
): Promise<void> {
  const { polls, votes } = await collections();
  const poll = await polls.findOne({ _id: id });
  if (!poll) throw new ValidationError("ไม่พบโพลนี้");

  const unique = [...new Set(choices)];
  if (unique.length === 0) throw new ValidationError("กรุณาเลือกอย่างน้อย 1 ข้อ");
  if (!poll.allowMultiple && unique.length > 1) {
    throw new ValidationError("โพลนี้เลือกได้เพียง 1 ข้อ");
  }
  if (
    !unique.every(
      (c) => Number.isInteger(c) && c >= 0 && c < poll.options.length,
    )
  ) {
    throw new ValidationError("ตัวเลือกไม่ถูกต้อง");
  }

  // Record the vote first: the unique index rejects a second vote atomically,
  // even when two requests from the same voter race each other.
  try {
    await votes.insertOne({ pollId: id, voterId, choices: unique, createdAt: new Date() });
  } catch (err) {
    if (err instanceof MongoServerError && err.code === DUPLICATE_KEY) {
      throw new ValidationError("คุณโหวตโพลนี้ไปแล้ว");
    }
    throw err;
  }

  const inc: Record<string, number> = { totalVoters: 1 };
  unique.forEach((c) => {
    inc[`options.${c}.votes`] = 1;
  });
  try {
    await polls.updateOne({ _id: id }, { $inc: inc });
  } catch (err) {
    // Undo the vote record so the voter can retry and the counts stay consistent.
    await votes.deleteOne({ pollId: id, voterId });
    throw err;
  }
}
