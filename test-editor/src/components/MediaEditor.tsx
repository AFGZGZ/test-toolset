import type { Media } from "../types/questions";
import { useMedia } from "../context/MediaContext";

interface Props {
  section: "listening" | "reading";
  media?: Media[];
  onChange: (media: Media[]) => void;
}

export function MediaEditor({ section, media = [], onChange }: Props) {
  const { media: indexed } = useMedia();

  const audio = media.find((m) => m.type === "audio") as
    | { type: "audio"; file: string }
    | undefined;

  const images = media.find((m) => m.type === "image") as
    | { type: "image"; files: string[] }
    | undefined;

  const updateAudio = (file: string) => {
    const next = media.filter((m) => m.type !== "audio");
    onChange([...next, { type: "audio", file }]);
  };

  const removeAudio = () => {
    onChange(media.filter((m) => m.type !== "audio"));
  };

  const updateImages = (files: string[]) => {
    const next = media.filter((m) => m.type !== "image");
    if (files.length > 0) {
      onChange([...next, { type: "image", files }]);
    } else {
      onChange(next);
    }
  };

  return (
    <div className="media-editor">
      <h4>Media</h4>

      {/* AUDIO */}
      {section === "listening" && (
        <div className="media-block">
          <label>Audio</label>

          {audio ? (
            <div className="media-row">
              <code>{audio.file}</code>
              <button onClick={removeAudio}>Remove</button>
            </div>
          ) : (
            <button
              disabled={!indexed?.audio.length}
              onClick={() => updateAudio(indexed!.audio[0])}
            >
              ➕ Pick audio
            </button>
          )}
        </div>
      )}

      {/* IMAGES */}
      <div className="media-block">
        <label>Images</label>

        {(images?.files ?? []).map((f, i) => (
          <div key={i} className="media-row">
            <code>{f}</code>
            <button
              onClick={() =>
                updateImages(images!.files.filter((_, x) => x !== i))
              }
            >
              ✕
            </button>
          </div>
        ))}

        <button
          disabled={!indexed?.images.length}
          onClick={() =>
            updateImages([...(images?.files ?? []), indexed!.images[0]])
          }
        >
          ➕ Add image
        </button>
      </div>
    </div>
  );
}
