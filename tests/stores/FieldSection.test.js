import FieldSectionStore from '../../src/stores/FieldSectionStore';
import FieldStore from '../../src/stores/FieldStore';

// eslint-disable-rule no-undef

describe('FieldSectionStore', () => {
  it('All types should be right', () => {
    const validateFunc = () => console.log('Vaid');
    const initialValue = 'Rik';
    const fieldSectionStore = new FieldSectionStore('address');
    const fieldStore = new FieldStore('address.street', {
      initialValue,
      validate: validateFunc,
    });
    fieldSectionStore.addField(fieldStore, 1);

    expect(typeof fieldSectionStore).toEqual('object');
    expect(typeof fieldSectionStore.fieldValues).toEqual('object');

    const { fieldId, fields, isFieldSection } = fieldSectionStore;
    expect(isFieldSection).toEqual(true);
    expect(typeof fields.street).toEqual('object');
    expect(fields.street.isField).toEqual(true);
    expect(fieldId).toEqual('address');
  });

  it('Should set errors correctly', () => {
    const fieldSectionStore = new FieldSectionStore('address');
    const fieldSectionStore2 = new FieldSectionStore('address.house');
    const fieldStore = new FieldStore('address.street');
    const fieldStore2 = new FieldStore('address.house.number');
    fieldStore.touched = true;
    fieldStore2.touched = true;
    fieldSectionStore.addField(fieldStore, 1);
    fieldSectionStore.addField(fieldSectionStore2, 1);
    fieldSectionStore.addField(fieldStore2, 1);
    fieldSectionStore.setErrors({
      house: {
        number: 'Bad',
      },
      nonExisting: 'bad',
      street: 'Bad',
    });
    expect(fieldSectionStore.fields.street.error).toEqual('Bad');
    expect(fieldSectionStore2.fields.number.error).toEqual('Bad');
    expect(fieldSectionStore2.fields.nonExisting).toEqual(undefined);
  });

  it('Should patch values correctly', () => {
    const fieldSectionStore = new FieldSectionStore('address');
    const fieldSectionStore2 = new FieldSectionStore('address.house');
    const fieldStore = new FieldStore('address.street');
    const fieldStore2 = new FieldStore('address.house.number');
    fieldStore.touched = true;
    fieldStore2.touched = true;
    fieldSectionStore.addField(fieldStore, 1);
    fieldSectionStore.addField(fieldSectionStore2, 1);
    fieldSectionStore.addField(fieldStore2, 1);
    fieldSectionStore.patchValue('street', 'Nederkouter');
    fieldSectionStore.patchValue('nonExisting', 'Nederkouter');
    fieldSectionStore.patchValue('house', { house: { number: 29 } });
    fieldSectionStore.patchValue('nonExisting', { nonExisting: { number: 29 } });
    expect(fieldSectionStore.fields.street.value).toEqual('Nederkouter');
    expect(fieldSectionStore2.fields.number.value).toEqual(29);
    expect(fieldSectionStore2.fields.nonExisting).toEqual(undefined);
  });

  it('Should reset values correctly', () => {
    const fieldSectionStore = new FieldSectionStore('address');
    const fieldSectionStore2 = new FieldSectionStore('address.house');
    const fieldStore = new FieldStore('address.street');
    const fieldStore2 = new FieldStore('address.house.number');
    fieldStore.touched = true;
    fieldStore2.touched = true;
    fieldSectionStore.addField(fieldStore, 1);
    fieldSectionStore.addField(fieldSectionStore2, 1);
    fieldSectionStore.addField(fieldStore2, 1);
    fieldSectionStore.patchValue('street', 'Nederkouter');
    fieldSectionStore.patchValue('nonExisting', 'Nederkouter');
    fieldSectionStore.patchValue('house', { house: { number: 29 } });
    expect(fieldSectionStore.fields.street.value).toEqual('Nederkouter');
    expect(fieldSectionStore2.fields.number.value).toEqual(29);
    fieldSectionStore.reset();
    expect(fieldSectionStore.fields.street.value).toEqual('');
    expect(fieldSectionStore2.fields.number.value).toEqual(0);
  });

  it('Should validate fields correctly', () => {
    const validate = jest.fn();
    const validate2 = jest.fn();
    const fieldSectionStore = new FieldSectionStore('address');
    const fieldSectionStore2 = new FieldSectionStore('address.house');
    const fieldStore = new FieldStore('address.street', {
      validate,
    });
    const fieldStore2 = new FieldStore('address.house.number', {
      validate: validate2,
    });
    fieldSectionStore.addField(fieldSectionStore2, 1);
    fieldSectionStore.addField(fieldStore2, 1);
    fieldStore.touched = true;
    fieldSectionStore.addField(fieldStore, 1);
    fieldSectionStore.validateFields();
    expect(validate).toBeCalled();
    expect(validate2).toBeCalled();
  });

  it('Should validate fields correctly', () => {
    const validate = jest.fn();
    const validate2 = jest.fn();
    const fieldSectionStore = new FieldSectionStore('address');
    const fieldSectionStore2 = new FieldSectionStore('address.house');
    // Test if this interferes with our result.
    fieldSectionStore.fields.x = { y: 'x' };
    const fieldStore = new FieldStore('address.street', {
      initialValue: 'Smwhre',
      validate,
    });
    const fieldStore2 = new FieldStore('address.house.number', {
      initialValue: 'Smth',
      validate: validate2,
    });
    fieldSectionStore.addField(fieldSectionStore2, 1);
    fieldSectionStore.addField(fieldStore2, 1);
    fieldStore.touched = true;
    fieldSectionStore.addField(fieldStore, 1);
    const values = fieldSectionStore.fieldValues;
    expect(Object.keys(values).length).toEqual(2);
    expect(values).toHaveProperty('house');
    expect(values).toHaveProperty('street');
    expect(values.house.number).toEqual('Smth');
    expect(values.street).toEqual('Smwhre');
  });
});
