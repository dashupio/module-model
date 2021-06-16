
// import dependencies
import { Form } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import React, { useState, useEffect } from 'react';

// text field
const ModelField = (props = {}) => {
  // search
  const [search, setSearch] = useState('');
  const [options, setOptions] = useState(null);

  // get value
  const getValue = () => {
    // by
    const by = props.field.by?.id || props.field.by;

    // check by/model
    if (!by) return [];

    // by field
    const byField = getFields().find((f) => f.uuid === by);

    // check by field
    if (!byField) return;

    // get array of values
    const values = (Array.isArray(props.value) ? props.value : (props.value && [props.value]) || []).map((item) => {
      // return value
      return {
        data  : item,
        label : item.get(byField.name || byField.uuid),
        value : item.get('_id'),
      };
    });

    // return single
    if (!props.field.multiple) return values[0];
    
    // return all
    return values;
  };

  // get fields
  const getFields = () => {
    // by
    let model = props.field.model?.id || props.field.model;

    // get forms
    const forms = Array.from(props.dashup.get('pages').values()).filter((p) => p.get('type') === 'form' && p.get('data.model') === model);

    // return fields
    return [].concat(...(forms.map((f) => (f.get('data.fields') || []))));
  };

  // load options
  const loadOptions = async (inputValue) => {
    // by
    const by    = props.field.by?.id || props.field.by;
    const model = props.field.model?.id || props.field.model;

    // check by/model
    if (!by || !model) return [];

    // get model
    const modelPage = props.dashup.page(model);

    // check by model
    if (!modelPage) return [];

    // by field
    const byField = getFields().find((f) => f.uuid === by);

    // check by field
    if (!byField) return [];

    // check query
    const query = props.field.filter ? JSON.parse(props.field.filter) : [];

    // create where
    let data = modelPage;

    // loop query
    query.forEach((item) => {
      // add where
      data = data.where(item);
    });

    // inc
    if (inputValue && inputValue.length) {
      // inc
      data = data.inc(byField.name || byField.uuid, inputValue);
    }

    // add limit
    const result = await data.limit(25).find();

    // return map
    return result.map((item) => {
      // return value
      return {
        data  : item,
        label : item.get(byField.name || byField.uuid),
        value : item.get('_id'),
      };
    });
  };

  // use effect
  useEffect(() => {
    // load options
    loadOptions(search).then(setOptions);
  }, [props.field.uuid]);

  // custom option
  const Option = ({ data, isDisabled, isSelected, innerProps, innerRef }) => {
    // return jsx
    return !isDisabled ? (
      <div
        ref={ innerRef }
        className={ `dropdown-item d-flex align-items-center flex-row px-3 py-2${isSelected ? ' active' : ''}` }
        { ...innerProps }
      >
        { data.color && (
          <span className={ `badge bg-${data.color} me-2` }>
            &nbsp;
          </span>
        ) }
        <span className="text-overflow">
          { data.label }
        </span>
      </div>
    ) : null;
  };

  // return text field
  return (
    <Form.Group className={ props.noLabel ? '' : 'mb-3' } controlId={ props.field.uuid }>
      { !props.noLabel && (
        <Form.Label>
          { props.field.label || (
            <a href="#!" onClick={ (e) => !props.onConfig(props.field) && e.preventDefault() }>
              <i>Set Label</i>
            </a>
          ) }  
        </Form.Label>
      ) }
      <AsyncSelect
        isClearable
        cacheOptions

        isMulti={ props.field.multiple }
        onChange={ (e) => props.onChange(props.field, e && e.data) }
        components={ { Option } }
        placeholder={ props.field.placeholder || `Enter ${props.field.label}` }
        loadOptions={ loadOptions }
        defaultValue={ getValue() }
        onInputChange={ (v) => setSearch(v) }
        defaultOptions={ options }
        />
      { !!props.field.help && (
        <Form.Text className="form-help">
          { props.field.help }
        </Form.Text>
      ) }
    </Form.Group>
  );
};

// export default
export default ModelField;