reduxForm({
  form: 'createSegment',
  validate: (values) => {
    const schema = Joi.object().keys({
      criterionId: Joi.string(),
      innoBoardId: Joi.string(),
      title: Joi.string().max(255).required(),
      description: Joi.string().optional(),
    });
    const { error } = Joi.validate(values, schema, { allowUnknown: true });
    const versionErrors = translateJoiError(error);
    const groupErrors = validateGroupFields(values);
    const errors = { ...versionErrors, ...groupErrors };
    return errors;
  },
});

import { observable, action, computed } from 'mobx';

export default class Form {
  name;
  // Function to validate from
  validate;
}
