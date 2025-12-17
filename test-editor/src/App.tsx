import { useState, useEffect } from "react";
import type { Section, Question } from "./types/questions";
import type { EditorQuestion, TestMeta } from "./types/test";
import { QuestionEditor } from "./components/QuestionEditor";
import { JsonPreview } from "./components/JsonPreview";
import { pickAndIndexMedia } from "./functions/mediaIndexer";
import { useMedia } from "./context/MediaContext";
import { autoBindMedia } from "./functions/mediaAutoBind";
import { buildQuestionId } from "./functions/buildQuestionId";
import { toExportQuestion } from "./functions/exportQuestions";

const createEmptyQuestion = (
  index: number,
  section: Section
): EditorQuestion => ({
  id: "",
  section,
  question: "",
  options: ["", "", "", ""],
  correctAnswer: "",
  media: [],
  index,
});

export default function App() {
  const [testMeta, setTestMeta] = useState<TestMeta>({
    level: 1,
    testNumber: 1,
  });

  const [currentSection, setCurrentSection] = useState<Section>("listening");

  const [questions, setQuestions] = useState<{
    listening: EditorQuestion[];
    reading: EditorQuestion[];
  }>({
    listening: [createEmptyQuestion(1, "listening")],
    reading: [],
  });

  const { media, setMedia } = useMedia();

  const applyIds = (list: EditorQuestion[], meta: TestMeta): EditorQuestion[] =>
    list.map((q) => ({
      ...q,
      id: buildQuestionId(meta, q),
    }));

  const pickMediaFolder = async () => {
    const indexed = await pickAndIndexMedia();
    if (!indexed) return;

    setMedia(indexed);
    console.log(indexed);
    setQuestions((prev) => {
      const listening = applyIds(prev.listening, testMeta);
      const reading = applyIds(prev.reading, testMeta);

      return {
        listening: autoBindMedia(listening, indexed),
        reading: autoBindMedia(reading, indexed),
      };
    });
  };

  useEffect(() => {
    if (!media) return;

    setQuestions((prev) => {
      const listening = applyIds(prev.listening, testMeta);
      const reading = applyIds(prev.reading, testMeta);

      return {
        listening: autoBindMedia(listening, media),
        reading: autoBindMedia(reading, media),
      };
    });
  }, [media, testMeta]);

  const deleteQuestion = (index: number) => {
    setQuestions((prev) => {
      const nextList = prev[currentSection]
        .filter((_, i) => i !== index)
        .map((q, i) => ({ ...q, index: i + 1 }));

      return {
        ...prev,
        [currentSection]: nextList,
      };
    });
  };

  const addQuestion = () => {
    setQuestions((prev) => {
      const list = prev[currentSection];
      const nextIndex = list.length + 1;

      const newQuestion = createEmptyQuestion(nextIndex, currentSection);

      const nextList = [...list, newQuestion];

      const withIds = applyIds(nextList, testMeta);

      const finalList = media ? autoBindMedia(withIds, media) : withIds;

      return {
        ...prev,
        [currentSection]: finalList,
      };
    });
  };

  const exportQuestions = () => {
    const exportData: Question[] = [
      ...questions.listening,
      ...questions.reading,
    ].map((q) => toExportQuestion(q, testMeta));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "questions.json";
    a.click();
  };

  return (
    <div className="app">
      {/* LEFT: Editor */}
      <div
        // style={{ overflowY: "auto" }}
        className="editor-panel"
      >
        <div className="panel-header">
          <h2>TOPIK Test Editor</h2>
          <div style={{ marginBottom: 24 }}>
            <h3>Test Settings</h3>
            <label>
              Level:
              <select
                style={{ marginBottom: 10 }}
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
              style={{ display: "flex", alignItems: "center", marginTop: 20 }}
            >
              <button onClick={pickMediaFolder}>📂 Pick Media Folder</button>

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
              🎧 Listening ({questions.listening.length})
            </button>

            <button
              className={`tab ${currentSection === "reading" ? "active" : ""}`}
              onClick={() => setCurrentSection("reading")}
            >
              📖 Reading ({questions.reading.length})
            </button>
          </div>
        </div>
        <h3>Questions:</h3>
        {questions[currentSection].map((q, index) => (
          <QuestionEditor
            key={q.index}
            question={q}
            testMeta={testMeta}
            onChange={(updated) =>
              setQuestions((prev) => ({
                ...prev,
                [currentSection]: prev[currentSection].map((x, i) =>
                  i === index ? updated : x
                ),
              }))
            }
            onDelete={() => deleteQuestion(index)}
          />
        ))}

        <div style={{ marginTop: 24 }}>
          <button onClick={addQuestion}>➕ Add Question</button>
        </div>
      </div>

      {/* RIGHT: JSON Preview */}
      <div
        className="preview-panel"
        // style={{ overflowY: "auto" }}
      >
        <div
          className="panel-header"
          style={{ display: "flex", alignItems: "center" }}
        >
          <h3>Live JSON Preview</h3>
          <button
            onClick={() => {
              exportQuestions();
            }}
            style={{ marginLeft: 12, height: 30 }}
          >
            💾 Save JSON
          </button>
        </div>
        <JsonPreview questions={questions} testMeta={testMeta} />
      </div>
    </div>
  );
}
