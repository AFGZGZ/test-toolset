import { QuestionsFileSchema } from "../schema/questionSchema";

export function exportQuestions(questions: unknown) {
  const parsed = QuestionsFileSchema.safeParse(questions);
  if (!parsed.success) {
    alert(parsed.error.message);
    return;
  }

  const blob = new Blob([JSON.stringify(parsed.data, null, 2)], {
    type: "application/json",
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "questions.json";
  a.click();
}
