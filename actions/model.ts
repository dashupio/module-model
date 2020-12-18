// import action
import handlebars from 'handlebars';
import { Struct, Model, Query } from '@dashup/module';

/**
 * create dashup action
 */
export default class ModelAction extends Struct {

  /**
   * construct
   */
  constructor(...args) {
    // return
    super(...args);

    // run listen
    this.runAction = this.runAction.bind(this);
  }

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
   * returns object of views
   */
  get actions() {
    // return object of views
    return {
      run : this.runAction,
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
   * action method
   *
   * @param param0 
   * @param action 
   * @param data 
   */
  async runAction(opts, action, data) {
    // check values
    if (!(action.fields || []).length) return true;

    // check update
    if (!action.update) action.update = 'this';

    // let models
    let models = [];

    // check model
    if (action.update === 'this') {
      // model
      models = [new Model(data.model)];
    } else if (['update', 'updateOne', 'findOrCreate'].includes(action.update)) {
      // query model
      let query = new Query({
        ...opts,

        page  : action.model,
        nonce : opts.nonce,
      }, 'model');

      // check filter
      if (action.filter) {
        // filters
        const filters = JSON.parse(action.filter);

        // loop
        filters.forEach((filter) => {
          // where
          query = query.where(filter);
        });
      }

      // find
      if (action.update === 'update') {
        // find
        models = await query.find();
      } else {
        // models
        const found = await query.findOne();

        // found
        models = found ? [found] : [];
      }

      // or create
      if (action.update === 'findOrCreate' && !models.length) {
        // create model
        models = [new Model({})];
      }
    } else if (['create'].includes(action.update)) {
      // new model
      models = [new Model({})];
    }

    // log models
    models.forEach((model) => {
      // loop fields
      action.fields.forEach((field) => {
        // template
        const valueTemplate = handlebars.compile(field.value);

        // set field uuid
        const actualValue = valueTemplate({
          ...data,

          current : model.sanitise(),
        });

        // set value
        model.set(field.name, actualValue);
      });

      // save model
      model.save({
        ...opts,

        page  : model.get('_meta.page'),
        model : action.model || model.get('_meta.model'),
      })
    });
  }
}