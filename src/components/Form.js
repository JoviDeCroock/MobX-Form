import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import FormStore from '../stores/FormStore';

const createForm = (options) => {
  const formStore = new FormStore(options);
  return function renderForm(Component) {
    @observer
    class Form extends React.Component {
      static contextTypes = {
        formStore: PropTypes.object,
      }

      static childContextTypes = {
        formStore: PropTypes.object,
      }

      getChildContext() {
        const stores = {};
        // add own stores
        stores.form = formStore;
        return { formStore: stores };
      }

      componentWillUnmount() {
        formStore.resetFields();
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
        } = formStore;

        // inject the form with its normal props and with some handy methods from the formStore
        return (
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
        );
      }
    }
    return Form;
  };
};

export default createForm;
