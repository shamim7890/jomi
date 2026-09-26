// lib/types.ts
// সব টাইপ এখানে সংজ্ঞায়িত করা হয়েছে। কোথাও "any" ব্যবহার করা হয়নি।

/** একটি চেকলিস্ট আইটেমের সম্ভাব্য উত্তর */
export type ItemAnswer = "unchecked" | "done" | "issue";

/** একটি ধাপ (Step) এর অবস্থা */
export type StepStatus = "not_started" | "in_progress" | "complete" | "at_risk";

/** পুরো কেসের সামগ্রিক অবস্থা */
export type OverallStatus =
  | "not_started"
  | "in_progress"
  | "ready"
  | "at_risk"
  | "red_flag";

/** একটি চেকলিস্ট আইটেম */
export interface ChecklistItem {
  /** স্টেপের ভেতরে ইউনিক আইডি, যেমন "step1-1" */
  id: string;
  /** ইউজারকে দেখানো লেবেল টেক্সট */
  label: string;
  /** "কীভাবে করবেন" গাইডেন্স টেক্সট */
  guidance: string;
  /** true হলে এই আইটেম সম্পন্ন না হলে স্টেপ "complete" ধরা হবে না */
  blocking: boolean;
  /**
   * true হলে ইউজার এই আইটেমে "সমস্যা পাওয়া গেছে" বলে চিহ্নিত করতে পারবে,
   * যা সাথে সাথে পুরো কেসকে "red_flag" করে দেবে।
   * (যেমন: "মামলা আছে কিনা", "বন্ধক আছে কিনা")
   */
  canFlagIssue: boolean;
}

/** একটি ধাপ (৮টি ধাপের একটি) */
export interface ChecklistStep {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  items: ChecklistItem[];
}

/** itemId -> উত্তর ম্যাপ */
export type ItemAnswerMap = Record<string, ItemAnswer>;

/** itemId -> নোট টেক্সট ম্যাপ */
export type ItemNoteMap = Record<string, string>;

/** পুরো অ্যাপের persisted state */
export interface ChecklistState {
  answers: ItemAnswerMap;
  notes: ItemNoteMap;
  currentStep: number;
  /** কবে শেষবার সংরক্ষণ করা হয়েছে (ISO string) */
  updatedAt: string;
}

/** একটি স্টেপের progress সারাংশ */
export interface StepProgress {
  completed: number;
  total: number;
  status: StepStatus;
}