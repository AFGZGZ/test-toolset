import type { Section } from "./questions";

export interface EditorAudioMedia {
  type: "audio";
  files: string[];
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
  title?: string;
  question: string;
  additional?: string;
  options: [string, string, string, string];
  correctAnswer: string;
  media: EditorMedia[];
  globalIndex: number;
};
