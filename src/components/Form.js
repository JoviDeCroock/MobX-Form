import React, { PureComponent } from 'react';
import { observer } from 'mobx-react';

import Provider from './createContext';
import FormStore from '../stores/FormStore';

const createForm = options => function renderForm(Component) {
  @observer
  class Form extends PureComponent {
    constructor(props) {
      super(props);
      // Allow prop passing as <Form {...properties} /> and with Form({ ...properties }).
      // These will be merged, with the Form HOC having higher prio than the JSX properties.
      const newOptions = { ...options, ...props };
      this.formStore = new FormStore(newOptions);
    }

    componentWillUnmount() {
      this.formStore.resetFields();
    }

    render() {
      const {
        error,
        isValid,
        onChange,
        onSubmit,
        patchValues,
        resetFields,
        validateForm,
        validateField,
      } = this.formStore;

      // inject the form with its normal props and with some handy methods from the formStore
      return (
        <Provider value={this.formStore}>
          <Component
            {...this.props}
            change={onChange}
            isValid={isValid}
            error={error}
            onSubmit={onSubmit}
            patchValues={patchValues}
            resetFields={resetFields}
            validateForm={validateForm}
            validateField={validateField} />
        </Provider>
      );
    }
  }
  return Form;
};

export default createForm;
