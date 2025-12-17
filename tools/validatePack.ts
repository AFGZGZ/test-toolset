import { ManifestFile, Question } from "../types";

export function validatePack(
  questions: Question[],
  files: ManifestFile[]
): void {
  const fileSet = new Set(files.map((f) => f.path));
  const errors: string[] = [];

  for (const q of questions) {
    if (!q.routes) continue;

    for (const r of q.routes) {
      if (!fileSet.has(r.route)) {
        errors.push(`Missing file for question "${q.id}": ${r.route}`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error("Pack validation failed:\n" + errors.join("\n"));
  }
}
