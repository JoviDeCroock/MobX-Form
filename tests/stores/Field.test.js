import FieldStore from '../../src/stores/FieldStore';

// eslint-disable-rule no-undef

describe('FieldStore', () => {
  it('All types should be right', () => {
    const validateFunc = () => console.log('Vaid');
    const initialValue = 'Rik';
    const fieldStore = new FieldStore('testField', {
      initialValue,
      validate: validateFunc,
    });

    expect(typeof fieldStore).toEqual('object');

    const {
      fieldId, validate, error, value, showError, isPristine, isValid,
    } = fieldStore;

    expect(typeof fieldId).toEqual('string');
    expect(fieldId).toEqual('testField');
    expect(typeof validate).toEqual('function');
    expect(validate).toEqual(validateFunc);
    expect(typeof value).toEqual('string');
    expect(value).toEqual('Rik');
    expect(typeof showError).toEqual('boolean');
    expect(showError).toEqual(true);
    expect(typeof isValid).toEqual('boolean');
    expect(isValid).toEqual(false);
    expect(typeof isPristine).toEqual('boolean');
    expect(isPristine).toEqual(true);
    expect(error).toEqual(undefined);
  });

  it('Should change showError with constructor', () => {
    const field = new FieldStore('id', { showError: false });
    expect(field.showError).toEqual(false);
  });

  it('Should change isPristine with onChange', () => {
    const field = new FieldStore('testField');
    expect(field.isPristine).toEqual(true);
    field.onChange('x');
    expect(field.isPristine).toEqual(false);
    field.onChange('');
    expect(field.isPristine).toEqual(true);
  });

  it('Should error without an id', () => {
    try {
      const fieldStore = new FieldStore();
      // useless line
      fieldStore.onChange('x');
      expect(true).toEqual(false);
    } catch (err) {
      expect(err.message).toEqual('Please pass a fieldId to all fields. Passed options:');
    }
  });

  it('Should not validate without a function', () => {
    const initialValue = 'Rik';
    const fieldStore = new FieldStore('testField', {
      initialValue,
    });
    expect(fieldStore.error).toEqual(undefined);
    fieldStore.validateField();
    expect(fieldStore.error).toEqual(undefined);
  });

  it('OnChange should work', () => {
    const validateFunc = () => console.log('Valid');
    const initialValue = 'Rik';
    const fieldStore = new FieldStore('testField', {
      initialValue,
      validate: validateFunc,
    });
    expect(fieldStore.value).toEqual('Rik');
    fieldStore.onChange('Rik');
    expect(fieldStore.value).toEqual('Rik');
    fieldStore.onChange('Rikii');
    expect(fieldStore.value).toEqual('Rikii');
  });

  it('Validate should work', () => {
    const error = 'Length';
    const validateFunc = (value) => { if (value.length <= 3) { return error; } return null; };
    const initialValue = 'Rik';
    const fieldStore = new FieldStore('testField', {
      initialValue,
      validate: validateFunc,
    });

    expect(fieldStore.error).toEqual(undefined);
    fieldStore.validateField();
    expect(fieldStore.error).toEqual(error);
    expect(fieldStore.isValid).toEqual(false);
    fieldStore.onChange('Rikii');
    fieldStore.validateField();
    expect(fieldStore.error).toEqual(null);
    expect(fieldStore.isValid).toEqual(true);
  });

  it('Reset should work', () => {
    const initialValue = 'Rik';
    const fieldStore = new FieldStore('testField', {
      initialValue,
    });

    const fieldStore2 = new FieldStore('testField2');

    expect(fieldStore.value).toEqual(initialValue);
    fieldStore.onChange('Rikii');
    expect(fieldStore.value).toEqual('Rikii');
    fieldStore.reset();
    expect(fieldStore.value).toEqual(initialValue);
    expect(fieldStore2.value).toEqual(undefined);
    fieldStore2.onChange('Rikii');
    expect(fieldStore2.value).toEqual('Rikii');
    fieldStore2.reset();
    expect(fieldStore2.value).toEqual('');
  });
});
