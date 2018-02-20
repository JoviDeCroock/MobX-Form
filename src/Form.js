import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import FormStore from './FormStore';

const createForm = (C, options) => {
  const formStore = new FormStore(options);

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
      return (
        <C {...this.props} formStore={formStore} />
      );
    }
  }

  return Form;
};

export default createForm;
