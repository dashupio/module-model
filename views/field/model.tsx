// import dependencies
import React, { useState, useEffect, useCallback } from 'react';
import { Chip, Avatar, TextField, Autocomplete, CircularProgress } from '@dashup/ui';

// text field
const FieldModel = (props = {}) => {
  // aValue
  const aValue = props.value;

  // search
  const [value, setValue] = useState(((Array.isArray(aValue) ? aValue : aValue && [aValue]) || []).map((val) => {
    // check value
    if (typeof val === 'object' && !(val instanceof props.dashup.Model)) {
      return new props.dashup.Model(val);
    }

    // return val
    return val;
  }));
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

  // get value
  const getValue = useCallback(() => {
    // by
    const by = props.field.by?.id || props.field.by;

    // check by/model
    if (!by) return props.field.multiple ? [] : null;

    // get fields
    const fields = getFields();

    // by field
    const byField  = fields.find((f) => f.uuid === by);
    const byParent = byField?.parent && fields.find((f) => f.uuid === byField.parent);

    // check by field
    if (!byField) return props.field.multiple ? [] : null;

    // get array of values
    const values = value.map((item) => {
      // check string
      if (typeof item === 'string') return;

      // get label
      const label = byParent ? (
        item.get(`${byParent.name || byParent.uuid}.0.${byField.name || byField.uuid}`) ||
        item.get(`${byParent.name || byParent.uuid}.${byField.name || byField.uuid}`)
      ) : item.get(byField.name || byField.uuid);

      // return value
      return {
        label,
        data  : item,
        value : item.get('_id'),
      };
    });

    // return single
    if (!props.field.multiple) return values[0];
    
    // return all
    return values;
  }, [props.field.by, props.field.multiple, props.field.value, value]);

  // get fields
  const getFields = useCallback(() => {
    // by
    let model = props.field.model?.id || props.field.model;

    // get forms
    const forms = Array.from(props.dashup.get('pages').values()).filter((p) => p.get('type') === 'form' && p.get('data.model') === model && !p.get('archived'));

    // return fields
    return [].concat(...(forms.map((f) => (f.get('data.fields') || []))));
  }, [props.field.model]);

  // load value
  const loadValue = async () => {
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

    // find by ids
    const loadedValue = await Promise.all(value.map((val) => {
      // check string
      if (typeof val === 'string') val = modelPage.findById(val);

      // return val
      return val;
    }));

    // return loaded
    return loadedValue.filter((v) => v);
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

    // get fields
    const fields = getFields();

    // by field
    const byField  = fields.find((f) => f.uuid === by);
    const byParent = byField?.parent && fields.find((f) => f.uuid === byField.parent);

    // check by field
    if (!byField) return [];

    // loading false
    setLoading(true);

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
      data = data.search(inputValue);
    }

    // add limit
    const result = await data.limit(25).find();

    // loading false
    setLoading(false);

    // return map
    return result.map((item) => {
      // get label
      const label = byParent ? (
        item.get(`${byParent.name || byParent.uuid}.0.${byField.name || byField.uuid}`) ||
        item.get(`${byParent.name || byParent.uuid}.${byField.name || byField.uuid}`)
      ) : item.get(byField.name || byField.uuid);

      // return value
      return {
        label,
        data  : item,
        value : item.get('_id'),
      };
    });
  };

  // on change
  const onChange = (val) => {
    // set value
    const actualValue = (Array.isArray(val) ? val : [val].filter((v) => v)).map((v) => v?.data).filter((v) => v);

    // set value
    setValue(actualValue); 
    props.onChange(props.field, actualValue);
  };

  // use effect
  useEffect(() => {
    // load options
    loadValue().then(setValue);
    loadOptions(search).then(setOptions);
  }, [props.field.uuid, props.field.model, props.field.form, props.field.by]);

  // return text field
  return (
    <Autocomplete
      value={ getValue() }
      multiple={ props.field.multiple }
      options={ options }
      readOnly={ props.readOnly }
      fullWidth
      onChange={ (e, v) => onChange(v) }
      getOptionLabel={ (option) => option.label || option }
      isOptionEqualToValue={ (a, b) => a?.value === b?.value }
      
      renderTags={ (value: Array<object>, getTagProps) => {
        // render chips
        return value.map((option: object, index: number) => {
          // return jsx
          return (
            <Chip
              label={ option.label }
              avatar={ <Avatar name={ option.label } src={ option.image } /> }
              { ...getTagProps({ index }) }
            />
          );
        });
      } }

      renderInput={ (params) => (
        <TextField
          { ...params }
          sx={ {
            '& label': {
              color : props.field.color?.hex,
            },
            '& fieldset': {
              borderColor : props.field.color?.hex,
            },
          } }
          fullWidth
          value={ search }
          label={ props.field.label }
          onChange={ (e) => onChange(e.target.value) }
          placeholder={ props.field.placeholder || `Enter ${props.field.label}` }

          InputProps={ {
            ...params.InputProps,
            readOnly     : !!props.readOnly,
            endAdornment : (
              <>
                { loading ? <CircularProgress color="inherit" size={ 20 } /> : null }
                { params.InputProps.endAdornment }
              </>
            ),
          } }
        />
      ) }
    />
  );
};

// export default
export default FieldModel;