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
    placeholder: PropTypes.string,
  }

  static defaultProps = {
    placeholder: null,
  }

  constructor(props, context) {
    super(props);
    this.store = context.mobxStores.form;
    const { fieldId, ...rest } = props;
    const field = new Field(fieldId, rest);
    this.store.addField(field); // Add created field to our store
  }

  render() {
    const { Component, fieldId, ...restProps } = this.props;
    const { onChange } = this.store;
    const { value } = this.store.fields[fieldId];

    // Value and onChange passed by our Field/Form
    const fieldProperties = {
      fieldId,
      onChange,
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
