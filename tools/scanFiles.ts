import fs from "fs";
import path from "path";
import { ManifestFile, FileType } from "./types";

export function scanPackFiles(packDir: string): {
  files: ManifestFile[];
  totalSize: number;
} {
  function walk(dir: string): string[] {
    return fs.readdirSync(dir).flatMap((file) => {
      const full = path.join(dir, file);
      return fs.statSync(full).isDirectory() ? walk(full) : [full];
    });
  }

  let totalSize = 0;

  const files: ManifestFile[] = walk(packDir)
    .filter((f) => !f.endsWith("manifest.json"))
    .map((file) => {
      const stat = fs.statSync(file);

      const relPath = path.relative(packDir, file).replace(/\\/g, "/");

      const ext = path.extname(file).toLowerCase();

      let type: FileType = "json";
      if ([".mp3", ".wav"].includes(ext)) type = "audio";
      if ([".png", ".jpg", ".jpeg", ".webp"].includes(ext)) type = "image";

      totalSize += stat.size;

      return {
        path: relPath,
        type,
        size: stat.size,
      };
    });

  return { files, totalSize };
}
