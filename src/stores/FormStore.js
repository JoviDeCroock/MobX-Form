// Can function as our main injection point
import { observable, action, runInAction } from 'mobx';

export default class Form {
  // Will be our formName (future context use, extend to respect multi-forms)
  name;

  // Will hold our function to submit the form
  handleSubmit;
  // Will hold our hooks for error/success
  onSuccess;
  onError;


  // Observables
  @observable fields = {};
  @observable validators = {};
  @observable validationSchema;
  @observable initialValues = {};
  @observable submitted = false;
  @observable error = null;

  constructor(options = {}) {
    // Destructure our options
    const {
      handleSubmit, initialValues, validators, onSuccess, onError,
    } = options;
    // handleSubmit should be passed AND be a function
    if (!handleSubmit || typeof handleSubmit !== 'function') {
      console.warn('Forms need a handleSubmit function to work.');
      throw new Error('Please pass a handleSubmit function.');
    }

    if (validators) {
      Object.keys(validators).forEach((fieldId) => {
        if (typeof validators[fieldId] === 'function') {
          // Only pass into validators if it's a function
          this.validators[fieldId] = validators[fieldId];
        }
        // We can possibly extend this by checking if it's one of our allowed validation strings
        // TODO: write later
      });
    }
    this.handleSubmit = handleSubmit;
    this.onSuccess = onSuccess || null;
    this.onError = onError || null;
    this.initialValues = initialValues || {};
  }

  // @computed
  // get dirty() {
  //   const values = Object.values(this.fields).filter(({ isPristine }) => isPristine);
  //   return (values.length !== 0);
  // }

  @action.bound
  resetFields() {
    runInAction(() => Object.values(this.fields).map(field => field.reset()));
  }

  @action.bound
  addField(field) {
    // No validation needed since this isn't an exposed action
    this.fields[field.fieldId] = field;
  }

  @action.bound
  onChange(fieldId, value = null) {
    // Exposed action be carefull for crashes
    if (!fieldId) { console.warn('Please pass a valid fieldId when onChanging from the FormInstance.'); }
    if (this.fields[fieldId]) {
      runInAction(() => {
        this.fields[fieldId].onChange(value);
      });
    }
  }

  @action.bound
  async onSubmit(event) {
    if (event) {
      // In React-Native there is no notion of event so let's only prevent when needed
      event.preventDefault();
    }

    const isValid = this.validateForm();
    if (isValid) {
      const values = {};
      Object.keys(this.fields).forEach((key) => {
        values[key] = this.fields[key].value;
      });
      try {
        // See Promise.resolve(function(){ return x })
        // Will work for normal functions aswell
        const result = await this.handleSubmit(values);
        // If we have an onSuccess preform it (possibly async)
        if (this.onSuccess) {
          await this.onSuccess(result);
        }
      } catch (err) {
        runInAction(async () => {
          // This has errored (something wrong with submit/success)
          // Set our error
          console.log(err);
          this.error = err;
          // onError hook provided? Use it!
          if (this.onError) {
            await this.onError(err);
          }
        });
      }
    }
  }

  // Calls validate on all our fields
  @action.bound
  validateForm() {
    // Let's assume it's a valid form
    let isValid = true;
    runInAction(() => {
      // Run all of our validates in an action
      Object.values(this.fields).forEach((field) => {
        field.validateField();
        // If this produces an error we aren't valid anymore (underlying will display this aswell)
        if (field.error) {
          isValid = false;
        }
      });
    });

    // Return this in case we are submitting/force validating in UI
    return isValid;
  }

  // Calls validate on a field
  @action.bound
  validateField(fieldId) {
    // Warn our consumer he's not passing a fieldId so he can't use this function
    if (!fieldId) { console.warn('You need a fieldId to validate a Field did you mean validateForm?'); }
    if (this.fields[fieldId]) {
      this.fields[fieldId].validateField();
    }
  }
}
