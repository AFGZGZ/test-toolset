import fs from "fs";
import path from "path";
import { Question } from "../types";
import { validatePack } from "./validatePack";
import { createManifest } from "./createManifest";
import { createZip } from "./createZip";
import { promptPackInfo } from "./promptPackInfo";

const packDir = process.argv[2];
if (!packDir) {
  console.error("Usage: build-pack <packDir>");
  process.exit(1);
}

const questions: Question[] = JSON.parse(
  fs.readFileSync(path.join(packDir, "questions.json"), "utf8")
);

(async () => {
  const packInfo = await promptPackInfo();
  const manifest = createManifest(packDir, packInfo, questions.length);
  validatePack(questions, manifest.files);
  const zipPath = await createZip(packDir, packInfo.id);

  console.log("✅ Pack built successfully");
  console.log("📄 manifest.json created");
  console.log("📦 ZIP:", zipPath);
})();
