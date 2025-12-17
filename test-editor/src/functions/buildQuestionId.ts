import type { TestMeta } from "../types/test";

export function buildQuestionId(
  meta: TestMeta,
  section: "listening" | "reading",
  globalIndex: number
) {
  const sectionChar = section === "listening" ? "l" : "r";
  const index = String(globalIndex).padStart(2, "0");

  return `t${meta.level}${meta.testNumber}${sectionChar}-${index}`;
}
