import type { Question } from "./questions";

export type TestMeta = {
  level: 1 | 2;
  testNumber: number;
};

export type EditorQuestion = Question & {
  index: number;
};
