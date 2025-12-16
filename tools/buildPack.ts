import fs from "fs";
import path from "path";
import { Question } from "../types";
import { validatePack } from "./validatePack";
import { createManifest } from "./createManifest";
import { createZip } from "./createZip";

const packDir = process.argv[2];
if (!packDir) {
  console.error("Usage: build-pack <packDir>");
  process.exit(1);
}

const questions: Question[] = JSON.parse(
  fs.readFileSync(path.join(packDir, "questions.json"), "utf8")
);

(async () => {
  const manifest = createManifest(packDir, questions);
  validatePack(questions, manifest.files);
  const zipPath = await createZip(packDir);

  console.log("✅ Pack built successfully");
  console.log("📄 manifest.json created");
  console.log("📦 ZIP:", zipPath);
})();
