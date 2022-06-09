import React, { Component } from "react";
import InputBox from "src/components/widgets/InputBox";
import { insert, replace, deleteItem } from "src/components/utils/util";

/**
 *
 * @returns {QuestionOption}
 */
function defaultQuestionOption() {
  return {
    label: "",
    value: "",
    details: "",
    meta: {},
  };
}

export default function QuestionOptionListEditor({ questionOptions, questionOptionsChanged }) {
  function optionChanged(optionIdx, newOption) {
    questionOptionsChanged(replace(questionOptions, newOption, optionIdx));
  }
  return (
    <div className="question-option-list-editor">
      <div className="value-list-heading">[multiple choice] choices:</div>
      {questionOptions.map((questionOption, optionIdx) => (
        <div className="question-option-editor" key={optionIdx}>
          <InputBox
            className="question-option-value"
            value={questionOption.value}
            placeholder={"Y"}
            callback={(inputBoxText) => optionChanged(optionIdx, { ...questionOption, value: inputBoxText })}
          />
          <InputBox
            className="question-option-label"
            value={questionOption.label}
            placeholder={"description of choice"}
            callback={(inputBoxText) => optionChanged(optionIdx, { ...questionOption, label: inputBoxText })}
          />
          <InputBox
            className="question-option-detail"
            value={questionOption.details}
            placeholder={"optional clarifying details"}
            callback={(inputBoxText) => optionChanged(optionIdx, { ...questionOption, details: inputBoxText })}
          />
          <button
            className="delete-button"
            onClick={() => questionOptionsChanged(deleteItem(questionOptions, optionIdx))}
          >
            remove
          </button>
        </div>
      ))}
      <button
        onClick={() => questionOptionsChanged(insert(questionOptions, defaultQuestionOption(), questionOptions.length))}
      >
        add choice
      </button>
    </div>
  );
}
