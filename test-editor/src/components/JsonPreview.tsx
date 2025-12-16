import type { EditorQuestion } from "../types/test";
import type { Question } from "../types/questions";
import type { TestMeta } from "../types/test";

interface Props {
  questions: {
    listening: EditorQuestion[];
    reading: EditorQuestion[];
  };
  testMeta: TestMeta;
}

export function JsonPreview({ questions, testMeta }: Props) {
  const exportQuestions: Question[] = [
    ...questions.listening,
    ...questions.reading,
  ].map((q) => {
    const sectionChar = q.section === "listening" ? "l" : "r";
    const index = String(q.index).padStart(2, "0");

    return {
      id: `t${testMeta.level}${testMeta.testNumber}${sectionChar}-${index}`,
      section: q.section,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      media: q.media,
    };
  });

  return (
    <pre
      style={{
        height: "100%",
        overflow: "auto",
        background: "#0f172a",
        color: "#e5e7eb",
        padding: 16,
        borderRadius: 8,
        fontSize: 13,
        lineHeight: 1.5,
      }}
    >
      {JSON.stringify(exportQuestions, null, 2)}
    </pre>
  );
}
