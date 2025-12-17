import type { EditorQuestion } from "../types/test";
import type { Question } from "../types/questions";
import type { TestMeta } from "../types/test";
import { toExportQuestion } from "../functions/exportQuestions";

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
  ].map((q) => toExportQuestion(q, testMeta));

  return (
    <pre
      style={{
        background: "#0f172a",
        color: "#e5e7eb",
        padding: 16,
        borderRadius: 8,
        fontSize: 13,
        lineHeight: 1.5,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {JSON.stringify(exportQuestions, null, 2)}
    </pre>
  );
}
