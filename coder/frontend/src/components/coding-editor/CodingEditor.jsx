import React, { Component } from "react";
import { connect } from "react-redux";
import { apiSaveCoding, apiUpdateCoding } from "src/actions/api";
import { userUpdateCoding } from "src/actions/userActions";
import mapStateToProps from "src/components/utils/mapStateToProps";
import Loading from "src/components/widgets/Loading";
import CategoryEditor from "./CategoryEditor";
import { deleteItem, insert, replace } from "src/components/utils/util";

/**
 * @returns {Category}
 */
function defaultCategory() {
  return {
    label: "",
    id: "",
    notes: { description: "" },
    questions: [],
  };
}

class CodingEditor extends Component {
  constructor(props) {
    super(props);
    this.addCat = this._addCat.bind(this);
    this.deleteCat = this._deleteCat.bind(this);
    this.updateCat = this._updateCat.bind(this);
    this.replaceCategoryQuestions = this._replaceCategoryQuestions.bind(this);
  }

  _replaceCategoryQuestions(newQuestions) {
    const {
      coding_id,
      localState: {
        localCodings: { [coding_id]: coding },
      },
    } = this.props;
    this.props.userUpdateCoding({
      ...coding,
      categories: newQuestions,
    });
  }

  _addCat(idx) {
    const coding = this.props.localState.localCodings[this.props.coding_id];
    this.replaceCategoryQuestions(insert(coding.categories, defaultCategory(), idx));
  }

  _updateCat(categoryIdx, newCategoryContent) {
    const coding = this.props.localState.localCodings[this.props.coding_id];
    this.replaceCategoryQuestions(replace(coding.categories, newCategoryContent, categoryIdx));
  }

  _deleteCat(categoryIdx) {
    const coding = this.props.localState.localCodings[this.props.coding_id];
    this.replaceCategoryQuestions(deleteItem(coding.categories, categoryIdx));
  }

  render() {
    const { coding_id } = this.props;
    const coding = this.props.localState.localCodings[coding_id];
    if (coding == undefined) return <Loading />;

    const serverCoding = this.props.model.codings[coding_id];
    const equalityTest = JSON.stringify(serverCoding) == JSON.stringify(coding);
    console.log(JSON.stringify(serverCoding));
    console.log(JSON.stringify(coding));
    return (
      <div>
        <div id="coding-edit-area">
          {coding.categories.map((category, categoryIdx) => {
            return (
              <div className="category-edit-holder" key={categoryIdx}>
                <button onClick={() => this.addCat(categoryIdx)}> insert new category here </button>
                <CategoryEditor
                  category={category}
                  categoryChanged={(newCategoryContent) => this.updateCat(categoryIdx, newCategoryContent)}
                  deleteCategory={() => this.deleteCat(categoryIdx)}
                />
              </div>
            );
          })}
          <button onClick={() => this.addCat(coding.categories.length)}> insert new category here </button>
        </div>
        <div id="save-buttons">
          <div id="changes-alert" className={equalityTest ? "saved" : "unsaved"}>
            {equalityTest ? "everything is saved." : "THERE ARE UNSAVED CHANGES"}
          </div>
          <button
            onClick={() => {
              this.props.apiSaveCoding(coding);
              setTimeout(() => {
                window.location.href = ".";
              });
            }}
          >
            Save as new
          </button>
          <button onClick={() => this.props.apiUpdateCoding(coding_id, coding)}> Update </button>
          <a href=".">back to coding list...</a>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, { userUpdateCoding, apiSaveCoding, apiUpdateCoding })(CodingEditor);
