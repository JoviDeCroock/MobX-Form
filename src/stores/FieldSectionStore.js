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

  @observable values = {};

  constructor(fieldId) {
    this.fieldId = fieldId;
  }

  @action.bound
  reset() {
    runInAction(() => {
      this.values = {};
    });
  }
}
