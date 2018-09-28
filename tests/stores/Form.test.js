/* eslint-disable no-console */
import FormStore from '../../src/stores/FormStore';
import FieldStore from '../../src/stores/FieldStore';

describe('FormStore', () => {
  // Mocked preventDefault for onSubmit
  const event = { preventDefault: () => {} };

  beforeEach(() => {
    jest.spyOn(event, 'preventDefault');
  });

  it('All types should be right', () => {
    const handleSubmit = () => console.log('hello');
    const formStore = new FormStore({ handleSubmit });
    expect(typeof formStore.fields).toEqual('object');
    expect(typeof formStore.validators).toEqual('object');
  });

  it('Should error when not passing a handleSubmit.', () => {
    try {
      const formStore = new FormStore();
      // useless line to satisfy the linter
      formStore.addField();
      // We should never reach this.
      expect(false).toEqual(true);
    } catch (e) {
      expect(e.message).toEqual('Please pass a handleSubmit function.');
    }
  });

  it('Should error when passing a string as handleSubmit.', () => {
    try {
      const formStore = new FormStore({ handleSubmit: 'notAFunction' });
      // useless line to satisfy the linter
      formStore.addField();
      // We should never reach this.
      expect(false).toEqual(true);
    } catch (e) {
      expect(e.message).toEqual('Please pass a handleSubmit function.');
    }
  });

  it('Should succesfully construct with a handleSubmit function.', () => {
    const handleSubmit = () => console.log('hello');
    const formStore = new FormStore({ handleSubmit });
    expect(typeof formStore.handleSubmit).toEqual('function');
  });

  it('Should succesfully add validators.', () => {
    const handleSubmit = () => console.log('hello');
    const validate = {
      func: () => console.log('Validating text'),
    };

    const formStore = new FormStore({ handleSubmit, validate });
    expect(typeof formStore.validators.func).toEqual('function');
  });

  it('Should succesfully add initialValues.', () => {
    const handleSubmit = () => console.log('hello');
    const initialValues = {
      testField: 'test',
    };

    const formStore = new FormStore({ handleSubmit, initialValues });
    expect(formStore.initialValues.testField).toEqual('test');
  });

  it('Should succesfully add validator functions and ignore non functions.', () => {
    const handleSubmit = () => console.log('hello');
    const validate = {
      func: () => console.log('Validating text'),
      nonFunc: 'herrow',
    };

    const formStore = new FormStore({ handleSubmit, validate });
    expect(typeof formStore.validators.func).toEqual('function');
    expect(formStore.validators.nonFunc).toEqual(undefined);
  });

  it('Should add a field when creating one.', () => {
    const handleSubmit = () => console.log('hello');
    const formStore = new FormStore({ handleSubmit });
    const fieldStore = new FieldStore('testField');
    formStore.addField(fieldStore);

    // Tests
    const formField = formStore.fields.testField;
    expect(typeof formField).toEqual('object');
    expect(formField.validate).toEqual(null);
    expect(formField.fieldId).toEqual('testField');
  });

  it('Should submit when valid', () => {
    const handleSubmit = () => {};
    const onSuccess = () => {};
    const validators = {
      testField: (value) => {
        if (value.length <= 3) {
          return 'error';
        }
        return null;
      },
    };

    const initialValues = {
      testField: 'Rikii',
    };

    const formStore = new FormStore({
      handleSubmit, initialValues, onSuccess, validators,
    });
    formStore.addField(new FieldStore('testField', {
      initialValue: initialValues.testField,
      validate: validators.testField,
    }));

    formStore.onSubmit(event);
    expect(event.preventDefault).toBeCalled();
    expect(formStore.error).toEqual(null);
  });

  it('should not submit when invalid', async () => {
    const handleSubmit = () => console.log('hello');
    const validate = {
      testField: (value) => {
        if (value.length <= 3) {
          return 'error';
        }
        return null;
      },
    };
    const initialValues = {
      testField: 'Rik',
    };

    const formStore = new FormStore({ handleSubmit, initialValues, validate });
    formStore.addField(new FieldStore('testField', {
      initialValue: initialValues.testField,
      validate: validate.testField,
    }));

    await formStore.onSubmit();
    expect(formStore.fields.testField.error).toEqual('error');
    formStore.onChange('testField', 'Riki');
    expect(formStore.fields.testField.value).toEqual('Riki');
    await formStore.onSubmit();
    expect(formStore.fields.testField.error).toEqual(null);
  });

  it('should call onError when crashing', async () => {
    // eslint-disable-next-line
    const handleSubmit = () => { x = y; };
    const onError = er => console.log(er);

    const initialValues = {
      testField: 'Rikiiiii',
    };

    const formStore = new FormStore({ handleSubmit, initialValues, onError });
    formStore.addField(new FieldStore('testField', {
      initialValue: initialValues.testField,
    }));

    await formStore.onSubmit();
    console.log(onError);
    expect(formStore.error).toEqual('y is not defined');
  });

  it('should call onError when crashing', async () => {
    // eslint-disable-next-line
    const handleSubmit = () => { x = y; };

    const initialValues = {
      testField: 'Rikiiiii',
    };

    const formStore = new FormStore({ handleSubmit, initialValues });
    formStore.addField(new FieldStore('testField', {
      initialValue: initialValues.testField,
    }));

    await formStore.onSubmit();
    expect(formStore.error).toEqual('y is not defined');
  });


  it('should validate single fields', async () => {
    const handleSubmit = () => console.log('hello');
    const validators = {
      testField: (value) => {
        if (value.length <= 3) {
          return 'error';
        }
        return null;
      },
    };
    const initialValues = {
      testField: 'Rik',
    };

    const formStore = new FormStore({ handleSubmit, initialValues, validators });
    formStore.addField(new FieldStore('testField', {
      initialValue: initialValues.testField,
      validate: validators.testField,
    }));

    await formStore.validateField('testField');
    expect(formStore.fields.testField.error).toEqual('error');
    formStore.onChange('testField', 'Riki');
    expect(formStore.fields.testField.value).toEqual('Riki');
    await formStore.validateField('testField');
    expect(formStore.fields.testField.error).toEqual(null);
    await formStore.validateField();
    expect(formStore.fields.testField.error).toEqual(null);

    formStore.onChange('testField');
    expect(formStore.fields.testField.value).toEqual(null);
  });

  it('Should patch existing values and fail on non object', () => {
    const handleSubmit = () => console.log('hello');
    const validators = {
      testField: (value) => {
        if (value.length <= 3) {
          return 'error';
        }
        return null;
      },
    };
    const initialValues = {
      testField: 'Rik',
    };

    const formStore = new FormStore({ handleSubmit, initialValues, validators });
    formStore.addField(new FieldStore('testField', {
      initialValue: initialValues.testField,
      validate: validators.testField,
    }));

    expect(formStore.fields.testField.value).toEqual('Rik');
    formStore.patchValues({ testField: 'patched' });
    // Non existing should patch in case of for example a new id
    expect(formStore.fields.testField.value).toEqual('patched');
    // Fail case
    formStore.patchValues('testField');
    expect(formStore.fields.testField.value).toEqual('patched');
  });

  it('should reset all fields', () => {
    const handleSubmit = () => console.log('hello');
    const initialValues = {
      testField: 'Rik',
    };

    const formStore = new FormStore({ handleSubmit, initialValues });
    formStore.addField(new FieldStore('testField', {
      initialValue: initialValues.testField,
    }));
    formStore.addField(new FieldStore('testField2'));

    expect(formStore.fields.testField.value).toEqual(initialValues.testField);
    expect(formStore.fields.testField2.value).toEqual(undefined);
    formStore.onChange('testField', 'Rikii');
    formStore.onChange('testField2', 'Rikii');
    expect(formStore.fields.testField.value).toEqual('Rikii');
    expect(formStore.fields.testField2.value).toEqual('Rikii');
    formStore.resetFields();
    expect(formStore.fields.testField.value).toEqual(initialValues.testField);
    expect(formStore.fields.testField2.value).toEqual('');
  });

  it('should schemaValidate', async () => {
    const error = 'must match';
    const error2 = 'should match';
    const handleSubmit = () => console.log('hello');
    const initialValues = {
      testField: 'Rik',
      testField2: 'Riki',
    };
    const validate = (values) => {
      const { testField, testField2 } = values;
      if (testField !== testField2) {
        return { testField: error, testField2: error2 };
      }
      return null;
    };

    const formStore = new FormStore({ handleSubmit, initialValues, validate });
    formStore.addField(new FieldStore('testField', {
      initialValue: initialValues.testField,
    }));
    formStore.addField(new FieldStore('testField2'));

    expect(formStore.isSchemaValidation).toBeTruthy();
    formStore.fields.testField.onBlur();
    let valid = await formStore.validateForm();
    expect(formStore.fields.testField.error).toEqual(error);
    expect(formStore.fields.testField2.error).toEqual(undefined);
    expect(valid).toBeFalsy();
    await formStore.onSubmit();
    formStore.onChange('testField2', 'Rik');
    valid = await formStore.validateForm();
    expect(formStore.fields.testField.error).toEqual(null);
    expect(formStore.fields.testField2.error).toEqual(null);
    expect(valid).toBeTruthy();
    await formStore.onSubmit();
  });
});
