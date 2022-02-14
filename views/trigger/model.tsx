
import React from 'react';
import { TextField, MenuItem } from '@dashup/ui';

// create model trigger
const TriggerModel = (props = {}) => {

  // get event
  const getEvent = () => {
    // return when
    return ['Created', 'Updated', 'Removed'].map((type) => {
      // return type
      return {
        label    : type,
        value    : type.toLowerCase(),
        selected : (props.page.get('data.trigger.event') || []).includes(type.toLowerCase()),
      };
    });
  };

  // get model
  const getModel = () => {
    // push
    return Array.from(props.dashup.get('pages').values()).filter((p) => p.get('type') === 'model' && !p.get('archived')).map((page) => {
      // return object
      return {
        label    : page.get('name'),
        value    : page.get('_id'),
        selected : page.get('_id') === props.page.get('data.trigger.model'),
      }
    });
  };

  // return jsx
  return (
    <>
      <TextField
        label="Model"
        value={ props.page.get('data.trigger.model') || '' }
        select
        onChange={ (e) => props.setTrigger('model', e.target.value) }
        fullWidth
      >
        { getModel().map((model) => {
          // return jsx
          return (
            <MenuItem key={ model.value } value={ model.value }>
              { model.label }
            </MenuItem>
          );
        }) }
      </TextField>
      <TextField
        label="Event(s)"
        value={ Array.isArray(props.page.get('data.trigger.event')) ? props.page.get('data.trigger.event') : [props.page.get('data.trigger.event')].filter((e) => e) }
        select
        onChange={ (e) => props.setTrigger('event', e.target.value) }
        fullWidth

        SelectProps={ {
          multiple : true,
        } }
      >
        { getEvent().map((model) => {
          // return jsx
          return (
            <MenuItem key={ model.value } value={ model.value }>
              { model.label }
            </MenuItem>
          );
        }) }
      </TextField>
    </>
  );
};

// export default
export default TriggerModel;