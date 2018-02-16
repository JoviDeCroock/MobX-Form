import React from 'react';
import PropTypes from 'prop-types';

import TextField from './components/TextField';

// External library
import Form from '../src/Form';
import Field from '../src/Field';

const LoginForm = ({ formStore }) => (
  <form onSubmit={formStore.onSubmit}>
    <Field
      C={TextField}
      fieldId="username"
      label="username"
      placeholder="username"
      store={formStore} />
    <Field
      C={TextField}
      fieldId="password"
      label="password"
      type="password"
      placeholder="password"
      store={formStore} />
    <button
      label="Submit"
      type="submit" />
  </form>
);

LoginForm.propTypes = {
  formStore: PropTypes.object.isRequired,
};

function handleSubmit(values) {
  console.log(values);
}

export default Form(LoginForm, handleSubmit);
