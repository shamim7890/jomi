"use client";

// components/StepView.tsx

import { ChecklistStep, ItemAnswer } from "@/lib/types";
import { useChecklist } from "@/context/ChecklistContext";
import { getStepProgress, getStepStatusMeta } from "@/lib/statusEngine";
import ChecklistItemRow from "./ChecklistItemRow";
import ProgressBar from "./ProgressBar";
import StatusBadge from "./StatusBadge";

interface StepViewProps {
  step: ChecklistStep;
  totalSteps: number;
}

export default function StepView({ step, totalSteps }: StepViewProps) {
  const { state, dispatch } = useChecklist();

  const progress = getStepProgress(step, state);
  const statusMeta = getStepStatusMeta(progress.status);

  const handleAnswerChange = (itemId: string, answer: ItemAnswer) => {
    dispatch({ type: "SET_ANSWER", itemId, answer });
  };

  const handleNoteChange = (itemId: string, note: string) => {
    dispatch({ type: "SET_NOTE", itemId, note });
  };

  const goToStep = (targetStep: number) => {
    if (targetStep < 1 || targetStep > totalSteps) return;
    dispatch({ type: "SET_STEP", step: targetStep });
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm text-gray-500">
            ধাপ {step.id} / {totalSteps}
          </p>
          <h2 className="text-xl font-bold text-gray-900">{step.title}</h2>
        </div>
        <StatusBadge label={statusMeta.label} colorClass={statusMeta.colorClass} />
      </div>

      <p className="mb-4 text-sm text-gray-600">{step.description}</p>

      <div className="mb-6">
        <ProgressBar completed={progress.completed} total={progress.total} />
      </div>

      <div className="flex flex-col gap-3">
        {step.items.map((item) => (
          <ChecklistItemRow
            key={item.id}
            item={item}
            answer={state.answers[item.id] ?? "unchecked"}
            note={state.notes[item.id] ?? ""}
            onAnswerChange={(answer) => handleAnswerChange(item.id, answer)}
            onNoteChange={(note) => handleNoteChange(item.id, note)}
          />
        ))}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={() => goToStep(step.id - 1)}
          disabled={step.id === 1}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← আগের ধাপ
        </button>
        <button
          type="button"
          onClick={() => goToStep(step.id + 1)}
          disabled={step.id === totalSteps}
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          পরের ধাপ →
        </button>
      </div>
    </div>
  );
}