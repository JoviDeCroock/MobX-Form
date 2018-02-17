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

  constructor(handleSubmit, validate) {
    this.handleSubmit = handleSubmit;
    this.validate = validate;
  }

  @action.bound
  addField(field) {
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
    const values = Object.values(this.fields).map(field => field.value);
    this.handleSubmit(values);
  }

  // Calls validate on all our fields
  @action.bound
  validateForm() {
    runInAction(() => {
      Object.values(this.values).map(field => field.validateField());
    });
  }
}
