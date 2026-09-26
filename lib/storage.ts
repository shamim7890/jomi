// lib/storage.ts
// localStorage এ টাইপ-সেফভাবে state সংরক্ষণ ও পড়ার জন্য। "any" ব্যবহার করা হয়নি।

import { ChecklistState, ItemAnswer, ItemAnswerMap, ItemNoteMap } from "./types";

const STORAGE_KEY = "land-purchase-checklist-state-v1";

export function createInitialState(): ChecklistState {
  return {
    answers: {},
    notes: {},
    currentStep: 1,
    updatedAt: new Date().toISOString(),
  };
}

const VALID_ANSWERS: readonly ItemAnswer[] = ["unchecked", "done", "issue"];

function isItemAnswer(value: unknown): value is ItemAnswer {
  return typeof value === "string" && (VALID_ANSWERS as readonly string[]).includes(value);
}

function isItemAnswerMap(value: unknown): value is ItemAnswerMap {
  if (typeof value !== "object" || value === null) return false;
  return Object.values(value as Record<string, unknown>).every(isItemAnswer);
}

function isItemNoteMap(value: unknown): value is ItemNoteMap {
  if (typeof value !== "object" || value === null) return false;
  return Object.values(value as Record<string, unknown>).every(
    (v) => typeof v === "string"
  );
}

/** unknown ডেটাকে রানটাইমে যাচাই করে ChecklistState কিনা নিশ্চিত করে */
export function isChecklistState(value: unknown): value is ChecklistState {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;

  return (
    isItemAnswerMap(candidate.answers) &&
    isItemNoteMap(candidate.notes) &&
    typeof candidate.currentStep === "number" &&
    typeof candidate.updatedAt === "string"
  );
}

/** localStorage থেকে state লোড করে; না থাকলে বা ভুল হলে নতুন state দেয় */
export function loadState(): ChecklistState {
  if (typeof window === "undefined") {
    return createInitialState();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createInitialState();
    }

    const parsed: unknown = JSON.parse(raw);
    if (isChecklistState(parsed)) {
      return parsed;
    }

    return createInitialState();
  } catch {
    return createInitialState();
  }
}

/** state কে localStorage এ সংরক্ষণ করে */
export function saveState(state: ChecklistState): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage ব্যবহার করা না গেলেও অ্যাপ ভেঙে পড়বে না
  }
}

/** সংরক্ষিত সব ডেটা মুছে ফেলে */
export function clearState(): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}