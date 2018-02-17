import { action, observable, runInAction } from 'mobx';

export default class Field {
  // Non-changing properties
  fieldId; // Implies the field in the FormStore
  placeholder;

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
  constructor(id) {
    // Set our fieldId
    this.fieldId = id;
  }

  @action.bound
  onChange(newValue) {
    runInAction(() => {
      this.value = newValue;
    });
  }

  @action.bound
  validateField() {
    runInAction(() => {
      const error = this.validateField();
      if (error && this.showError) {
        this.error = error;
      }
    });
  }
}
