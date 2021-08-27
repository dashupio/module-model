
// import react
import React from 'react';
import shortid from 'shortid';
import { Query, Select } from '@dashup/ui';

// create action model
const ActionModel = (props = {}) => {
  // set values
  const modelTypes = ['create', 'update', 'updateOne', 'findOrCreate'];
  const queryTypes = ['update', 'updateOne', 'findOrCreate'];

  // get types
  const getTypes = () => {
    // return when
    return [['This Model', 'this'], ['Create Model', 'create'], ['Update Model', 'updateOne'], ['Update All Models', 'update'], ['Update or Create Model', 'findOrCreate']].map(([label, value]) => {
      // return type
      return {
        label,
        value,
        selected : (props.action.update || 'this') === value,
      };
    });
  };

  /// get model
  const getModel = () => {
    // return value
    return Array.from(props.dashup.get('pages').values()).filter((page) => {
      // return model pages
      return page.get('type') === 'model' && !page.get('archived');
    }).map((page) => {
      // return type
      return {
        label    : page.get('name'),
        value    : page.get('_id'),
        selected : props.action.model === page.get('_id'),
      };
    });
  };

  // get fields
  const getFields = (field = {}) => {
    // get model
    const model = (props.action.update || 'this') === 'this' ? props.page.get('data.trigger.model') : props.action.model;

    // check model
    if (!model) return [];

    // get forms
    const forms = props.getForms([model]);
    const fields = props.getFields(forms);

    // check fields
    if (field === true) return fields;

    // return fields
    return fields.map((f) => {
      // return object
      return {
        value    : f.uuid,
        label    : f.label,
        selected : f.uuid === (field.field || field.name),
      };
    });
  };

  // on field
  const onField = (field, key, value) => {
    // set key
    field[key] = value;
    
    // set model
    props.setAction(props.action, 'fields', [...props.action.fields]);
  };

  // on create
  const onCreate = (e) => {
    // prevent
    e.preventDefault();
    e.stopPropagation();

    // create fields
    if (!props.action.fields) props.action.fields = [];

    // push
    props.action.fields.push({
      uuid : shortid(),
    });
    
    // set model
    props.setAction(props.action, 'fields', [...props.action.fields]);
  };

  // on create
  const onRemove = (e, i) => {
    // prevent
    e.preventDefault();
    e.stopPropagation();

    // push
    props.action.fields.splice(i, 1);
    
    // set model
    props.setAction(props.action, 'fields', [...props.action.fields]);
  };

  // return jsx
  return (
    <>
      <div className="mb-3">
        <label className="form-label">
          Update
        </label>
        <Select options={ getTypes() } defaultValue={ getTypes().filter((f) => f.selected) } onChange={ (val) => props.setAction(props.action, 'update', val?.value) } />
      </div>

      { !!modelTypes.includes(props.action.update || 'this') && (
        <div className="mb-3">
          <label className="form-label">
            Model
          </label>
          <Select options={ getModel() } defaultValue={ getModel().filter((f) => f.selected) } onChange={ (val) => props.setAction(props.action, 'model', val?.value) } />
        </div>
      ) }
      { !!queryTypes.includes(props.action.update || 'this') && (
        <div className="mb-3">
          <label className="form-label">
            Where
          </label>
          <Query
            isString

            page={ props.page }
            query={ props.action.filter }
            dashup={ props.dashup }
            fields={ getFields(true) }
            onChange={ (val) => props.setAction(props.action, 'filter', val) }
            getFieldStruct={ props.getFieldStruct }
            />
        </div>
      ) }

      <hr />

      { !!(props.action.model || props.action.update === 'this' || !props.action.update) && (
        <>
          <div className="card mb-3">
            <div className="card-body pb-2">
              { (props.action.fields || []).map((field, i) => {
                // return jsx
                return (
                  <div key={ `field-${props.action.uuid}-${i}` } className="d-flex align-items-center mb-2">
                    <Select options={ getFields() } className="w-25 me-2" defaultValue={ getFields(field).filter((f) => f.selected) } onChange={ (val) => onField(field, 'field', val?.value) } />
                    <input className="form-control flex-1" value={ field.value || '' } onChange={ (e) => onField(field, 'value', e.target.value) } />
                    <button className="btn btn-danger ms-2" onClick={ (e) => onRemove(e, i) }>
                      <i className="fa fa-times" />
                    </button>
                  </div>
                );
              }) }
            </div>
          </div>

          <button className="btn btn-success" onClick={ (e) => onCreate(e) }>
            Add Field
          </button>
        </>
      ) }
    </>
  );
};

// export default
export default ActionModel;