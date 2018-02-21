import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import Field from './FieldStore';

@observer
class ComponentField extends React.Component {
  static contextTypes = {
    mobxStores: PropTypes.object,
  }

  static propTypes = {
    Component: PropTypes.func.isRequired,
    fieldId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
  }

  static defaultProps = {
    placeholder: null,
  }

  constructor(props, context) {
    super(props);
    const { fieldId } = props;
    this.store = context.mobxStores.form;

    const validationFunction = this.store.validators[fieldId];
    const initialValue = this.store.initialValues[fieldId];
    const options = { initialValue, validate: validationFunction };
    const field = new Field(fieldId, options);
    this.store.addField(field); // Add created field to our store
  }

  onChange = (value) => {
    this.store.onChange(this.props.fieldId, value);
  }

  render() {
    const { Component, fieldId, ...restProps } = this.props;
    const { value, validateField, error } = this.store.fields[fieldId];

    // Value and onChange passed by our Field/Form
    const fieldProperties = {
      error,
      onBlur: validateField,
      onChange: this.props.onChange ? this.props.onChange : this.onChange,
      value,
    };

    return (
      <Component
        {...restProps}
        {...fieldProperties} />
    );
  }
}

export default ComponentField;
