import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import FormStore from '../stores/FormStore';

const createForm = (options) => {
  const formStore = new FormStore(options);
  return function renderForm(C) {
    @observer
    class Form extends Component {
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

      render() {
        // for next release inject seperate things
        const {
          error,
          isValid,
          onChange,
          onSubmit,
          validateForm,
          validateField,
        } = formStore;

        // inject the form with its normal props and with some handy methods from the formStore
        return (
          <C
            {...this.props}
            change={onChange}
            isValid={isValid}
            error={error}
            onSubmit={onSubmit}
            validateForm={validateForm}
            validateField={validateField} />
        );
      }
    }
    return Form;
  };
};

export default createForm;
