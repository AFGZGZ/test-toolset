import { z } from "zod";

export const MediaSchema = z.object({
  type: z.enum(["audio", "img"]),
  files: z.string().min(1),
});

export const QuestionSchema = z.object({
  id: z.string(),
  section: z.enum(["listening", "reading"]),
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctAnswer: z.string(),
  media: z.array(MediaSchema).optional(),
});

export const QuestionsFileSchema = z.array(QuestionSchema);

export type QuestionFile = z.infer<typeof QuestionSchema>;
