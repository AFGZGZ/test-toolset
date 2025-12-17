import { useState, useEffect } from "react";
import type { Section } from "./types/questions";
import type { EditorQuestion, TestMeta } from "./types/test";
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
  question: "",
  options: ["", "", "", ""],
  correctAnswer: "",
  media: [],
  globalIndex,
});

export default function App() {
  const [testMeta, setTestMeta] = useState<TestMeta>({
    level: 1,
    testNumber: 1,
  });

  const [currentSection, setCurrentSection] = useState<Section>("listening");

  const [questions, setQuestions] = useState<EditorQuestion[]>([
    createEmptyQuestion(1, "listening"),
  ]);

  const { media, setMedia } = useMedia();

  const normalizeQuestions = (
    list: EditorQuestion[],
    mediaIndex = media
  ): EditorQuestion[] => {
    const withIndex = list.map((q, i) => ({
      ...q,
      globalIndex: i + 1,
    }));

    const withIds = withIndex.map((q) => ({
      ...q,
      id: buildQuestionId(testMeta, q.section, q.globalIndex),
    }));

    return mediaIndex ? autoBindMedia(withIds, mediaIndex) : withIds;
  };

  const pickMediaFolder = async () => {
    const indexed = await pickAndIndexMedia();
    if (!indexed) return;

    setMedia(indexed);
    setQuestions((prev) => normalizeQuestions(prev, indexed));
  };

  useEffect(() => {
    if (!media) return;
    setQuestions((prev) => normalizeQuestions(prev, media));
  }, [media, testMeta]);

  const addQuestion = () => {
    setQuestions((prev) => {
      const newQuestion = createEmptyQuestion(prev.length + 1, currentSection);

      let next: EditorQuestion[];

      if (currentSection === "listening") {
        // Insert BEFORE first reading question
        const firstReadingIndex = prev.findIndex(
          (q) => q.section === "reading"
        );

        if (firstReadingIndex === -1) {
          // No reading yet → append
          next = [...prev, newQuestion];
        } else {
          next = [
            ...prev.slice(0, firstReadingIndex),
            newQuestion,
            ...prev.slice(firstReadingIndex),
          ];
        }
      } else {
        // Reading questions always go at the end
        next = [...prev, newQuestion];
      }

      return normalizeQuestions(next);
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
          style={{ display: "flex", alignItems: "center" }}
        >
          <h3>Live JSON Preview</h3>
          <button onClick={exportJson} style={{ marginLeft: 12, height: 30 }}>
            💾 Save JSON
          </button>
        </div>

        <JsonPreview questions={questions} meta={testMeta} />
      </div>
    </div>
  );
}
