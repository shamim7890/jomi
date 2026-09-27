"use client";

// components/ChecklistItemRow.tsx

import { useState } from "react";
import { ChecklistItem, ItemAnswer } from "@/lib/types";
import GuidancePanel from "./GuidancePanel";

interface ChecklistItemRowProps {
  item: ChecklistItem;
  answer: ItemAnswer;
  note: string;
  onAnswerChange: (answer: ItemAnswer) => void;
  onNoteChange: (note: string) => void;
}

export default function ChecklistItemRow({
  item,
  answer,
  note,
  onAnswerChange,
  onNoteChange,
}: ChecklistItemRowProps) {
  const [showGuidance, setShowGuidance] = useState(false);
  const [showNote, setShowNote] = useState(note.length > 0);

  const isIssue = answer === "issue";
  const isDone = answer === "done";

  return (
    <div
      className={`rounded-lg border p-4 transition-colors ${
        isIssue
          ? "border-red-300 bg-red-50"
          : isDone
          ? "border-green-200 bg-green-50"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-900">{item.label}</p>
            {item.blocking ? (
              <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                আবশ্যক
              </span>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setShowGuidance((prev) => !prev)}
            className="mt-1 text-sm text-emerald-700 underline underline-offset-2"
          >
            {showGuidance ? "গাইডেন্স লুকান" : "কীভাবে করবেন?"}
          </button>

          {showGuidance ? <GuidancePanel guidance={item.guidance} /> : null}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onAnswerChange("done")}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            isDone
              ? "bg-emerald-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          ✓ সম্পন্ন করেছি
        </button>

        {item.canFlagIssue ? (
          <button
            type="button"
            onClick={() => onAnswerChange("issue")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              isIssue
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            ⚠ সমস্যা পাওয়া গেছে
          </button>
        ) : null}

        {answer !== "unchecked" ? (
          <button
            type="button"
            onClick={() => onAnswerChange("unchecked")}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100"
          >
            পুনরায় সেট করুন
          </button>
        ) : null}

        <button
          type="button"
          onClick={() => setShowNote((prev) => !prev)}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100"
        >
          {showNote ? "নোট লুকান" : "নোট যোগ করুন"}
        </button>
      </div>

      {showNote ? (
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="এই আইটেম সম্পর্কে নিজের নোট লিখুন..."
          className="mt-3 w-full rounded-md border border-gray-200 p-2 text-sm focus:border-emerald-500 focus:outline-none"
          rows={2}
        />
      ) : null}

      {isIssue ? (
        <p className="mt-2 text-sm font-medium text-red-700">
          এই বিষয়ে একজন অভিজ্ঞ আইনজীবীর পরামর্শ নেওয়ার আগে জমি কেনা থেকে বিরত থাকুন।
        </p>
      ) : null}
    </div>
  );
}