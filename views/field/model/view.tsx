
// import dependencies
import React from 'react';
import { Chip, Stack, Avatar } from '@dashup/ui';

// model field
const ModelFieldView = (props = {}) => {

  // get value
  const getValue = () => {
    // check value
    const value = Array.isArray(props.value) ? props.value : (props.value ? [props.value] : []);
    const model = props.field.model?.id || props.field.model;

    // get form
    const forms = Array.from(props.dashup.get('pages').values()).filter((p) => {
      // return model check
      return p.get('type') === 'form' && p.get('data.model') === model && !p.get('archived');
    });

    // check form
    if (!forms || !forms.length) return [];

    // get field
    const fields = forms.reduce((accum, form) => {
      // amend
      accum.push(...(form.get('data.fields') || []));

      // accumulator
      return accum;
    }, []);

    // get field
    const field = fields.find(f => f.uuid === props.field.by);

    // check form
    if (!field) return [];

    // return joined
    return value.map((item) => {
      // check item
      if (item && item.get) return {
        id   : item.get('_id'),
        form : item.get('_meta.form'),
        name : item.get(field.name || field.uuid || 'null') || 'N/A',
      };

      // return nothing
      return null;
    }).filter((v) => v);
  };

  // return text field
  return (
    <Stack spacing={ 1 } flexWrap="wrap">
      { getValue().map((model, i) => {
        // return jsx
        return (
          <Chip
            key={ `${props.id}-model-${model.id}` }
            href={ `/app/${model.form}/${model.id}` }
            label={ model.name }
            avatar={ <Avatar name={ model.name } src={ model.image } /> }
          />
        );
      }) }
    </Stack>
  );
};

// export default
export default ModelFieldView;