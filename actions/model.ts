// import action
import { Struct } from '@dashup/module';

/**
 * create dashup action
 */
export default class ModelAction extends Struct {

  /**
   * returns action type
   */
  get type() {
    // return action type label
    return 'model';
  }

  /**
   * returns trigger type
   */
  get icon() {
    // return trigger type label
    return 'fa fa-play';
  }

  /**
   * returns action type
   */
  get title() {
    // return action type label
    return 'Model';
  }

  /**
   * returns object of views
   */
  get views() {
    // return object of views
    return {
      config : 'action/model/config',
    };
  }

  /**
   * returns category list to show action in
   */
  get categories() {
    // return array of categories
    return [];
  }

  /**
   * returns category list to show action in
   */
  get description() {
    // return description string
    return 'Trigger Model';
  }

  /**
   * triggered
   *
   * @param opts 
   * @param element 
   * @param data 
   */
  async triggered(opts, element, data) {
    return;
    // get config
    const config = element.config || {};

    // get type
    const modelTypes = ['update', 'updateOne', 'findOrCreate'];

    // check values
    if (!config.type || !(config.fields || []).length) return true;

    // models
    let models = [data.model];

    // check if it's a new model
    if (modelTypes.includes(config.type || 'this')) {
      // query for new model
      let query = Model.where({
        '_meta.model' : config.model.id,
      });

      // get query
      const queries = config.query ? JSON.parse(config.query) : [];

      // loop for each
      queries.forEach((q) => query = query.where(q));

      // find
      models = await query.find();

      // if update one
      if (['updateOne', 'findOrCreate'].includes(config.type)) {
        // only first
        models = models[0] ? [models[0]] : [];
      }
    }

    // get forms
    const forms = await Page.where({
      type            : 'form',
      archived        : null,
      '_meta.dashup'  : flow.get('_meta.dashup'),
      'data.model.id' : (config.type || 'this') === 'this' ? data.model.get('_meta.model') : config.model.id,
    }).find();

    // actual forms
    const actualForms = await Promise.all(forms.map((form) => formHelper.load(form.get('_id'))));

    // if or create
    if (['create'].includes(config.type) || (['findOrCreate'].includes(config.type) && !models.length)) {
      // create new model
      models = [new Model({
        _meta : {
          page   : flow.get('_id'),
          form   : forms[0].get('_id'),
          model  : config.model.id,
          dashup : flow.get('_meta.dashup'),
        }
      })];
    }

    // create faux body
    const body = {};

    // loop fields
    (config.fields || []).forEach((field) => {
      // set to body
      body[field.name] = tmpl.tmpl(field.value || '', data.sanitised);
    });

    // submit all
    await Promise.all(models.map(async (item) => {
      // set flow
      item.set('_meta.flow', hash);

      // await
      await Promise.all(actualForms.map((form) => {
        // submit
        return formHelper.submit({
          req : {
            body,
          }
        }, form, item);
      }));

      // save item
      if ((config.type || 'this') !== 'this' || when !== 'before') await item.save();
    }));

    // return true
    return true;
  }
}