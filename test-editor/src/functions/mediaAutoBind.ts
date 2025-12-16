import type { EditorQuestion } from "../types/test";
import type { MediaIndex } from "../types/media";
import type { Media } from "../types/questions";

const baseName = (path: string) =>
  path
    .split("/")
    .pop()!
    .replace(/\.[^.]+$/, "");

const matchesId = (file: string, id: string) => {
  const name = baseName(file);
  return name === id || name.startsWith(`${id}_`) || name.startsWith(`${id}-`);
};

export function autoBindMedia(
  questions: EditorQuestion[],
  media: MediaIndex
): EditorQuestion[] {
  return questions.map((q) => {
    if (!q.id) return q;

    const resultMedia: Media[] = [];

    const audioMatch = media.audio.find((a) => matchesId(a, q.id));
    if (audioMatch) {
      resultMedia.push({
        type: "audio",
        file: audioMatch,
      });
    }

    const imageMatches = media.images.filter((img) => matchesId(img, q.id));
    if (imageMatches.length) {
      resultMedia.push({
        type: "image",
        files: imageMatches,
      });
    }

    return {
      ...q,
      media: resultMedia.length ? resultMedia : [],
    };
  });
}
