import { action, observable, computed, runInAction } from 'mobx';

export default class Field {
  // Non-changing properties
  fieldId; // Implies the field in the FormStore
  placeholder;

  // Changing properties
  @observable error; // Did this field error?
  @observable label;
  @observable value; // Current value off the formField

  // Options
  @observable showError = true; // DO we need to show the error?

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

  // Computed
  @computed
  get error() {
    return this.showError ? (this.error || null) : null;
  }

  @computed
  get value() {
    return this.value;
  }

  @computed
  get isBusy() {
    return (this.isSubmitting || this.isValidating);
  }

  @action.bound
  onchange(newValue) {
    runInAction(() => {
      this.value = newValue;
    });
  }
}
