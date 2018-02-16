import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import Field from './FieldStore';

@observer
class ComponentField extends Component {
  static propTypes = {
    C: PropTypes.func.isRequired,
    fieldId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    store: PropTypes.object,
  }

  static defaultProps = {
    placeholder: null,
  }

  constructor(props) {
    super(props);
    this.store = props.store;
    const { fieldId, ...rest } = props;
    const field = new Field(fieldId, rest);
    this.store.addField(field); // Add created field to our store
  }

  render() {
    const { C, fieldId, ...restProps } = this.props;
    const { onChange } = this.store;
    const { value } = this.store.fields[fieldId];

    // Value and onChange passed by our Field/Form
    const fieldProperties = {
      fieldId,
      onChange,
      value,
    };

    return (
      <C {...restProps} {...fieldProperties} />
    );
  }
}

export default ComponentField;
