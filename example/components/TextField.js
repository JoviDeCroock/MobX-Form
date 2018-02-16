import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class TextFieldComponent extends PureComponent {
  static propTypes = {
    fieldId: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
  }

  static defaultProps = {
    placeholder: null,
    type: 'text',
    value: '',
  }

  onChange = (e) => {
    const { fieldId, onChange } = this.props;
    const newValue = e.target.value;
    onChange(fieldId, newValue);
  }

  render() {
    const { placeholder, type, value } = this.props;
    return (
      <input
        onChange={this.onChange}
        placeholder={placeholder}
        type={type}
        value={value} />
    );
  }
}

export default TextFieldComponent;
