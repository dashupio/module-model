
// import react
import React from 'react';
import shortid from 'shortid';
import { Query, Stack, Card, CardContent, IconButton, Icon, TextField, MenuItem, Box, Button, Divider } from '@dashup/ui';

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
        value    : f.name || field.uuid,
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
      <TextField
        label="Update"
        value={ props.action.update || 'this' }
        select
        onChange={ (e) => props.setAction(props.action, 'update', e.target.value) }
        fullWidth
      >
        { getTypes().map((model) => {
          // return jsx
          return (
            <MenuItem key={ model.value } value={ model.value }>
              { model.label }
            </MenuItem>
          );
        }) }
      </TextField>

      { !!modelTypes.includes(props.action.update || 'this') && (
        <TextField
          label="Model"
          value={ props.action.model || '' }
          select
          onChange={ (e) => props.setAction(props.action, 'model', e.target.value) }
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
      ) }

      { !!queryTypes.includes(props.action.update || 'this') && (
        <Query
          isString

          page={ props.page }
          label="Where"
          query={ props.action.filter }
          dashup={ props.dashup }
          fields={ getFields(true) }
          onChange={ (val) => props.setAction(props.action, 'filter', val) }
          getFieldStruct={ props.getFieldStruct }
        />
      ) }

      <Box my={ 2 }>
        <Divider />
      </Box>

      { !!(props.action.model || props.action.update === 'this' || !props.action.update) && (
        <>
          <Stack spacing={ 1 }>
            { (props.action.fields || []).map((field, i) => {
              // return jsx
              return (
                <Card key={ `field-${props.action.uuid}-${i}` } variant="outlined" sx={ {
                  backgroundColor : 'rgba(0, 0, 0, 0)',
                } }>
                  <CardContent>
                    <Stack direction="row" spacing={ 1 } sx={ {
                      width      : '100%',
                      flexWrap   : 'wrap',
                      alignItems : 'center',
                    } }>
                      <TextField
                        sx={ { flex : 1 } }
                        label="Field"
                        value={ field.field || '' }
                        select
                        onChange={ (e) => onField(field, 'field', e.target.value) }
                      >
                        { getFields().map((field) => {
                          // return jsx
                          return (
                            <MenuItem key={ field.value } value={ field.value }>
                              { field.label }
                            </MenuItem>
                          );
                        }) }
                      </TextField>

                      <IconButton color="error" onClick={ (e) => onRemove(e, i) }>
                        <Icon type="fas" icon="trash" />
                      </IconButton>
                    </Stack>

                    <TextField
                      label="Value"
                      value={ field.value || '' }
                      onChange={ (e) => onField(field, 'value', e.target.value) }
                      fullWidth
                    />
                  </CardContent>
                </Card>
              );
            }) }
          </Stack>

          <Box textAlign="right">
            <Button color="success" variant="contained" onClick={ (e) => onCreate(e) }>
              Add Field
            </Button>
          </Box>
        </>
      ) }
    </>
  );
};

// export default
export default ActionModel;