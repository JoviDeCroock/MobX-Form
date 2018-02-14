import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx';

import Field from './Field';

const createField = (store) => {
  @observer
  class ComponentField extends Component {
    static propTypes = {
      C: PropTypes.node.isRequired,
      fieldId: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      placeholder: PropTypes.string,
    }

    static defaultProps = {
      placeholder: null,
    }

    constructor(props) {
      super(props);
      this.store = store;
      const { fieldId, ...rest } = props;
      this.field = new Field(fieldId, rest);
      store.addField(props); // Add created field to our store
    }

    render() {
      const { C, fieldId, ...restProps } = this.props;
      const { onChange } = this.store;
      const storeField = this.store.fields[fieldId];
      const { value } = storeField;

      // Value and onChange passed by our Field/Form
      const fieldProperties = {
        onChange,
        value,
      };


      return (
        <C {...restProps} {...fieldProperties} />
      );
    }
  }

  return ComponentField;
};

export default createField;
