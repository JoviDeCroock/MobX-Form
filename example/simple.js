import React, { Fragment } from 'react';
import { Form, FieldSection } from 'mobx-formstate';

import TextField from '../components/TextField';

class SimpleForm extends React.Component {
  state = {
    firstTime: true,
  };

  componentDidMount() {
    if (this.state.firstTime) {
      this.setState({ firstTime: false });
      this.props.patchValues({
        address: {
          city: 'Wichelen',
          house: {
            cuck: 'Mooi en Klein',
          },
        },
        username: 'Michael',
      });
    }
  }

  renderHouse = fieldId => (
    <Fragment>
        <TextField
          fieldId={`${fieldId}.cuck`}
          label="Cuck"
          placeholder="Cuck" />
        <TextField
          fieldId={`${fieldId}.ceck`}
          label="Ceck"
          placeholder="Ceck" />
      </Fragment>
  )

  renderAddress = (fieldId, additionalProps) => (
    <Fragment>
        <TextField
          fieldId={`${fieldId}.city`}
          label="city"
          placeholder="city" />
        <TextField
          fieldId={`${fieldId}.street`}
          label="street"
          placeholder="street" />
        <FieldSection fieldId={`${fieldId}.house`} render={this.renderHouse} extraProps={{ hello: ' World' }} />
      </Fragment>
  )

  render() {
    const { onSubmit } = this.props;
    return (
      <form onSubmit={onSubmit}>
        <TextField
          fieldId="username"
          label="username"
          placeholder="username" />
        <FieldSection fieldId="address" render={this.renderAddress} extraProps={{ hello: ' World' }} />
        <button type="submit">Click me</button>
      </form>
    );
  }
}

function validate(values) {
  console.log(values);
  return null;
}

export default Form({
  handleSubmit: console.log,
  validate,
})(SimpleForm);
