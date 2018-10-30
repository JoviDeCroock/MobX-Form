import { action, observable, runInAction } from 'mobx';

export default class FieldSection {
  static mobxLoggerConfig = {
    enabled: false,
    methods: {
      onChange: true,
    },
  };

  fieldId;
  isFieldSection = true;

  @observable fields = {};

  constructor(fieldId) {
    this.fieldId = fieldId;
  }

  get fieldValues() {
    return Object.keys(this.fields).reduce((acc, key) => {
      if (this.fields[key].isFieldSection) {
        return {
          ...acc,
          [key]: this.fields[key].fieldValues,
        };
      } else if (this.fields[key].isField) {
        return {
          ...acc,
          [key]: this.fields[key].value,
        };
      }
      return acc;
    }, {});
  }

  @action.bound
  setErrors(errors = {}) {
    const errorKeys = Object.keys(errors);
    runInAction(() => {
      errorKeys.forEach((fieldKey) => {
        if (!this.fields[fieldKey]) {
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
      const formValueKeys = Object.keys(this.fields);
      formValueKeys.filter(key => !errorKeys.includes(key)).forEach((validKey) => {
        this.fields[validKey].error = null;
      });
    });
  }

  @action.bound
  patchValue(key, value) {
    if (typeof value === 'object') {
      Object.keys(value).forEach((subKey) => {
        const subField = this.fields[subKey];
        if (!subField) {
          console.error(`Can't find field with id "${subKey}" provided in patchValues.`);
          return;
        }
        if (subField.isFieldSection) {
          subField.patchValue(subKey, value[subKey]);
        } else {
          subField.onChange(value[subKey]);
        }
      });
    } else {
      const field = this.fields[key];
      if (!field) {
        console.error(`Can't find field with id "${key}" provided in patchValues.`);
        return;
      }
      field.onChange(value);
    }
  }

  @action.bound
  addField(field, currentIndex) {
    const parts = field.fieldId.split('.');
    if (currentIndex === parts.length - 1) {
      this.fields[parts[currentIndex]] = field;
    } else {
      this.fields[parts[currentIndex]].addField(field, currentIndex + 1);
    }
  }

  @action.bound
  validateFields() {
    runInAction(() => {
      Object.values(this.fields).forEach((field) => {
        if (field.isField) {
          return field.validate();
        } else if (field.isFieldSection) {
          return field.validateFields();
        }
        return null;
      });
    });
  }

  @action.bound
  reset() {
    runInAction(() => {
      Object.values(this.fields).forEach(field => field.reset());
    });
  }
}
