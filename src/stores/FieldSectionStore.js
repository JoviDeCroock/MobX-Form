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
    // TODO
    return null;
  }

  @action.bound
  reset() {
    runInAction(() => {
      Object.values(this.fields).forEach(field => field.reset());
    });
  }
}
