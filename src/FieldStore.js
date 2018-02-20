import { action, observable, runInAction } from 'mobx';

export default class Field {
  // Non-changing properties
  fieldId; // Implies the field in the FormStore
  placeholder;
  validate = null;

  // Changing properties
  @observable error; // Did this field error?
  @observable label;
  @observable value; // Current value off the formField

  // Options
  @observable showError = true; // Do we need to show the error?

  // FieldStates
  @observable isPristine = true; // Touched?
  @observable isValid = false; // Are we valid (should default to true when there's no validation)

  // Constructor for Field
  constructor(id, options = {}) {
    if (!id) {
      throw Error('Fields need a fieldId to work.');
    }

    const { validate, initialValue, showError } = options;
    // Set our fieldId
    this.fieldId = id;
    if (validate) {
      this.validate = validate;
    }

    if (showError !== undefined) {
      this.showError = showError;
    }

    if (initialValue) {
      this.value = initialValue;
    }
  }

  @action.bound
  onChange(newValue) {
    // Only change when our values are differnt
    if (this.value !== newValue) {
      runInAction(() => {
        this.value = newValue;
        if (newValue) {
          this.isPristine = false;
        } else {
          this.isPristine = true;
        }
      });
    }
  }

  @action.bound
  validateField() {
    // Only validate when we want to see erros and we have a function for it
    if (this.validate && this.showError) {
      runInAction(() => {
        const error = this.validate(this.value);
        if (error) {
          this.error = error;
        } else {
          this.isValid = true;
          this.error = null;
        }
      });
    }
  }
}
