import "server-only";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {
  MAX_OPTIONS,
  MAX_OPTION_LENGTH,
  MAX_QUESTION_LENGTH,
} from "./limits";

export const VOTER_COOKIE = "voter_id";

export type PollOption = { text: string; votes: number };

type StoredPoll = {
  id: string;
  question: string;
  options: PollOption[];
  allowMultiple: boolean;
  createdAt: string;
  voters: Record<string, number[]>;
};

export type Poll = Omit<StoredPoll, "voters"> & {
  totalVoters: number;
  myVote: number[] | null;
};

export class ValidationError extends Error {}

const DATA_FILE = path.join(process.cwd(), "data", "polls.json");

function load(): Record<string, StoredPoll> {
  if (!fs.existsSync(DATA_FILE)) return {};
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function save(polls: Record<string, StoredPoll>) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  const tmp = `${DATA_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(polls, null, 2));
  fs.renameSync(tmp, DATA_FILE);
}

function toPublic(poll: StoredPoll, voterId?: string): Poll {
  const { voters, ...rest } = poll;
  return {
    ...rest,
    totalVoters: Object.keys(voters).length,
    myVote: (voterId && voters[voterId]) || null,
  };
}

export function createPoll(input: {
  question: string;
  options: string[];
  allowMultiple: boolean;
}): Poll {
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

  const polls = load();
  const id = crypto.randomBytes(5).toString("hex");
  polls[id] = {
    id,
    question,
    options: options.map((text) => ({ text, votes: 0 })),
    allowMultiple: input.allowMultiple,
    createdAt: new Date().toISOString(),
    voters: {},
  };
  save(polls);
  return toPublic(polls[id]);
}

export function getPoll(id: string, voterId?: string): Poll | null {
  const poll = load()[id];
  return poll ? toPublic(poll, voterId) : null;
}

export function votePoll(id: string, voterId: string, choices: number[]): Poll {
  const polls = load();
  const poll = polls[id];
  if (!poll) throw new ValidationError("ไม่พบโพลนี้");
  if (poll.voters[voterId]) throw new ValidationError("คุณโหวตโพลนี้ไปแล้ว");

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

  unique.forEach((c) => {
    poll.options[c].votes += 1;
  });
  poll.voters[voterId] = unique;
  save(polls);
  return toPublic(poll, voterId);
}
