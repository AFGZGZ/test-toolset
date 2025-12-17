import type { EditorQuestion } from "../types/test";
import type { MediaIndex } from "../types/media";
import type { AudioMedia, ImageMedia } from "../types/questions";

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

    const existingAudio = q.media.find(
      (m) => m.type === "audio" && m.source === "manual"
    );

    const existingImages = q.media.find(
      (m) => m.type === "image" && m.source === "manual"
    );

    const audioMatch = media.audio.find((a) => matchesId(a, q.id));
    const imageMatches = media.images.filter((img) => matchesId(img, q.id));

    return {
      ...q,
      media: [
        ...(existingAudio
          ? [existingAudio]
          : audioMatch
          ? [
              {
                type: "audio",
                file: audioMatch,
                source: "auto",
              } as AudioMedia,
            ]
          : []),

        ...(existingImages
          ? [existingImages]
          : imageMatches.length
          ? [
              {
                type: "image",
                files: imageMatches,
                source: "auto",
              } as ImageMedia,
            ]
          : []),
      ],
    };
  });
}
