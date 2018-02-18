import FieldStore from '../../src/FieldStore';

describe('FieldStore', () => {
  it('All types should be right', () => {
    const validateFunc = () => console.log('Vaid');
    const initialValue = 'Rik';
    const fieldStore = new FieldStore('testField', {
      validate: validateFunc,
      initialValue,
    });

    expect(typeof fieldStore).toEqual('object');

    const { fieldId, validate, error, value, showError, isSubmitting, isPristine, isValidating, isValid } = fieldStore;
    expect(typeof fieldId).toEqual('string');
    expect(fieldId).toEqual('testField');
    expect(typeof validate).toEqual('function');
    expect(validate).toEqual(validateFunc);
    expect(typeof value).toEqual('string');
    expect(value).toEqual('Rik');
    expect(typeof showError).toEqual('boolean');
    expect(showError).toEqual(true);
    expect(typeof isSubmitting).toEqual('boolean');
    expect(isSubmitting).toEqual(false);
    expect(typeof isValidating).toEqual('boolean');
    expect(isValidating).toEqual(false);
    expect(typeof isValid).toEqual('boolean');
    expect(isValid).toEqual(false);
    expect(typeof isPristine).toEqual('boolean');
    expect(isPristine).toEqual(true);
    expect(error).toEqual(undefined);
  });

  it('Should error without an id', () => {
    try {
      new FieldStore();
      expect(true).toEqual(false);
    } catch (err) {
      expect(err.message).toEqual('Fields need a fieldId to work.');
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
    const validateFunc = () => console.log('Vaid');
    const initialValue = 'Rik';
    const fieldStore = new FieldStore('testField', {
      validate: validateFunc,
      initialValue,
    });
    expect(fieldStore.value).toEqual('Rik');
    fieldStore.onChange('Rik');
    expect(fieldStore.value).toEqual('Rik');
    fieldStore.onChange('Rikii')
    expect(fieldStore.value).toEqual('Rikii');
  });

  it('Validate should work', () => {
    const error = 'Length'
    const validateFunc = (value) => { if (value.length <= 3) { return error } };
    const initialValue = 'Rik';
    const fieldStore = new FieldStore('testField', {
      validate: validateFunc,
      initialValue,
    });

    expect(fieldStore.error).toEqual(undefined);
    fieldStore.validateField();
    expect(fieldStore.error).toEqual(error);
    fieldStore.onChange('Rikii');
    fieldStore.validateField();
    expect(fieldStore.error).toEqual(null);
  });
})
