import type { EditorQuestion, TestMeta } from "../types/test";
import { buildQuestionId } from "../functions/serializeQuestion";
import { MediaEditor } from "./MediaEditor";

export interface Props {
  question: EditorQuestion;
  onChange: (q: EditorQuestion) => void;
  onDelete: () => void;
  testMeta: TestMeta;
}

export function QuestionEditor({
  question,
  onChange,
  onDelete,
  testMeta,
}: // section,
Props) {
  const update = (patch: Partial<EditorQuestion>) => {
    onChange({
      ...question,
      ...patch,
    });
  };

  const id = buildQuestionId(testMeta, question);

  const updateOption = (optionIndex: number, value: string) => {
    const next = [...question.options];
    next[optionIndex] = value;

    update({ options: next });

    if (question.correctAnswer === question.options[optionIndex]) {
      update({ correctAnswer: value });
    }
  };

  return (
    <section className="question-card">
      <header className="question-header">
        <div style={{ fontSize: 12, opacity: 0.7 }}>
          ID: <code>{id}</code>
        </div>
        <button className="danger" onClick={onDelete}>
          Delete
        </button>
      </header>

      <textarea
        className="question-text"
        placeholder="Question text"
        value={question.question}
        onChange={(e) => update({ question: e.target.value })}
      />

      <div className="options">
        {question.options.map((opt, i) => (
          <input
            key={i}
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={(e) => updateOption(i, e.target.value)}
          />
        ))}
      </div>

      <div className="correct-answer">
        <label>Correct answer</label>
        <select
          value={question.correctAnswer}
          onChange={(e) => update({ correctAnswer: e.target.value })}
        >
          <option value="">— Select —</option>
          {question.options.map((opt, i) => (
            <option key={i} value={opt}>
              {opt || `Option ${i + 1}`}
            </option>
          ))}
        </select>
      </div>
      <MediaEditor
        section={question.section}
        media={question.media}
        onChange={(media) => onChange({ ...question, media })}
      />
    </section>
  );
}
