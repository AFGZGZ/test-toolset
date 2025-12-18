export type Section = "listening" | "reading";

export interface AudioMedia {
  type: "audio";
  files: string[];
}

export interface ImageMedia {
  type: "image";
  files: string[];
}

export type Media = AudioMedia | ImageMedia;

export interface Question {
  id: string;
  section: Section;
  title?: string;
  question: string;
  additional?: string;
  options: [string, string, string, string];
  correctAnswer: string;
  media: Media[];
}
