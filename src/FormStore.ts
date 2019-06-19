import { action, observable } from 'mobx';
import * as React from 'react';
import { deriveInitial } from './helpers/deriveInitial';
import { get, set } from './helpers/operations';

interface ValidationSchema {
  [key: string]: ValidationSchema | ((value: any) => string | undefined | null);
}

interface Validators {
  [key: string]: Validators | ((value: any) => string | undefined | null);
}

function derive(schema: ValidationSchema, validators: Validators) {
  Object.keys(schema).forEach((key) => {
    const value = schema[key];
    if (typeof value === 'function') {
      validators[key] = value;
    } else {
      validators[key] = derive(value, validators);
    }
  });
  return validators;
}

function getValidators(schema: ValidationSchema) {
  return derive(schema, {});
}

export default class Form {

  // Observables
  @observable private values: any = {};
  @observable private errors: any = {};
  @observable private touched: any = {};

  // Flag if we have individual validators or are validating according to schema
  private isSchemaValidation: boolean;
  private validators: any = {};
  private validate: any;
  private validateOnBlur: boolean;
  private validateOnChange: boolean;
  private dirty: boolean;
  private shouldSubmitWhenInvalid: boolean;
  private onSubmit: any;

  constructor(options: any = {}) {
    // Destructure our options
    const { initialValues, onSubmit, validate } = options;

    if (validate && typeof validate === 'object') {
      this.isSchemaValidation = true;
      this.validators = getValidators(validate);
    } else if (validate && typeof validate === 'function') {
      this.validate = validate;
    }

    this.values = initialValues;
    this.touched = deriveInitial(initialValues, false);
  }

  public getFieldInfo(fieldId: string) {
    return {
      error: get(this.errors, fieldId),
      touched: get(this.touched, fieldId),
      value: get(this.values, fieldId),
    };
  }

  @action.bound
  public submit(e: React.SyntheticEvent) {
    if (e && e.preventDefault) e.preventDefault();
    const errors = this.validate();
    this.touched = deriveInitial(this.errors, true);
    if (!this.shouldSubmitWhenInvalid && Object.keys(errors).length > 0) return;
    this.onSubmit(this.values);
  }

  @action.bound
  public setFieldValue(fieldId: string, value: any) {
    this.values = set(this.values, fieldId, value);
  }

  @action.bound
  public onChange(fieldId: string, value: any = '') {
    this.setFieldValue(fieldId, value);
    if (this.validateOnChange) {
      if (this.isSchemaValidation) {
        this.validateField(fieldId);
      } else {
        this.errors = this.validate(this.values);
      }
    }
  }

  @action.bound
  public onFocus(fieldId: string) {
    set(this.touched, fieldId, false);
  }

  @action.bound
  public onBlur(fieldId: string, value: any = '') {
    set(this.touched, fieldId, true);
    if (this.validateOnBlur) {
      if (this.isSchemaValidation) {
        this.validateField(fieldId);
      } else {
        this.errors = this.validate(this.values);
      }
    }
  }

  // Calls validate on a field
  @action.bound
  public validateField(fieldId: string) {
    const validationFunc = get(this.validators, fieldId);
    if (validationFunc) {
      set(this.errors, fieldId, validationFunc(get(this.values, fieldId)));
    }
  }
}
