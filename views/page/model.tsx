
import React from 'react';
import { View } from '@dashup/ui';

// application page
const PageModel = (props = {}) => {

  // get props
  const getProps = () => {
    // clone
    const newProps = { ...(props) };

    // delete
    delete newProps.type;
    delete newProps.view;
    delete newProps.struct;

    // return
    return newProps;
  };

  // return jsx
  return (
    <View { ...getProps() } required={ [] } type="page" view="view" struct="grid" />
  );
};

// export default
export default PageModel;