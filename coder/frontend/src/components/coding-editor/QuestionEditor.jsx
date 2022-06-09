import React from "react";
import InputBox from "src/components/widgets/InputBox";
import QuestionOptionListEditor from "./QuestionOptionListEditor";
import Select from "react-select";

const _QUESTION_TYPES = [
  { value: "singleselect", label: "Select Exactly One" },
  { value: "multiselect", label: "Select Multiple" },
];

/**
 *
 * @param {{Question, function}} params
 * @returns
 */
export default function QuestionEditor({ question, questionChanged, deleteQuestion }) {
  return (
    <div className="question-edit-form" id={`${question.id}`}>
      <InputBox
        className="question-edit-id"
        value={question.id}
        placeholder="v2021_3d_party.1"
        callback={(value) => questionChanged({ ...question, id: value })}
      />
      <Select
        defaultValue={question.type}
        className="question-edit-type"
        options={_QUESTION_TYPES}
        onChange={(value) => questionChanged({ ...question, type: value })}
      />
      <button className="delete-button" onClick={deleteQuestion}>
        X
      </button>
      <InputBox
        className="question-edit-label"
        value={question.label}
        placeholder="enter a label"
        callback={(value) => questionChanged({ ...question, label: value })}
      />
      <InputBox
        area={true}
        className="question-edit-description"
        value={question.description}
        placeholder="The question..."
        callback={(value) => questionChanged({ ...question, description: value })}
      />
      <InputBox
        area={true}
        className="question-edit-info"
        value={question.info}
        placeholder="Additional details and clarification"
        callback={(value) => questionChanged({ ...question, info: value })}
      />
      {/**
      <div className="meta-divider">meta information (not shown to coders)</div>
      <InputBox
        className="question-edit-meta.notes"
        value={question.meta.notes}
        label="notes"
        placeholder="notes"
        callback={(value) => questionChanged({ ...question, meta: { ...question.meta, notes: value } })}
      />
      <InputBox
        className="question-edit-meta.source"
        value={question.meta.source}
        label="source"
        placeholder="enter a source"
        callback={(value) => questionChanged({ ...question, meta: { ...question.meta, source: value } })}
      />
       */}
      <QuestionOptionListEditor
        questionOptions={question.questionOptions}
        questionOptionsChanged={(newQuestionOptions) =>
          questionChanged({ ...question, questionOptions: newQuestionOptions })
        }
      />
    </div>
  );
}
