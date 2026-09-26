"use client";

// context/ChecklistContext.tsx
// গ্লোবাল স্টেট ম্যানেজমেন্ট — useReducer দিয়ে। "any" ব্যবহার করা হয়নি।

import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { ChecklistState, ItemAnswer } from "@/lib/types";
import { createInitialState, loadState, saveState, clearState } from "@/lib/storage";

type Action =
  | { type: "SET_ANSWER"; itemId: string; answer: ItemAnswer }
  | { type: "SET_NOTE"; itemId: string; note: string }
  | { type: "SET_STEP"; step: number }
  | { type: "LOAD_STATE"; state: ChecklistState }
  | { type: "RESET" };

function reducer(state: ChecklistState, action: Action): ChecklistState {
  switch (action.type) {
    case "SET_ANSWER":
      return {
        ...state,
        answers: { ...state.answers, [action.itemId]: action.answer },
        updatedAt: new Date().toISOString(),
      };
    case "SET_NOTE":
      return {
        ...state,
        notes: { ...state.notes, [action.itemId]: action.note },
        updatedAt: new Date().toISOString(),
      };
    case "SET_STEP":
      return {
        ...state,
        currentStep: action.step,
      };
    case "LOAD_STATE":
      return action.state;
    case "RESET":
      return createInitialState();
    default:
      return state;
  }
}

interface ChecklistContextValue {
  state: ChecklistState;
  dispatch: Dispatch<Action>;
  resetAll: () => void;
}

const ChecklistContext = createContext<ChecklistContextValue | null>(null);

export function ChecklistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  // প্রথমবার mount হওয়ার সময় localStorage থেকে state লোড করা
  useEffect(() => {
    const loaded = loadState();
    dispatch({ type: "LOAD_STATE", state: loaded });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // state পরিবর্তন হলেই localStorage এ সংরক্ষণ করা
  useEffect(() => {
    saveState(state);
  }, [state]);

  const resetAll = () => {
    clearState();
    dispatch({ type: "RESET" });
  };

  const value = useMemo(
    () => ({ state, dispatch, resetAll }),
    [state]
  );

  return (
    <ChecklistContext.Provider value={value}>
      {children}
    </ChecklistContext.Provider>
  );
}

export function useChecklist(): ChecklistContextValue {
  const ctx = useContext(ChecklistContext);
  if (!ctx) {
    throw new Error("useChecklist অবশ্যই ChecklistProvider এর ভেতরে ব্যবহার করতে হবে");
  }
  return ctx;
}