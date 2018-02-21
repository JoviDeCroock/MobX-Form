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

export default Form(LoginContainer, properties);
```

As you can see Form takes two arguments:

1. The Component that it's wrapping
2. The properties for the Form itself
  - handleSubmit: a required function that will trigger when submitting the form
  - initialValues: You can define initialValues like => { fieldId: value }
  - onSuccess: Will be triggered when handleSubmit is succesfull
  - onError: Will be triggered when handleSubmit errors
  - validators: You can define validation like => { fieldId: validationFunction }

## submitting

When wrapping your component it will receive a few properties: `onSubmit`, `change` and `validate`.

`onSubmit` is used for the onSubmit property on your <form>.

`change` is used when you want control over your `Field` value changes.

`validate` forces a validate on the form

``

# Field

To a Field you pass a

- Component (needed): rendered for current Field
- fieldId (needed): this will be the name where the value for this field will be stored.
- All other props you need to have in your `Component`.

## Under the hood

# Props form receives
