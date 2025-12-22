import fs from "fs";
import path from "path";
import archiver from "archiver";

export async function createZip(
  packDir: string,
  packId: string,
  outDir = "./dist"
): Promise<string> {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  // const zipPath = path.join(outDir, path.basename(packDir) + ".zip");
  const zipName = `${packId}.zip`;
  // const zipPath = path.join(packDir, "..", zipName);
  const zipPath = path.join(outDir, zipName);

  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.pipe(output);
  archive.directory(packDir, false);
  await archive.finalize();

  return zipPath;
}
