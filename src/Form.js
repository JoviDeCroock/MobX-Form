import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx';

import FormStore from './FormStore';

const createForm = () => {
  const formStore = new FormStore();
  @observer
  class Form extends Component {
    static propTypes = {
      // Implies the root component
      C: PropTypes.node.isRequired,
    }

    render() {
      const { C, ...restProps } = this.props;
      return (
        <C {...restProps} form={formStore} />
      );
    }
  }

  return Form;
};

export default createForm;
