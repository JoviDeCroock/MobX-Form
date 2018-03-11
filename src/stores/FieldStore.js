import { action, observable, runInAction } from 'mobx';
import { reset } from '../utils';

export default class Field {
  static mobxLoggerConfig = {
    enabled: false,
    methods: {
      onChange: true,
    },
  };


  // Non-changing properties
  fieldId; // Implies the field in the FormStore
  placeholder;
  validate = null;
  initialValue;

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
      console.warn('Fields need a fieldId to work.');
      throw new Error('Please pass a fieldId to all fields. Passed options:', options);
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
      this.initialValue = initialValue;
    }
  }

  @action.bound
  reset() {
    runInAction(() => {
      if (this.initialValue) {
        this.value = this.initialValue;
      } else {
        this.value = reset(this.value);
      }
      this.isPristine = true;
      this.isValid = false;
      this.error = null;
    });
  }

  @action.bound
  onChange(newValue) {
    // Only change when our values are differnt
    // Save the frames, lessen rerenders!
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
