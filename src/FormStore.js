// Can function as our main injection point
import { observable, action, runInAction } from 'mobx';

export default class Form {
  name;
  // Function to validate from
  validate;
  @observable
  fields = {};

  @action.bound
  addField(field) {
    runInAction(() => {
      this.fields[field.fieldId] = field;
    });
  }

  @action.bound
  onChange(fieldId, value) {
    this.fields[fieldId].onChange(value);
  }
}
