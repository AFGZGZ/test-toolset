export type IndexedMedia = {
  audio: string[];
  images: string[];
};

const AUDIO_EXT = [".mp3", ".wav"];
const IMAGE_EXT = [".png", ".jpg", ".jpeg", ".webp"];

export async function pickAndIndexMedia(): Promise<IndexedMedia> {
  const dirHandle = await (window as any).showDirectoryPicker();

  const audio: string[] = [];
  const images: string[] = [];

  async function walk(handle: FileSystemDirectoryHandle, prefix = "") {
    // 👇 entries() IS typed correctly
    for await (const [, entry] of handle.entries()) {
      const path = `${prefix}${entry.name}`;

      if (entry.kind === "directory") {
        await walk(entry, `${path}/`);
      } else {
        const lower = entry.name.toLowerCase();

        if (AUDIO_EXT.some((e) => lower.endsWith(e))) {
          audio.push(path);
        }

        if (IMAGE_EXT.some((e) => lower.endsWith(e))) {
          images.push(path);
        }
      }
    }
  }

  await walk(dirHandle);
  return { audio, images };
}
