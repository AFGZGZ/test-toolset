import type { Section } from "./questions";

export type TestMeta = {
  level: 1 | 2;
  testNumber: number;
};

export type EditorMedia =
  | { type: "audio"; file: string; source: "auto" | "manual" }
  | { type: "image"; files: string[]; source: "auto" | "manual" };

export type EditorQuestion = {
  id: string;
  section: Section;
  question: string;
  options: [string, string, string, string];
  correctAnswer: string;
  media: EditorMedia[];
  index: number;
};
