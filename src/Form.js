import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import FormStore from './FormStore';

const createForm = (options) => {
  const formStore = new FormStore(options);
  return function renderForm(C) {
    @observer
    class Form extends Component {
      static contextTypes = {
        mobxStores: PropTypes.object,
      }

      static childContextTypes = {
        mobxStores: PropTypes.object,
      }

      getChildContext() {
        const stores = {};
        // inherit stores (works with Provider)
        const baseStores = this.context.mobxStores;
        if (baseStores) {
          for (const key in baseStores) {
            stores[key] = baseStores[key];
          }
        }

        // add own stores
        stores.form = formStore;
        return { mobxStores: stores };
      }

      render() {
        // for next release inject seperate things
        const {
          values,
          onChange,
          onSubmit,
          validateForm,
          validateField,
        } = formStore;

        return (
          <C
            {...this.props}
            change={onChange}
            values={values}
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
