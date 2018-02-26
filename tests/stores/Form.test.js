import FormStore from '../../src/stores/FormStore';
import FieldStore from '../../src/stores/FieldStore';

// eslint-disable-rule no-undef

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
    const validators = {
      func: () => console.log('Validating text'),
    };

    const formStore = new FormStore({ handleSubmit, validators });
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
    const validators = {
      func: () => console.log('Validating text'),
      nonFunc: 'herrow',
    };

    const formStore = new FormStore({ handleSubmit, validators });
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

  it('should not submit when invalid', () => {
    const handleSubmit = () => console.log('hello');
    const validators = {
      testField: (value) => {
        if (value.length <= 3) {
          return 'error';
        }
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

    formStore.onSubmit();
    expect(formStore.fields.testField.error).toEqual('error');
    formStore.onChange('testField', 'Riki');
    expect(formStore.fields.testField.value).toEqual('Riki');
    formStore.onSubmit();
    expect(formStore.fields.testField.error).toEqual(null);
  });

  it('should call onError when crashing', () => {
    const handleSubmit = () => { x = y; };
    const onError = er => console.log(er);

    const initialValues = {
      testField: 'Rikiiiii',
    };

    const formStore = new FormStore({ handleSubmit, initialValues, onError });
    formStore.addField(new FieldStore('testField', {
      initialValue: initialValues.testField,
    }));

    formStore.onSubmit();
    console.log(onError);
    expect(formStore.error).toBeInstanceOf(Error);
  });

  it('should call onError when crashing', () => {
    const handleSubmit = () => { x = y; };

    const initialValues = {
      testField: 'Rikiiiii',
    };

    const formStore = new FormStore({ handleSubmit, initialValues });
    formStore.addField(new FieldStore('testField', {
      initialValue: initialValues.testField,
    }));

    formStore.onSubmit();
    expect(formStore.error).toBeInstanceOf(Error);
  });


  it('should validate single fields', () => {
    const handleSubmit = () => console.log('hello');
    const validators = {
      testField: (value) => {
        if (value.length <= 3) {
          return 'error';
        }
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

    formStore.validateField('testField');
    expect(formStore.fields.testField.error).toEqual('error');
    formStore.onChange(null, 'Riki');
    formStore.onChange('testField', 'Riki');
    expect(formStore.fields.testField.value).toEqual('Riki');
    formStore.validateField('testField');
    expect(formStore.fields.testField.error).toEqual(null);
    formStore.validateField();
    expect(formStore.fields.testField.error).toEqual(null);
    formStore.onChange('testField');
    expect(formStore.fields.testField.value).toEqual(null);
  });
});
