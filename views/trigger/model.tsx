
import React from 'react';
import { Select } from '@dashup/ui';

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
    return Array.from(props.dashup.get('pages').values()).filter((p) => p.get('type') === 'model').map((page) => {
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
      <div className="mb-3">
        <label className="form-label">
          Model
        </label>
        <Select options={ getModel() } defaultValue={ getModel().filter((f) => f.selected) } onChange={ (val) => props.setTrigger('model', val?.value) } />
      </div>
      <div className="mb-3">
        <label className="form-label">
          Event(s)
        </label>
        <Select options={ getEvent() } defaultValue={ getEvent().filter((f) => f.selected) } onChange={ (val) => props.setTrigger('event', val.map((v) => v?.value)) } isMulti />
      </div>
    </>
  );
};

// export default
export default TriggerModel;