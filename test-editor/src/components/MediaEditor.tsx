import type {
  EditorMedia,
  EditorAudioMedia,
  EditorImageMedia,
} from "../types/test";
import { useMedia } from "../context/MediaContext";

interface Props {
  section: "listening" | "reading";
  media?: EditorMedia[];
  onChange: (media: EditorMedia[]) => void;
}

export function MediaEditor({ section, media = [], onChange }: Props) {
  const { media: indexed } = useMedia();

  const audio = media.find((m): m is EditorAudioMedia => m.type === "audio");

  const images = media.find((m): m is EditorImageMedia => m.type === "image");

  const setAudio = (file: string) => {
    const next = media.filter((m) => m.type !== "audio");

    onChange([
      ...next,
      {
        type: "audio",
        file,
        source: "manual",
      },
    ]);
  };

  const removeAudio = () => {
    onChange(media.filter((m) => m.type !== "audio"));
  };

  const addImage = (file: string) => {
    const current = images?.files ?? [];

    onChange([
      ...media.filter((m) => m.type !== "image"),
      {
        type: "image",
        files: [...current, file],
        source: "manual",
      },
    ]);
  };

  const removeImage = (index: number) => {
    if (!images) return;

    const nextFiles = images.files.filter((_, i) => i !== index);

    if (nextFiles.length === 0) {
      onChange(media.filter((m) => m.type !== "image"));
    } else {
      onChange([
        ...media.filter((m) => m.type !== "image"),
        {
          type: "image",
          files: nextFiles,
          source: "manual",
        },
      ]);
    }
  };

  return (
    <div className="media-editor">
      <h4>Media</h4>

      {section === "listening" && (
        <div className="media-block">
          <label>Audio</label>

          {audio ? (
            <div className="media-row">
              <code>{audio.file}</code>
              {audio.source === "auto" && <span className="badge">auto</span>}
              <button onClick={removeAudio}>Remove</button>
            </div>
          ) : (
            <select
              disabled={!indexed?.audio.length}
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) setAudio(e.target.value);
              }}
            >
              <option value="" disabled>
                Select audio…
              </option>
              {indexed?.audio.map((file) => (
                <option key={file} value={file}>
                  {file}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      <div className="media-block">
        <label>Images</label>

        {(images?.files ?? []).map((file, i) => (
          <div key={i}>
            <code>{file}</code>
            {images?.source === "auto" && <span className="badge">auto</span>}
            <button onClick={() => removeImage(i)}>✕</button>
          </div>
        ))}

        <select
          disabled={!indexed?.images.length}
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) addImage(e.target.value);
          }}
        >
          <option value="" disabled>
            Add image…
          </option>
          {indexed?.images.map((file) => (
            <option key={file} value={file}>
              {file}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
