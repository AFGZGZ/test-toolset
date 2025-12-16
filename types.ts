export type FileType = "audio" | "image" | "json";

export interface ManifestFile {
  path: string; // relative to pack root
  type: FileType;
  size: number; // bytes
}

export type RouteType = "mp3" | "img";

export interface QuestionRoute {
  type: RouteType;
  route: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  routes?: QuestionRoute[];
}

export interface Manifest {
  schemaVersion: number;
  pack: {
    id: string;
    type: "test" | "lesson";
    level: string;
    title: string;
    language: string;
    version: number;
    releasedAt: string;
  };
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
