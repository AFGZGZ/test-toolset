export type Section = "listening" | "reading";

export interface AudioMedia {
  type: "audio";
  file: string;
  source: "auto" | "manual";
}

export interface ImageMedia {
  type: "image";
  files: string[];
  source: "auto" | "manual";
}

export type Media = AudioMedia | ImageMedia;

export interface Question {
  id: string;
  section: Section;
  question: string;
  options: [string, string, string, string];
  correctAnswer: string;
  media: Media[];
}
