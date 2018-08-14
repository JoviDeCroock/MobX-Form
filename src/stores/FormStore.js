// Can function as our main injection point
import { observable, action, runInAction, transaction } from 'mobx';

export default class Form {
  static mobxLoggerConfig = {
    enabled: false,
    methods: {
      onChange: true,
      onSubmit: true,
      patchValues: true,
    },
  };

  // Will be our formName (future context use, extend to respect multi-forms)
  name;

  // Will hold our function to submit the form
  handleSubmit;

  // Flag if we have individual validators or are validating according to schema
  isSchemaValidation;

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
      handleSubmit, initialValues, validate, onSuccess, onError,
    } = options;
    // handleSubmit should be passed AND be a function
    if (!handleSubmit || typeof handleSubmit !== 'function') {
      console.warn('Forms need a handleSubmit function to work.');
      throw new Error('Please pass a handleSubmit function.');
    }

    if (validate && typeof validate === 'object') {
      Object.keys(validate).forEach((fieldId) => {
        if (typeof validate[fieldId] === 'function') {
          // Only pass into validate if it's a function
          this.validators[fieldId] = validate[fieldId];
        }
      });
    } else if (validate && typeof validate === 'function') {
      this.isSchemaValidation = true;
      this.validate = validate;
    }

    this.handleSubmit = handleSubmit;
    this.onSuccess = onSuccess || null;
    this.onError = onError || null;
    if (initialValues) {
      // this.patchValues(initialValues);
    }
  }

  get fieldValues() {
    const values = {};
    Object.keys(this.fields).forEach((key) => {
      const field = this.fields[key];
      if (field.isFieldSection) {
        // Try a getValues function maybe so we can handle the tree recursively.
        values[key] = field.fieldValues;
      } else if (field.isField) {
        values[key] = field.value;
      }
    });
    return values;
  }

  @action.bound
  resetFields() {
    runInAction(() => Object.values(this.fields).map(field => field.reset()));
  }

  @action.bound
  addFieldSection(field) {
    if (field.fieldId.includes('.')) {
      this.fields[field.fieldId.split('.')[0]].addField(field, 1);
    } else {
      this.fields[field.fieldId] = field;
    }
  }

  @action.bound
  addField(field) {
    if (field.fieldId.includes('.')) {
      this.fields[field.fieldId.split('.')[0]].addField(field, 1);
    } else {
      this.fields[field.fieldId] = field;
    }
  }

  @action.bound
  onChange(fieldId, value = null) {
    if (!fieldId) { console.warn('Please pass a valid fieldId when onChanging from the FormInstance.'); }
    if (fieldId.includes('.')) {
      const parts = fieldId.split('.');
      runInAction(() => this.fields[parts[0]].onChange(fieldId, value, 0));
    } else if (this.fields[fieldId]) {
      runInAction(() => { this.fields[fieldId].onChange(value); });
    } else {
      this.fields[fieldId] = { value };
    }
  }

  @action.bound
  async onSubmit(event) {
    if (event) {
      // In React-Native there is no notion of event so let's only prevent when needed
      event.preventDefault();
    }

    const isValid = await this.validateForm();
    if (isValid) {
      const values = this.fieldValues;
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
          if (typeof err === 'string') {
            this.error = err;
          } else {
            this.error = err.message || (err.body && err.body.message) || 'Submission error';
          }
          // onError hook provided? Use it!
          if (this.onError) {
            await this.onError(err);
          }
        });
      }
    }
  }

  @action.bound
  patchValues(newValues) {
    // Needs to be an object
    if (typeof newValues !== 'object') {
      console.warn(`Forms the newValues need to be off the object typen, received "${typeof newValues}".`);
      return;
    }
    // DO it transactionally to avoid unneeded rerenders
    transaction(() => {
      Object.keys(newValues).forEach((key) => {
        const value = this.fields[key];
        if (!value) {
          console.error(`Can't find field with id "${key}" provided in patchValues.`);
        }
        if (value.isFieldSection) {
          value.patchValue(key, newValues[key]);
        } else {
          value.onChange(newValues[key]);
        }
      });
    });
  }

  // Calls validate on all our fields
  @action.bound
  async validateForm() {
    // Let's assume it's a valid form
    let isValid = true;
    // Run all of our validates in an action
    if (this.isSchemaValidation) {
      // Schema
      const formValues = this.fieldValues;
      const errors = await this.validate(formValues);
      if (errors) {
        const errorKeys = Object.keys(errors);
        runInAction(() => {
          errorKeys.forEach((fieldKey) => {
            if (this.fields[fieldKey]) {
              console.error(`Can't find field with id "${fieldKey}" provided in your validators.`);
              return;
            }
            if (typeof errors[fieldKey] === 'object') {
              this.fields[fieldKey].setErrors(errors[fieldKey]);
            }
            if (this.fields[fieldKey].touched) {
              this.fields[fieldKey].error = errors[fieldKey];
            }
          });
          const formValueKeys = Object.keys(formValues);
          formValueKeys.filter(key => !errorKeys.includes(key)).forEach((validKey) => {
            this.fields[validKey].error = null;
          });
        });

        if (errorKeys.length > 0) {
          isValid = false;
        }
      } else {
        runInAction(() => { Object.keys(this.fields).forEach((key) => { this.fields[key].error = null; }); });
      }
    } else {
      await Object.values(this.fields).forEach(async (field) => {
        if (field.isFieldSection) {
          await field.validateFields();
        } else {
          await field.validateField();
        }
        // If this produces an error we aren't valid anymore (underlying will display this aswell)
        if (field.error) {
          isValid = false;
        }
      });
    }
    // Return this in case we are submitting/force validating in UI
    return isValid;
  }

  // Calls validate on a field
  @action.bound
  async validateField(fieldId) {
    // Warn our consumer he's not passing a fieldId so he can't use this function
    if (!fieldId) { console.warn('You need a fieldId to validate a Field did you mean validateForm?'); }
    if (this.fields[fieldId]) {
      await this.fields[fieldId].validateField();
    }
  }
}
