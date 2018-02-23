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

async function handleSubmit(values) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(values);
      resolve(values);
    }, 1000);
  });
}

function onSuccess() {
  // Pop Happiness
  console.warn('Successs');
}

function onError(error) {
  // Pop Sadness
  console.warn(error);
}

const validators = {
  password: function validatePassword(value) {
    if (value.length < 6) {
      return 'Insufficient length';
    }
    return false;
  },
  username: function validateUsername(value) {
    if (value.length < 6) {
      return 'Insufficient length';
    }
    return false;
  },
};

const initialValues = {
  username: 'userE',
};

export default Form({
  handleSubmit,
  initialValues,
  onError,
  onSuccess,
  validators,
})(LoginForm);
