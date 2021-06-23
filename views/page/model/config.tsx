
// import react
import React from 'react';
import { Query, Select } from '@dashup/ui';

// create page model config
const PageModelConfig = (props = {}) => {

  // get forms
  const getForms = () => {
    // get forms
    const forms = Array.from(props.dashup.get('pages').values()).filter((page) => {
      // return model pages
      return page.get('type') === 'form' && page.get('data.model') === props.page.get('_id');
    });

    // return mapped
    return forms.map((form) => {
      // return values
      return {
        value : form.get('_id'),
        label : form.get('name'),

        selected : (props.page.get('data.forms') || []).includes(form.get('_id')),
      };
    });
  };

  // get dashboards
  const getDashboards = () => {
    // get forms
    const dashboards = Array.from(props.dashup.get('pages').values()).filter((page) => {
      // return model pages
      return page.get('type') === 'dashboard' && page.get('data.model') === props.page.get('_id');
    });

    // return mapped
    return dashboards.map((form) => {
      // return values
      return {
        value : form.get('_id'),
        label : form.get('name'),

        selected : (props.page.get('data.dashboards') || []).includes(form.get('_id')),
      };
    });
  };
  
  // get field
  const getField = (tld, types = []) => {
    // return value
    return props.getFields().map((field) => {
      // check type
      if (types.length && !types.includes(field.type)) return;

      // return fields
      return {
        label : field.label || field.name,
        value : field.uuid,

        selected : (props.page.get(`data.${tld}`) || []).includes(field.uuid),
      };
    }).filter((f) => f);
  };

  // on forms
  const onField = (tld, value) => {
    // set data
    props.setData(tld, value || null);
  };

  // on forms
  const onForms = (value) => {
    // set data
    props.setData('forms', value.map((v) => v.value));
  };

  // on forms
  const onDashboards = (value) => {
    // set data
    props.setData('dashboards', value.map((v) => v.value));
  };

  // return jsx
  return (
    <>
      <div className="mb-3">
        <label className="form-label">
          Grid Form(s)
        </label>
        <Select options={ getForms() } defaultValue={ getForms().filter((f) => f.selected) } onChange={ onForms } isMulti />
        <small>
          The forms that this grid will filter by.
        </small>
      </div>

      <div className="mb-3">
        <label className="form-label">
          Choose Dashboard(s)
        </label>
        <Select options={ getDashboards() } defaultValue={ getDashboards().filter((f) => f.selected) } onChange={ onDashboards } isMulti />
        <small>
          View Dashboards with this grids items.
        </small>
      </div>

      { props.getFields && !!props.getFields().length && (
        <>
          <hr />
            
          <div className="mb-3">
            <label className="form-label">
              Group Field
            </label>
            <Select options={ getField('group') } defaultValue={ getField('group').filter((f) => f.selected) } onChange={ (value) => onField('group', value?.value) } isClearable />
            <small>
              Selecting a tag field will group the grid by this field.
            </small>
          </div>
            
          <div className="mb-3">
            <label className="form-label">
              Tag Field(s)
            </label>
            <Select options={ getField('tag', ['select', 'checkbox']) } defaultValue={ getField('tag', ['select', 'checkbox']).filter((f) => f.selected) } onChange={ (value) => onField('tag', value.map((v) => v.value)) } isMulti />
            <small>
              Selecting a tag field will allow you to tag tasks.
            </small>
          </div>
            
          <div className="mb-3">
            <label className="form-label">
              User Field(s)
            </label>
            <Select options={ getField('user', ['user']) } defaultValue={ getField('user', ['user']).filter((f) => f.selected) } onChange={ (value) => onField('user', value.map((v) => v.value)) } isMulti />
            <small>
              Selecting a user field will allow you to assign tasks to that user.
            </small>
          </div>
            
          <div className="mb-3">
            <label className="form-label">
              Filter By
            </label>
            <Query
              isString

              page={ props.page }
              query={ props.page.get('data.filter') }
              dashup={ props.dashup }
              fields={ props.getFields() }
              onChange={ (val) => props.setData('filter', val) }
              getFieldStruct={ props.getFieldStruct }
              />
          </div>
        </>
      ) }
    </>
  )
};

// export default
export default PageModelConfig;