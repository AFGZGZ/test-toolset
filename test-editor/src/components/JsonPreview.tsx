import type { TestMeta } from "../types/test";
import type { EditorQuestion } from "../types/editorQuestions";
import { exportQuestions } from "../functions/exportQuestions";

interface Props {
  questions: EditorQuestion[];
  meta: TestMeta;
}

export function JsonPreview({ questions, meta }: Props) {
  const finalQuestions = exportQuestions(questions, meta);

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
      {JSON.stringify(finalQuestions, null, 2)}
    </pre>
  );
}
