// lib/statusEngine.ts
// সম্পূর্ণ টাইপ-সেফ স্ট্যাটাস ইঞ্জিন। "any" ব্যবহার করা হয়নি।

import {
  ChecklistItem,
  ChecklistState,
  ChecklistStep,
  ItemAnswerMap,
  OverallStatus,
  StepProgress,
  StepStatus,
} from "./types";

/** একটি নির্দিষ্ট আইটেমে "সমস্যা পাওয়া গেছে" চিহ্নিত করা আছে কিনা */
function isFlagged(item: ChecklistItem, answers: ItemAnswerMap): boolean {
  return item.canFlagIssue && answers[item.id] === "issue";
}

/** একটি স্টেপের ভেতরে কোনো red-flag আইটেম আছে কিনা */
export function stepHasIssue(step: ChecklistStep, answers: ItemAnswerMap): boolean {
  return step.items.some((item) => isFlagged(item, answers));
}

/** একটি স্টেপের progress (কতগুলো blocking আইটেম সম্পন্ন হয়েছে) */
export function getStepProgress(
  step: ChecklistStep,
  state: ChecklistState
): StepProgress {
  const total = step.items.length;
  const completed = step.items.filter(
    (item) => state.answers[item.id] === "done"
  ).length;

  const status = getStepStatus(step, state);

  return { completed, total, status };
}

/** একটি স্টেপের স্ট্যাটাস নির্ণয় করে */
export function getStepStatus(step: ChecklistStep, state: ChecklistState): StepStatus {
  if (stepHasIssue(step, state.answers)) {
    return "at_risk";
  }

  const answeredCount = step.items.filter(
    (item) => state.answers[item.id] && state.answers[item.id] !== "unchecked"
  ).length;

  if (answeredCount === 0) {
    return "not_started";
  }

  const blockingItems = step.items.filter((item) => item.blocking);
  const allBlockingDone = blockingItems.every(
    (item) => state.answers[item.id] === "done"
  );

  if (allBlockingDone && answeredCount === step.items.length) {
    return "complete";
  }

  if (allBlockingDone) {
    return "complete";
  }

  return "in_progress";
}

/** পুরো কেসের সামগ্রিক অবস্থা নির্ণয় করে */
export function getOverallStatus(
  steps: ChecklistStep[],
  state: ChecklistState
): OverallStatus {
  const anyRedFlag = steps.some((step) => stepHasIssue(step, state.answers));
  if (anyRedFlag) {
    return "red_flag";
  }

  const stepStatuses = steps.map((step) => getStepStatus(step, state));

  const allComplete = stepStatuses.every((status) => status === "complete");
  if (allComplete) {
    return "ready";
  }

  const noneStarted = stepStatuses.every((status) => status === "not_started");
  if (noneStarted) {
    return "not_started";
  }

  return "in_progress";
}

/** সামগ্রিক স্ট্যাটাস অনুযায়ী বাংলা লেবেল ও রং */
export function getOverallStatusMeta(status: OverallStatus): {
  label: string;
  colorClass: string;
} {
  switch (status) {
    case "ready":
      return {
        label: "মালিকানা পাওয়ার যোগ্য",
        colorClass: "bg-green-100 text-green-800 border-green-300",
      };
    case "red_flag":
      return {
        label: "কেনা থেকে বিরত থাকার পরামর্শ",
        colorClass: "bg-red-100 text-red-800 border-red-300",
      };
    case "at_risk":
      return {
        label: "এখনো ঝুঁকি আছে, বাকি ধাপগুলো শেষ করুন",
        colorClass: "bg-yellow-100 text-yellow-800 border-yellow-300",
      };
    case "in_progress":
      return {
        label: "প্রক্রিয়া চলমান",
        colorClass: "bg-blue-100 text-blue-800 border-blue-300",
      };
    case "not_started":
    default:
      return {
        label: "শুরু হয়নি",
        colorClass: "bg-gray-100 text-gray-700 border-gray-300",
      };
  }
}

/** স্টেপ স্ট্যাটাস অনুযায়ী বাংলা লেবেল ও রং */
export function getStepStatusMeta(status: StepStatus): {
  label: string;
  colorClass: string;
} {
  switch (status) {
    case "complete":
      return {
        label: "সম্পন্ন",
        colorClass: "bg-green-100 text-green-800 border-green-300",
      };
    case "at_risk":
      return {
        label: "সমস্যা পাওয়া গেছে",
        colorClass: "bg-red-100 text-red-800 border-red-300",
      };
    case "in_progress":
      return {
        label: "চলমান",
        colorClass: "bg-blue-100 text-blue-800 border-blue-300",
      };
    case "not_started":
    default:
      return {
        label: "শুরু হয়নি",
        colorClass: "bg-gray-100 text-gray-700 border-gray-300",
      };
  }
}

/** সামগ্রিক অগ্রগতি (সব ধাপ মিলিয়ে কতটুকু সম্পন্ন হয়েছে) */
export function getOverallProgress(
  steps: ChecklistStep[],
  state: ChecklistState
): { completed: number; total: number; percentage: number } {
  const total = steps.reduce((sum, step) => sum + step.items.length, 0);
  const completed = steps.reduce((sum, step) => {
    const doneInStep = step.items.filter(
      (item) => state.answers[item.id] === "done"
    ).length;
    return sum + doneInStep;
  }, 0);

  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { completed, total, percentage };
}