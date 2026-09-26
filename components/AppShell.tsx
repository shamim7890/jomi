"use client";

// components/AppShell.tsx
// পুরো অ্যাপের শেল — Provider, হেডার (স্ট্যাটাস/প্রগ্রেস/রিসেট) ও সাইডবার এখানে থাকে।
// app/layout.tsx এই কম্পোনেন্টটি ব্যবহার করে, যাতে সাইডবার সব পেজে persist করে।

import { ReactNode } from "react";
import { ChecklistProvider, useChecklist } from "@/context/ChecklistContext";
import { CHECKLIST_STEPS } from "@/lib/checklistData";
import {
  getOverallProgress,
  getOverallStatus,
  getOverallStatusMeta,
} from "@/lib/statusEngine";
import Sidebar from "./Sidebar";
import StatusBadge from "./StatusBadge";
import ProgressBar from "./ProgressBar";

interface AppShellProps {
  children: ReactNode;
}

function ShellContent({ children }: AppShellProps) {
  const { state, resetAll } = useChecklist();

  const overallStatus = getOverallStatus(CHECKLIST_STEPS, state);
  const overallStatusMeta = getOverallStatusMeta(overallStatus);
  const overallProgress = getOverallProgress(CHECKLIST_STEPS, state);

  const handleReset = () => {
    if (
      window.confirm("আপনি কি নিশ্চিত সব তথ্য মুছে নতুন করে শুরু করতে চান?")
    ) {
      resetAll();
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col">
      <header className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-gray-900">জমি ক্রয় সহায়ক</h1>
            <p className="text-sm text-gray-500">
              জমি কেনা থেকে মালিকানা পাওয়া পর্যন্ত ধাপে ধাপে গাইড
            </p>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge
              label={overallStatusMeta.label}
              colorClass={overallStatusMeta.colorClass}
            />
            <button
              type="button"
              onClick={handleReset}
              className="text-sm text-gray-400 underline underline-offset-2 hover:text-gray-600"
            >
              রিসেট করুন
            </button>
          </div>
        </div>

        <div className="mt-3">
          <ProgressBar
            completed={overallProgress.completed}
            total={overallProgress.total}
            label={`সামগ্রিক অগ্রগতি (${overallProgress.percentage}%)`}
          />
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:flex-row sm:px-6">
        <aside className="sm:w-64 sm:shrink-0">
          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <Sidebar steps={CHECKLIST_STEPS} />
          </div>
        </aside>

        <main className="flex-1 rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
          {children}
        </main>
      </div>

      <footer className="border-t border-gray-200 px-4 py-4 text-center text-xs text-gray-400 sm:px-6">
        এই অ্যাপটি একটি সহায়ক গাইড মাত্র — চূড়ান্ত সিদ্ধান্তের আগে একজন
        অভিজ্ঞ আইনজীবীর পরামর্শ নিন।
      </footer>
    </div>
  );
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <ChecklistProvider>
      <ShellContent>{children}</ShellContent>
    </ChecklistProvider>
  );
}