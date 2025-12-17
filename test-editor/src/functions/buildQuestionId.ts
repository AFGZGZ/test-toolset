import type { EditorQuestion, TestMeta } from "../types/test";

export function buildQuestionId(meta: TestMeta, q: EditorQuestion): string {
  const sectionChar = q.section === "listening" ? "l" : "r";
  const index = String(q.index).padStart(2, "0");

  return `t${meta.level}${meta.testNumber}${sectionChar}-${index}`;
}
