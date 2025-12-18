import type { TestMeta } from "../types/test";
import type { EditorQuestion } from "../types/editorQuestions";
import { buildQuestionId } from "./buildQuestionId";
import type { Question } from "../types/questions";

export function exportQuestions(
  questions: EditorQuestion[],
  meta: TestMeta
): Question[] {
  return questions.map((q) => ({
    id: buildQuestionId(meta, q.section, q.globalIndex),
    section: q.section,
    ...(q.title ? { title: q.title } : {}),
    question: q.question,
    ...(q.additional ? { additional: q.additional } : {}),
    options: q.options,
    correctAnswer: q.correctAnswer,
    media: q.media.map(({ type, files }) => ({
      type,
      files,
    })),
  }));
}
