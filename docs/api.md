# Form

Form is a High-Order-Component used to wrap your form in.

So let's say you have a Component holding the form named `Login` then you could do

```javascript
import { Form } from 'mobx-form';

const Login = (props) => (
  <form>
    <input />
  </form>
)

export default Form(properties)(Login);
```

As you can see Form takes two arguments:

1. The Component that it's wrapping
2. The properties for the Form itself
  - handleSubmit: a required function that will trigger when submitting the form
  - initialValues: You can define initialValues like => { fieldId: value }
  - onSuccess: Will be triggered when handleSubmit is succesfull
  - onError: Will be triggered when handleSubmit errors
  - validators: You can define validation like => { fieldId: validationFunction }

## Component

When wrapping your component it will receive a few properties: `onSubmit`, `change`, `validate`, ...

- `error` the global error when submitting
- `isValid` the boolean that is true when all validators evaluate correct
- `onSubmit` is used for the onSubmit property on your <form>.
- `change` is used when you want control over your `Field` value changes.
- `patchValues` is used to patch your fields in the lifecycle of your form, this takes an object with key (field) and value (newValue)
- `validateForm` forces a validate on the form
- `validateField` will when passing a valid fieldId validate that field
- `resetFields`: Will reset all fields to their initialValue/Empty



# Field

To a Field you pass a

- Component (needed): rendered for current Field
- fieldId (needed): this will be the name where the value for this field will be stored.
- showError (optional): this will tell the field you don't want to validate/showErrors
- All other props you need to have in your `Component`.

## Under the hood

First and foremost the value will be handled by the `Field` and be passed to your fieldComponent.

When passing a custom `onChange` function to a `Field` it will pass that one to your Component but then you are responsible for handling the onChange off our `Field`.

Upon validation error the `Field` will ship the error to your component so it will be received in the props.

a custom `onBlur` function triggering the validate will also be passed.

The `consumer` is responsible for making sure the wanted properties are implemented in the end-component.
