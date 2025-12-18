import { ManifestFile, Question } from "../types";

export function validatePack(
  questions: Question[],
  files: ManifestFile[]
): void {
  const fileSet = new Set(files.map((f) => f.path));
  const errors: string[] = [];

  for (const q of questions) {
    if (!q.media) continue;

    for (const media of q.media) {
      for (const file of media.files) {
        if (!fileSet.has(file)) {
          errors.push(
            `Missing ${media.type} file for question "${q.id}": ${file}`
          );
        }
      }
    }
  }

  if (errors.length > 0) {
    throw new Error("Pack validation failed:\n" + errors.join("\n"));
  }
}
