import type { EditorQuestion, TestMeta } from "../types/test";
import type { Question } from "../types/questions";

export function buildQuestionId(meta: TestMeta, q: EditorQuestion): string {
  const sectionChar = q.section === "listening" ? "l" : "r";
  const index = String(q.index).padStart(2, "0");

  return `t${meta.level}${meta.testNumber}${sectionChar}-${index}`;
}

export function serializeQuestion(meta: TestMeta, q: EditorQuestion): Question {
  return {
    id: buildQuestionId(meta, q),
    section: q.section,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    media: q.media,
  };
}
