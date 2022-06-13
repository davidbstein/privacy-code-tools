import React, { Component } from "react";
import { connect } from "react-redux";
import mapDispatchToProps from "src/components/utils/mapDispatchToProps";
import mapStateToProps from "src/components/utils/mapStateToProps";
import { deleteItem, insert, replace } from "src/components/utils/util";
import Loading from "src/components/widgets/Loading";
import CategoryEditor from "./CategoryEditor";

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

class SidebarPreview extends Component {
  // show a sidebar with categories and questions, and highlight the current onscreen category
  constructor(props) {
    super(props);
    this.state = {
      currentCategory: 0,
    };
    this.handleScroll = this.handleScroll.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll() {
    // get the ID of any "question-edit-form" currently onscreen
    const question_id = Array.from(document.getElementsByClassName("question-edit-form"))
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top >= -64 && rect.top <= window.innerHeight;
      }).map((e) => (e.id))[0];
    Array.from(document.getElementsByClassName("sidebar-link"))
      .map((el) => {
        el.classList.remove("selected");
        if (el.id === `link-to-${question_id}`) {
          el.classList.add("selected");
          el.scrollIntoView({behavior: "smooth", block: "center", inline: "start"});
        }
      })
  }

  handleClick(event) {
    const question_id = event.target.id.split("-")[2];
    console.log(document.getElementById(question_id), question_id);
    document.getElementById(question_id)
      .scrollIntoView({behavior: "smooth"});
  }

  render() {
    if (!this.props.coding) {
      return <Loading />;
    }
    const {
      coding : { categories },
    } = this.props;

    return <div id='coding-editor-sidebar'> 
      {categories.map((category, idx) => {
        return <div key={idx}> 
          <h2>{category.label}</h2>
          {category.questions.map((question, idx) => (
            <div 
            className='sidebar-link' 
            id={`link-to-${question.id}`}
            key={idx}
            onClick={this.handleClick}>  
              {question.label} 
            </div>
          ))}
        </div>
      })}
    </div>
  }
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
    return (
      <div>
        <div id="coding-edit-sidebar-preview"><SidebarPreview coding={coding}/></div>
        <div id="coding-edit-area">
          {coding.categories.map((category, categoryIdx) => {
            return (
              <div className="category-edit-holder" key={categoryIdx}>
                <button onClick={() => this.addCat(categoryIdx)}> insert new category at this location </button>
                <CategoryEditor
                  category={category}
                  categoryChanged={(newCategoryContent) =>
                    this.updateCat(categoryIdx, newCategoryContent)
                  }
                  deleteCategory={() => this.deleteCat(categoryIdx)}
                />
              </div>
            );
          })}
          <button onClick={() => this.addCat(coding.categories.length)}>
            {" "}
            insert new category at this location{" "}
          </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(CodingEditor);
