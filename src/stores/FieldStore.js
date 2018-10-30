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
  isSchemaValidation;
  isField = true;

  // Changing properties
  @observable error; // Did this field error?
  @observable label;
  @observable value; // Current value off the formField

  // Options
  @observable showError = true; // Do we need to show the error?

  // FieldStates
  @observable isPristine = true; // Dirty?
  @observable isValid = false; // Are we valid (should default to true when there's no validation)
  @observable touched = false;

  // Constructor for Field
  constructor(id, options = {}) {
    if (!id) {
      console.warn('Fields need a fieldId to work.');
      throw new Error('Please pass a fieldId to all fields. Passed options:', options);
    }

    const {
      validate, initialValue, showError, isSchemaValidation,
    } = options;
    // Set our fieldId
    this.fieldId = id;
    if (validate) {
      this.validate = validate;
    }

    this.isSchemaValidation = isSchemaValidation;

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
          this.touched = true;
          this.isPristine = false;
        } else {
          this.isPristine = true;
        }
      });
    }
  }

  @action.bound
  onBlur() {
    runInAction(() => {
      // We tab away so you are touched
      this.touched = true;
    });
  }

  @action.bound
  onFocus() {
    runInAction(() => {
      // We focus you so remove error for a while until tabbed away
      if (!this.value) { this.touched = false; }
    });
  }

  @action.bound
  async validateField() {
    // Only validate when we want to see errors and we have a function for it
    this.onBlur();
    if (this.validate && this.showError) {
      if (this.isSchemaValidation) {
        await this.validate();
      } else {
        const error = await this.validate(this.value);
        runInAction(() => {
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
}
