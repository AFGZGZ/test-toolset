export type FileType = "audio" | "image" | "json";

export interface ManifestFile {
  path: string;
  type: FileType;
  size: number;
}

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

interface PackMeta {
  id: string;
  title: string;
  level: string;
  version: number;
  releasedAt: string;
  author: string;
}

export interface Manifest {
  pack: PackMeta;
  structure: {
    entry: string;
    audioDir: string;
    imageDir: string;
  };
  files: ManifestFile[];
  integrity: {
    totalSize: number;
  };
}
