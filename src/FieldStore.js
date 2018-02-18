import { action, observable, runInAction } from 'mobx';

export default class Field {
  // Non-changing properties
  fieldId; // Implies the field in the FormStore
  placeholder;
  validate;

  // Changing properties
  @observable error; // Did this field error?
  @observable label;
  @observable value; // Current value off the formField

  // Options
  @observable showError = true; // Do we need to show the error?

  // FieldStates
  @observable isSubmitting = false; // Is our form submitting
  @observable isPristine = true; // Touched?
  @observable isValidating = false; // Validating?
  @observable isValid = false; // Are we valid (should default to true when there's no validation)

  // Constructor for Field
  constructor(id, options) {
    // Set our fieldId
    this.fieldId = id;
    this.validate = options.validate;
  }

  @action.bound
  onChange(newValue) {
    runInAction(() => {
      this.value = newValue;
    });
  }

  @action.bound
  validateField() {
    if (this.validate && this.showError) {
      runInAction(() => {
        const error = this.validate(this.value);
        if (error) {
          this.error = error;
          return error;
        }
      });
    }
  }
}
