"use client";

// app/page.tsx
// এখন শুধু বর্তমান ধাপ (currentStep) রেন্ডার করে — হেডার ও সাইডবার
// app/layout.tsx এর মাধ্যমে components/AppShell.tsx থেকে আসে।

import { CHECKLIST_STEPS } from "@/lib/checklistData";
import { useChecklist } from "@/context/ChecklistContext";
import StepView from "@/components/StepView";

export default function HomePage() {
  const { state } = useChecklist();

  const currentStep =
    CHECKLIST_STEPS.find((step) => step.id === state.currentStep) ??
    CHECKLIST_STEPS[0];

  return <StepView step={currentStep} totalSteps={CHECKLIST_STEPS.length} />;
}