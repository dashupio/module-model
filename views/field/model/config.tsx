
// import react
import { Box, Divider, Query, Autocomplete, TextField } from '@dashup/ui';
import React, { useCallback } from 'react';

// block list
const FieldModelConfig = (props = {}) => {

  // get forms
  const getModels = useCallback(() => {
    // get forms
    const forms = Array.from(props.dashup.get('pages').values()).filter((page) => {
      // return model pages
      return page.get('type') === 'model' && !page.get('archived');
    });

    // return mapped
    return forms.map((form) => {
      // return values
      return {
        value : form.get('_id'),
        label : form.get('name'),

        selected : (props.field.model || [])?.includes(form.get('_id')),
      };
    });
  }, [props.field.model]);

  // get forms
  const getForms = useCallback(() => {
    // get forms
    const forms = Array.from(props.dashup.get('pages').values()).filter((page) => {
      // return model pages
      return page.get('type') === 'form' && page.get('data.model') === props.field.model && !page.get('archived');
    });

    // return mapped
    return forms.map((form) => {
      // return values
      return {
        value : form.get('_id'),
        label : form.get('name'),

        selected : (props.field.form || [])?.includes(form.get('_id')),
      };
    });
  }, [props.field.form]);

  // get forms
  const getField = useCallback(() => {
    // get forms
    const forms = Array.from(props.dashup.get('pages').values()).filter((page) => {
      // return model pages
      return page.get('type') === 'form' && page.get('data.model') === props.field.model && !page.get('archived');
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
  }, [props.field.by]);

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
      <Autocomplete
        fullWidth
        options={ getModels() }
        onChange={ (e, v) => onModel(v) }
        defaultValue={ (getModels().filter((m) => m.selected) || [])[0] }
        getOptionLabel={ (option) => option.label }

        renderInput={ (params) => (
          <TextField
            { ...params }
            fullWidth
            label="Choose Model"
            placeholder="Choose Model"
          />
        ) }
      />

      { !!props.field.model && (
        <Autocomplete
          fullWidth
          options={ getForms() }
          onChange={ (e, v) => onForm(v) }
          defaultValue={ (getForms().filter((m) => m.selected) || [])[0] }
          getOptionLabel={ (option) => option.label }

          renderInput={ (params) => (
            <TextField
              { ...params }
              fullWidth
              label="Choose Form"
              placeholder="Choose Form"
            />
          ) }
        />
      ) }

      { !!props.field.form && (
        <Autocomplete
          fullWidth
          options={ getField() }
          onChange={ (e, v) => onField(v) }
          defaultValue={ (getField().filter((m) => m.selected) || [])[0] }
          getOptionLabel={ (option) => option.label }

          renderInput={ (params) => (
            <TextField
              { ...params }
              fullWidth
              label="Choose Identifier"
              placeholder="Choose Identifier"
            />
          ) }
        />
      ) }

      { !!getModels().filter((f) => f.selected).length && (
        <>
          <Box my={ 2 }>
            <Divider />
          </Box>

          <Query
            isString

            page={ props.page }
            label="Filter By"
            query={ props.field.filter }
            dashup={ props.dashup }
            fields={ props.getFields([props.field.form]) }
            onChange={ (val) => props.setField(props.field, 'filter', val) }
            getFieldStruct={ props.getFieldStruct }
          />
        </>
      ) }
    </>
  );
}

// export default
export default FieldModelConfig;