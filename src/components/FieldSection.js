import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import { Consumer } from './createContext';
import FieldSectionStore from '../stores/FieldSectionStore';

@observer
class FieldSection extends React.Component {
  static propTypes = {
    destroyOnUnmount: PropTypes.bool,
    extraProps: PropTypes.object,
    fieldId: PropTypes.string.isRequired,
    formStore: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired,
  }

  static defaultProps = { destroyOnUnmount: false }

  constructor(props) {
    super(props);
    const { formStore, fieldId } = props;
    if (!formStore) {
      throw new Error('The "FieldSection" Component must be inside a "Form" Component.');
    }
    this.store = formStore;

    const fieldSection = new FieldSectionStore(fieldId);
    // Bind it to this since we'll have to use it more than once
    this.fieldSection = fieldSection;
    // Add created field to our formStore
    formStore.addFieldSection(fieldSection);
  }

  componentWillUnmount() {
    // No residual values! Clean up your doodoo's
    const { destroyOnUnmount } = this.props;
    if (destroyOnUnmount) {
      this.store.reset();
    }
  }

  render() {
    const { render, fieldId, extraProps } = this.props;
    return render(fieldId, extraProps);
  }
}

export default props => (
  <Consumer>
    {formStore => <FieldSection formStore={formStore} {...props} />}
  </Consumer>
);
