import FormStore from '../../src/FormStore';

describe('FormStore', () => {
  it('All types should be right', () => {
    const formStore = new FormStore((values) => console.log(values));
    expect(typeof formStore.fields).toEqual('object');
    expect(typeof formStore.validators).toEqual('object');
  });

  it('Should error when not passing a handleSubmit.', () => {
    try {
      const formStore = new FormStore();
      // We should never reach this.
      expect(false).toEqual(true);
    } catch (e) {
      expect(e.message).toEqual('Please pass a handleSubmit function.');
    }
  });

  it('Should error when passing a string as handleSubmit.', () => {
    try {
      const formStore = new FormStore('notAFunction');
      // We should never reach this.
      expect(false).toEqual(true);
    } catch (e) {
      expect(e.message).toEqual('Please pass a handleSubmit function.');
    }
  });

  it('Should succesfully construct with a handleSubmit function.', () => {
    const formStore = new FormStore((values) => console.log(values));
    expect(typeof formStore.handleSubmit).toEqual('function');
  });

  it('Should succesfully add validators.', () => {
    const handleSubmit = () => console.log('hello');
    const validators = {
      func: () => console.log('Validating text'),
    };

    const formStore = new FormStore(handleSubmit, validators);
    expect(typeof formStore.validators.func).toEqual('function');
  });

  it('Should succesfully add validator functions and ignore non functions.', () => {
    const handleSubmit = () => console.log('hello');
    const validators = {
      func: () => console.log('Validating text'),
      nonFunc: 'herrow',
    };

    const formStore = new FormStore(handleSubmit, validators);
    expect(typeof formStore.validators.func).toEqual('function');
    expect(formStore.validators.nonFunc).toEqual(undefined);
  });
})
