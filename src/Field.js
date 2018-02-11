import { observable, action, computed } from 'mobx';

export default class Field {
  // Non-changing properties
  fieldId;
  placeholder;

  // Changing properties
  @observable value;
  @observable label;
  @observable error;

  // Options
  @observable showError = true;

  // FieldStates
  @observable isSubmitting = false;
  @observable isPristine = true;
  @observable isValidating = false;

  // Constructor for Field
  constructor(id) {
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

  // Actions
  @action.bound onchange(newValue) {
    this.value = newValue;
  }
}
