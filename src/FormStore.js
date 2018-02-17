// Can function as our main injection point
import { observable, action, runInAction } from 'mobx';

export default class Form {
  // Will be our formName (future context use)
  name;
  // Will hold our function to submit the form
  handleSubmit;
  // Function to validate from
  validate;

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

  @action.bound
  validateForm() {
    this.validate(this.values);
  }
}
