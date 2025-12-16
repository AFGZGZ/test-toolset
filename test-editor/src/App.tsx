import { useState, useEffect } from "react";
import type { Section } from "./types/questions";
import type { EditorQuestion } from "./types/test";
import { QuestionEditor } from "./components/QuestionEditor";
import { JsonPreview } from "./components/JsonPreview";
import type { TestMeta } from "./types/test";
import { pickAndIndexMedia } from "./functions/mediaIndexer";
import { useMedia } from "./context/MediaContext";
import { autoBindMedia } from "./functions/mediaAutoBind";

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

  const pickMediaFolder = async () => {
    const indexed = await pickAndIndexMedia();
    setMedia(indexed);
    console.log(indexed);
    setQuestions((prev) => ({
      listening: autoBindMedia(prev.listening, indexed),
      reading: autoBindMedia(prev.reading, indexed),
    }));
  };

  useEffect(() => {
    if (!media) return;

    setQuestions((prev) => ({
      listening: autoBindMedia(prev.listening, media),
      reading: autoBindMedia(prev.reading, media),
    }));
  }, [media]);

  /* ----------------------------- */
  /* Question mutations            */
  /* ----------------------------- */

  // const updateQuestion = (index: number, updated: EditorQuestion) => {
  //   setQuestions((prev) => prev.map((q, i) => (i === index ? updated : q)));
  // };

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

      return {
        ...prev,
        [currentSection]: [
          ...list,
          createEmptyQuestion(nextIndex, currentSection),
        ],
      };
    });
  };

  /* ----------------------------- */
  /* Export                        */
  /* ----------------------------- */

  const exportQuestions = () => {
    const blob = new Blob([JSON.stringify(questions, null, 2)], {
      type: "application/json",
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "questions.json";
    a.click();
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: 24,
        padding: 24,
        height: "100vh",
        boxSizing: "border-box",
      }}
    >
      {/* LEFT: Editor */}
      <div style={{ overflowY: "auto" }}>
        <h1>TOPIK Test Editor</h1>
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

          <label style={{ marginLeft: 12 }}>
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
          <button onClick={pickMediaFolder}>📂 Pick Media Folder</button>

          {media && (
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              🎧 {media.audio.length} audio · 🖼 {media.images.length} images
            </div>
          )}
        </div>
        <div className="tabs">
          <button
            className={`tab ${currentSection === "listening" ? "active" : ""}`}
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
          <button onClick={exportQuestions} style={{ marginLeft: 12 }}>
            💾 Export questions.json
          </button>
        </div>
      </div>

      {/* RIGHT: JSON Preview */}
      <div>
        <h3>Live JSON Preview</h3>
        <JsonPreview questions={questions} testMeta={testMeta} />
      </div>
    </div>
  );
}
