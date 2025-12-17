// import { QuestionsFileSchema } from "../schema/questionSchema";
import type { EditorQuestion, TestMeta } from "../types/test";
import { buildQuestionId } from "./buildQuestionId";
import type { Question } from "../types/questions";

// export function exportQuestions(questions: unknown) {
//   const parsed = QuestionsFileSchema.safeParse(questions);
//   if (!parsed.success) {
//     alert(parsed.error.message);
//     return;
//   }

//   const blob = new Blob([JSON.stringify(parsed.data, null, 2)], {
//     type: "application/json",
//   });

//   const a = document.createElement("a");
//   a.href = URL.createObjectURL(blob);
//   a.download = "questions.json";
//   a.click();
// }

export function toExportQuestion(
  q: EditorQuestion,
  meta: TestMeta,
  section: "listening" | "reading",
  globalIndex: number
): Question {
  return {
    id: buildQuestionId(meta, section, globalIndex),
    section,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    media: q.media.map((m) =>
      m.type === "audio"
        ? { type: "audio", file: m.file }
        : { type: "image", files: m.files }
    ),
  };
}

export function exportQuestions(
  questions: EditorQuestion[],
  meta: TestMeta
): Question[] {
  return questions.map((q) => ({
    id: buildQuestionId(meta, q.section, q.globalIndex),
    section: q.section,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    media: q.media.map((m) =>
      m.type === "audio"
        ? { type: "audio", file: m.file }
        : { type: "image", files: m.files }
    ),
  }));
}
