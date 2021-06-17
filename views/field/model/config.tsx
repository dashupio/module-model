
// import react
import React from 'react';
import Select from 'react-select';
import { Query } from '@dashup/ui';

// block list
const FieldModelConfig = (props = {}) => {

  // get forms
  const getModels = () => {
    // get forms
    const forms = Array.from(props.dashup.get('pages').values()).filter((page) => {
      // return model pages
      return page.get('type') === 'model';
    });

    // return mapped
    return forms.map((form) => {
      // return values
      return {
        value : form.get('_id'),
        label : form.get('name'),

        selected : (props.field.model || []).includes(form.get('_id')),
      };
    });
  };

  // get forms
  const getForms = () => {
    // get forms
    const forms = Array.from(props.dashup.get('pages').values()).filter((page) => {
      // return model pages
      return page.get('type') === 'form' && page.get('data.model') === props.field.model;
    });

    // return mapped
    return forms.map((form) => {
      // return values
      return {
        value : form.get('_id'),
        label : form.get('name'),

        selected : (props.field.form || []).includes(form.get('_id')),
      };
    });
  };

  // get forms
  const getField = () => {
    // get forms
    const forms = Array.from(props.dashup.get('pages').values()).filter((page) => {
      // return model pages
      return page.get('type') === 'form' && page.get('data.model') === props.field.model;
    });

    // return mapped
    return props.getFields(forms).map((field) => {
      // return field
      return {
        value : field.uuid,
        label : field.label || field.name,

        selected : props.field.by === field.uuid,
      };
    });
  };

  // on forms
  const onModel = (value) => {
    // set data
    props.setField(props.field, 'model', value?.value);
  };

  // on forms
  const onForm = (value) => {
    // set data
    props.setField(props.field, 'form', value?.value);
  };

  // on forms
  const onField = (value) => {
    // set data
    props.setField(props.field, 'by', value?.value);
  };

  // return jsx
  return (
    <>
      <div className="mb-3">
        <label className="form-label">
          Choose Model
        </label>
        <Select options={ getModels() } defaultValue={ getModels().filter((f) => f.selected) } onChange={ onModel } />
        <small>
          The model this field should display.
        </small>
      </div>

      { !!props.field.model && (
        <div className="mb-3">
          <label className="form-label">
            Choose Form
          </label>
          <Select options={ getForms() } defaultValue={ getForms().filter((f) => f.selected) } onChange={ onForm } />
        </div>
      ) }

      { !!props.field.form && (
        <div className="mb-3">
          <label className="form-label">
            Choose Identifier
          </label>
          <Select options={ getField() } defaultValue={ getField().filter((f) => f.selected) } onChange={ onField } />
        </div>
      ) }

      { !!getModels().filter((f) => f.selected).length && (
        <>
          <hr />
            
          <div className="mb-3">
            <label className="form-label">
              Filter By
            </label>
            <Query dashup={ props.dashup } onChange={ console.log } />
          </div>
        </>
      ) }
    </>
  );
}

// export default
export default FieldModelConfig;