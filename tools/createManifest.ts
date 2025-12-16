import fs from "fs";
import path from "path";
import { Manifest, Question } from "../types";
import { scanPackFiles } from "./scanFiles";

export function createManifest(
  packDir: string,
  questions: Question[]
): Manifest {
  const { files, totalSize } = scanPackFiles(packDir);

  const manifest: Manifest = {
    schemaVersion: 1,
    pack: {
      id: "topik-1-mock-01",
      type: "test",
      level: "TOPIK_I",
      title: "TOPIK I Mock Test 01",
      language: "ko",
      version: 1,
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
