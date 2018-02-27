function reset(value) {
  switch (typeof value) {
    case 'string': {
      return '';
    }
    case 'number': {
      return 0;
    }
    case 'boolean': {
      return false;
    }
    case 'date': {
      return new Date();
    }
    case 'array': {
      return [];
    }
    case 'object': {
      return {};
    }
    case 'symbol': {
      return '';
    }
    default: {
      return '';
    }
  }
}

export default reset;
