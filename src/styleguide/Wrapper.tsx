import React from 'react';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: Function;
  }
}

export default class Wrapper extends React.Component<{}, {}> {
  render() {
    return <>this.props.children</>;
  }
}
