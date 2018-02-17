import React from 'react';
import PropTypes from 'prop-types';

import TextField from './components/TextField';
// External library
import Form from '../src/Form';
import Field from '../src/Field';

const LoginForm = ({ formStore: { onSubmit } }) => (
  <form onSubmit={onSubmit}>
    <Field
      Component={TextField}
      fieldId="username"
      label="username"
      placeholder="username" />
    <Field
      Component={TextField}
      fieldId="password"
      label="password"
      type="password"
      placeholder="password" />
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
