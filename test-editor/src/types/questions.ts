export type Section = "listening" | "reading";

export interface AudioMedia {
  type: "audio";
  file: string;
}

export interface ImageMedia {
  type: "image";
  files: string[];
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
