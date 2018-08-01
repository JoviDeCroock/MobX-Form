// Component for our FieldArrays, let's build this starting from reasoning and tests
import React from 'react';

import { Consumer } from './createContext';

class FieldArray extends React.Component {
  state = {};

  render() {
    return <div>!Work In Progress!</div>;
  }
}

export default props => (
  <Consumer>
    {formStore => <FieldArray formStore={formStore} {...props} />}
  </Consumer>
);
