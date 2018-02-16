import React, { Component } from 'react';
import { observer } from 'mobx-react';

import FormStore from './FormStore';

const createForm = (C, handleSubmit) => {
  const formStore = new FormStore(handleSubmit);
  @observer
  class Form extends Component {
    render() {
      return (
        <C {...this.props} formStore={formStore} />
      );
    }
  }

  return Form;
};

export default createForm;
