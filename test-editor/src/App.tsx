import { useState, useEffect, useRef } from "react";
import type { Section } from "./types/questions";
import type { TestMeta } from "./types/test";
import type { EditorQuestion } from "./types/editorQuestions";
import { QuestionEditor } from "./components/QuestionEditor";
import { JsonPreview } from "./components/JsonPreview";
import { pickAndIndexMedia } from "./functions/mediaIndexer";
import { useMedia } from "./context/MediaContext";
import { autoBindMedia } from "./functions/mediaAutoBind";
import { buildQuestionId } from "./functions/buildQuestionId";
import { exportQuestions } from "./functions/exportQuestions";

const createEmptyQuestion = (
  globalIndex: number,
  section: Section
): EditorQuestion => ({
  id: "",
  section,
  title: "",
  question: "",
  additional: "",
  options: ["", "", "", ""],
  correctAnswer: "",
  media: [],
  globalIndex,
});

export default function App() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [testMeta, setTestMeta] = useState<TestMeta>({
    level: 1,
    testNumber: 1,
  });

  const [currentSection, setCurrentSection] = useState<Section>("listening");

  const [questions, setQuestions] = useState<EditorQuestion[]>([
    createEmptyQuestion(1, "listening"),
  ]);

  const { media, setMedia } = useMedia();

  // This version imposes auto media always!!
  // const normalizeQuestions = (
  //   list: EditorQuestion[],
  //   mediaIndex = media
  // ): EditorQuestion[] => {
  //   const withIndex = list.map((q, i) => ({
  //     ...q,
  //     globalIndex: i + 1,
  //   }));

  //   const withIds = withIndex.map((q) => ({
  //     ...q,
  //     id: buildQuestionId(testMeta, q.section, q.globalIndex),
  //   }));

  //   return mediaIndex ? autoBindMedia(withIds, mediaIndex) : withIds;

  // };

  const normalizeQuestions = (list: EditorQuestion[]): EditorQuestion[] =>
    list.map((q, i) => ({
      ...q,
      globalIndex: i + 1,
      id: buildQuestionId(testMeta, q.section, i + 1),
    }));

  const pickMediaFolder = async () => {
    const indexed = await pickAndIndexMedia();
    if (!indexed) return;

    setMedia(indexed);
    // setQuestions((prev) => normalizeQuestions(prev, indexed));
    setQuestions((prev) => autoBindMedia(normalizeQuestions(prev), indexed));
  };

  useEffect(() => {
    if (!media) return;
    // setQuestions((prev) => normalizeQuestions(prev, media));
    setQuestions((prev) => autoBindMedia(normalizeQuestions(prev), media));
  }, [media, testMeta]);

  const addQuestion = () => {
    setQuestions((prev) => {
      const newQuestion = createEmptyQuestion(prev.length + 1, currentSection);

      let next: EditorQuestion[];

      if (currentSection === "listening") {
        const firstReadingIndex = prev.findIndex(
          (q) => q.section === "reading"
        );

        if (firstReadingIndex === -1) {
          next = [...prev, newQuestion];
        } else {
          next = [
            ...prev.slice(0, firstReadingIndex),
            newQuestion,
            ...prev.slice(firstReadingIndex),
          ];
        }
      } else {
        next = [...prev, newQuestion];
      }

      const normalized = normalizeQuestions(next);

      return media ? autoBindMedia(normalized, media) : normalized;
    });
  };

  const deleteQuestion = (globalIndex: number) => {
    setQuestions((prev) => {
      const next = prev.filter((q) => q.globalIndex !== globalIndex);
      return normalizeQuestions(next);
    });
  };

  const exportJson = () => {
    const blob = new Blob(
      [JSON.stringify(exportQuestions(questions, testMeta), null, 2)],
      { type: "application/json" }
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "questions.json";
    a.click();
  };

  const hydrateQuestionsFromJson = (
    raw: any[],
    sectionFallback: Section = "listening"
  ): EditorQuestion[] => {
    return raw.map((q, index) => ({
      id: q.id ?? "",
      section: q.section ?? sectionFallback,
      title: q.title ?? "",
      question: q.question ?? "",
      additional: q.additional ?? "",
      options: [
        q.options?.[0] ?? "",
        q.options?.[1] ?? "",
        q.options?.[2] ?? "",
        q.options?.[3] ?? "",
      ],
      correctAnswer: q.correctAnswer ?? "",
      media: Array.isArray(q.media) ? q.media : [],
      globalIndex: index + 1,
    }));
  };

  const handleLoadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      if (!Array.isArray(json)) {
        alert("Invalid questions.json format");
        return;
      }

      const hydrated = hydrateQuestionsFromJson(json);

      const normalized = normalizeQuestions(hydrated);

      setQuestions(media ? autoBindMedia(normalized, media) : normalized);
    } catch (err) {
      console.error(err);
      alert("Failed to load questions.json");
    } finally {
      e.target.value = ""; // allow re-upload same file
    }
  };

  const visibleQuestions = questions.filter(
    (q) => q.section === currentSection
  );

  return (
    <div className="app">
      {/* LEFT: Editor */}
      <div className="editor-panel">
        <div className="panel-header">
          <h2>TOPIK Test Editor</h2>

          <div style={{ marginBottom: 24 }}>
            <h3>Test Settings</h3>

            <label>
              Level:
              <select
                value={testMeta.level}
                onChange={(e) =>
                  setTestMeta((p) => ({
                    ...p,
                    level: Number(e.target.value) as 1 | 2,
                  }))
                }
              >
                <option value={1}>TOPIK I</option>
                <option value={2}>TOPIK II</option>
              </select>
            </label>

            <label>
              Test #
              <input
                type="number"
                value={testMeta.testNumber}
                onChange={(e) =>
                  setTestMeta((p) => ({
                    ...p,
                    testNumber: Number(e.target.value),
                  }))
                }
              />
            </label>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <button
                onClick={() => {
                  pickMediaFolder();
                }}
              >
                📂 Pick Media Folder
              </button>

              {media && (
                <div style={{ fontSize: 12, opacity: 0.7, marginLeft: 10 }}>
                  Loaded: 🎧 {media.audio.length} audio · 🖼{" "}
                  {media.images.length} images
                </div>
              )}
            </div>
          </div>

          <div className="tabs">
            <button
              className={`tab ${
                currentSection === "listening" ? "active" : ""
              }`}
              onClick={() => setCurrentSection("listening")}
            >
              🎧 Listening (
              {questions.filter((q) => q.section === "listening").length})
            </button>

            <button
              className={`tab ${currentSection === "reading" ? "active" : ""}`}
              onClick={() => setCurrentSection("reading")}
            >
              📖 Reading (
              {questions.filter((q) => q.section === "reading").length})
            </button>
          </div>
        </div>

        <h3>Questions:</h3>

        {visibleQuestions.map((q) => (
          <QuestionEditor
            key={q.globalIndex}
            question={q}
            testMeta={testMeta}
            onChange={(updated) =>
              setQuestions((prev) =>
                normalizeQuestions(
                  prev.map((x) =>
                    x.globalIndex === q.globalIndex ? updated : x
                  )
                )
              )
            }
            onDelete={() => deleteQuestion(q.globalIndex)}
          />
        ))}

        <div style={{ marginTop: 24 }}>
          <button onClick={addQuestion}>➕ Add Question</button>
        </div>
      </div>

      {/* RIGHT: JSON Preview */}
      <div className="preview-panel">
        <div
          className="panel-header"
          style={{
            display: "flex",
            alignItems: "center",
            padding: 0,
            justifyContent: "space-between",
            paddingBottom: 10,
          }}
        >
          <h3 style={{ marginBottom: 0, marginTop: 0 }}>Live JSON Preview</h3>
          <div
            style={{
              justifyContent: "space-between",
              marginRight: 5,
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              hidden
              onChange={handleLoadFile}
            />

            <button onClick={() => fileInputRef.current?.click()}>
              📂 Load JSON
            </button>
            <button onClick={exportJson} style={{ marginLeft: 12, height: 30 }}>
              💾 Save JSON
            </button>
          </div>
        </div>
        <JsonPreview questions={questions} meta={testMeta} />
      </div>
    </div>
  );
}
