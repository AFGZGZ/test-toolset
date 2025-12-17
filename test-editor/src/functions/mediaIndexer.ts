export type IndexedMedia = {
  audio: string[];
  images: string[];
};

type DirectoryHandleWithValues = FileSystemDirectoryHandle & {
  values(): AsyncIterable<FileSystemHandle>;
};

const AUDIO_EXT = [".mp3", ".wav"];
const IMAGE_EXT = [".png", ".jpg", ".jpeg", ".webp"];

export async function pickAndIndexMedia(): Promise<IndexedMedia> {
  const dirHandle = await (window as any).showDirectoryPicker();
  console.log(dirHandle);
  const audio: string[] = [];
  const images: string[] = [];

  async function walk(handle: FileSystemDirectoryHandle, prefix = "") {
    // Cast ONLY values(), not the handle itself
    const entries = (handle as DirectoryHandleWithValues).values();

    for await (const entry of entries) {
      const path = `${prefix}${entry.name}`;

      if (entry.kind === "directory") {
        await walk(entry as FileSystemDirectoryHandle, `${path}/`);
        continue;
      }

      const lower = entry.name.toLowerCase();

      if (AUDIO_EXT.some((ext) => lower.endsWith(ext))) {
        audio.push(path);
      }

      if (IMAGE_EXT.some((ext) => lower.endsWith(ext))) {
        images.push(path);
      }
    }
  }

  await walk(dirHandle);
  return { audio, images };
}
