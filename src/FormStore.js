// Can function as our main injection point
import { observable, action, runInAction } from 'mobx';

export default class Form {
  // Will be our formName (future context use)
  name;
  // Will hold our function to submit the form
  handleSubmit;

  // Observables
  @observable
  fields = {};
  @observable
  validators = {};

  constructor(handleSubmit, validators) {
    // handleSubmit should be passed AND be a function
    if (!handleSubmit || typeof handleSubmit !== 'function') {
      throw Error('Please pass a handleSubmit function.');
    }

    this.handleSubmit = handleSubmit;
    if (validators) {
      Object.keys(validators).map(fieldId => {
        if (typeof validators[fieldId] === 'function') {
          // Only pass into validators if it's a functions
          this.validators[fieldId] = validators[fieldId];
        }
      })
    };
  }

  @action.bound
  addField(field) {
    // We should validate our field is definitly off class Field
    this.fields[field.fieldId] = field;
  }

  @action.bound
  onChange(fieldId, value) {
    runInAction(() => {
      this.fields[fieldId].onChange(value);
    });
  }

  @action.bound
  onSubmit(e) {
    e.preventDefault();
    const errors = this.validateForm();
    if (errors.length === 0) {
      const values = Object.values(this.fields).map(field => field.value);
      this.handleSubmit(values);
    }
  }

  // Calls validate on all our fields
  @action.bound
  validateForm() {
    runInAction(() => {
      const errors = Object.values(this.values).map(field => field.validateField());
      return errors;
    });
  }
}
