import type { Section } from "./questions";

export type TestMeta = {
  level: 1 | 2;
  testNumber: number;
};

export interface EditorAudioMedia {
  type: "audio";
  file: string;
  source: "auto" | "manual";
}

export interface EditorImageMedia {
  type: "image";
  files: string[];
  source: "auto" | "manual";
}

export type EditorMedia = EditorAudioMedia | EditorImageMedia;

export type EditorQuestion = {
  id: string;
  section: Section;
  question: string;
  options: [string, string, string, string];
  correctAnswer: string;
  media: EditorMedia[];
  globalIndex: number;
};
