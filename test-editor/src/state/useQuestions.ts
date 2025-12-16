import { useReducer } from "react";
import type { Question } from "../schema/questionSchema";

type Action =
  | { type: "add" }
  | { type: "update"; index: number; question: Question }
  | { type: "remove"; index: number }
  | { type: "load"; questions: Question[] };

function reducer(state: Question[], action: Action): Question[] {
  switch (action.type) {
    case "add":
      return [
        ...state,
        {
          id: "",
          question: "",
          options: ["", "", "", ""],
          correctAnswer: "",
          routes: [],
        },
      ];
    case "update": {
      const next = [...state];
      next[action.index] = action.question;
      return next;
    }
    case "remove":
      return state.filter((_, i) => i !== action.index);
    case "load":
      return action.questions;
    default:
      return state;
  }
}

export function useQuestions() {
  return useReducer(reducer, [] as Question[]);
}
