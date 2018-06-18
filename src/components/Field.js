import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import Field from '../stores/FieldStore';

@observer
class ComponentField extends React.Component {
  static propTypes = {
    Component: PropTypes.func.isRequired,
    fieldId: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    showError: PropTypes.bool,
  }

  static contextTypes = {
    formStore: PropTypes.object,
  }

  static defaultProps = {
    placeholder: null,
    showError: true,
  }

  constructor(props, context) {
    super(props);
    const { fieldId } = props;

    // Bind our formStore from context to our this
    this.store = context.formStore.form;

    let validationFunction = this.store.validators[fieldId];
    const { isSchemaValidation } = this.store;
    this.isSchemaValidation = isSchemaValidation;
    if (isSchemaValidation) {
      validationFunction = this.store.validateForm;
    }
    const initialValue = this.store.initialValues[fieldId];
    // Options for our Field given upon Form creation
    const options = {
      initialValue,
      isSchemaValidation,
      showError: props.showError,
      validate: validationFunction,
    };
    const field = new Field(fieldId, options);
    // Bind it to this since we'll have to use it more than once
    this.field = field;
    // Add created field to our formStore
    this.store.addField(field);
  }

  componentWillUnmount() {
    // No residual values! Clean up your doodoo's
    this.field.reset();
  }

  onChange = (value) => {
    this.store.onChange(this.props.fieldId, value);
  }

  render() {
    const { Component, fieldId, ...restProps } = this.props;
    const {
      error,
      onFocus,
      value,
      validateField,
      reset,
      touched,
    } = this.store.fields[fieldId];

    // Value and onChange passed by our Field/Form
    const fieldProperties = {
      error: touched ? error : undefined,
      // Change this to touched: true for schemaValidation
      onBlur: validateField,
      onChange: this.props.onChange ? this.props.onChange : this.onChange,
      onFocus,
      reset,
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
