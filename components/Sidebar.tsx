"use client";

// components/Sidebar.tsx

import { ChecklistStep } from "@/lib/types";
import { useChecklist } from "@/context/ChecklistContext";
import { getStepStatus, getStepStatusMeta } from "@/lib/statusEngine";

interface SidebarProps {
  steps: ChecklistStep[];
}

export default function Sidebar({ steps }: SidebarProps) {
  const { state, dispatch } = useChecklist();

  return (
    <nav className="flex flex-col gap-1">
      {steps.map((step) => {
        const status = getStepStatus(step, state);
        const statusMeta = getStepStatusMeta(status);
        const isActive = state.currentStep === step.id;

        return (
          <button
            key={step.id}
            type="button"
            onClick={() => dispatch({ type: "SET_STEP", step: step.id })}
            className={`flex items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
              isActive
                ? "bg-emerald-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span>
              {step.id}. {step.shortTitle}
            </span>
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                status === "complete"
                  ? "bg-green-500"
                  : status === "at_risk"
                  ? "bg-red-500"
                  : status === "in_progress"
                  ? "bg-blue-500"
                  : "bg-gray-300"
              } ${isActive ? "ring-2 ring-white" : ""}`}
              title={statusMeta.label}
            />
          </button>
        );
      })}
    </nav>
  );
}