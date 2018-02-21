// Can function as our main injection point
import { observable, action, runInAction } from 'mobx';

export default class Form {
  // Will be our formName (future context use)
  name;
  // Will hold our function to submit the form
  handleSubmit;


  // Will hold our initialValues
  @observable initialValues = {};
  // Observables
  @observable fields = {};
  @observable validators = {};
  @observable submitted = false;
  @observable error = null;

  constructor(options = {}) {
    // Destructure our options
    const {
      handleSubmit, initialValues, validators, onSuccess, onError,
    } = options;

    // handleSubmit should be passed AND be a function
    if (!handleSubmit || typeof handleSubmit !== 'function') {
      throw Error('Please pass a handleSubmit function.');
    }

    if (validators) {
      Object.keys(validators).forEach((fieldId) => {
        if (typeof validators[fieldId] === 'function') {
          // Only pass into validators if it's a functions
          this.validators[fieldId] = validators[fieldId];
        }
      });
    }
    this.handleSubmit = handleSubmit;
    this.onSuccess = onSuccess || null;
    this.onError = onError || null;
    this.initialValues = initialValues || {};
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
  async onSubmit(event) {
    if (event) {
      event.preventDefault();
    }

    const isValid = this.validateForm();
    if (isValid) {
      const values = Object.values(this.fields).map(field => field.value);
      try {
        // See Promise.resolve(function(){ return x })
        // Will work for normal functions aswell
        await this.handleSubmit(values);
        if (this.onSuccess) {
          await this.onSuccess();
        }
      } catch (err) {
        this.error = err;
        if (this.onError) {
          await this.onError(err);
        }
      }
    }
  }

  // Calls validate on all our fields
  @action.bound
  validateForm() {
    let isValid = true;
    runInAction(() => {
      Object.values(this.fields).forEach((field) => {
        field.validateField();
        if (field.error) {
          isValid = false;
        }
      });
    });
    return isValid;
  }

  // Calls validate on all a field
  @action.bound
  validateField(fieldId) {
    this.fields[fieldId].validateField();
  }
}
