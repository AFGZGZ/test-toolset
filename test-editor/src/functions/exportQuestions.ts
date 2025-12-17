// import { QuestionsFileSchema } from "../schema/questionSchema";
import type { EditorQuestion, TestMeta } from "../types/test";
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

export function toExportQuestion(q: EditorQuestion, meta: TestMeta): Question {
  const sectionChar = q.section === "listening" ? "l" : "r";
  const index = String(q.index).padStart(2, "0");

  return {
    id: `t${meta.level}${meta.testNumber}${sectionChar}-${index}`,
    section: q.section,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    media: q.media.map((m) => {
      if (m.type === "audio") {
        return { type: "audio", file: m.file };
      }
      return { type: "image", files: m.files };
    }),
  };
}
