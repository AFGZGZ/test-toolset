import fs from "fs";
import path from "path";
import { Manifest, Question } from "../types";
import { scanPackFiles } from "./scanFiles";

export interface PackInput {
  id: string;
  title: string;
  level: string;
  version: number;
  author: string;
}

export function createManifest(packDir: string, pack: PackInput): Manifest {
  const { files, totalSize } = scanPackFiles(packDir);

  const manifest: Manifest = {
    pack: {
      ...pack,
      releasedAt: new Date().toISOString().slice(0, 10),
    },
    structure: {
      entry: "questions.json",
      audioDir: "audio",
      imageDir: "images",
    },
    files,
    integrity: { totalSize },
  };

  fs.writeFileSync(
    path.join(packDir, "manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf8"
  );

  return manifest;
}
