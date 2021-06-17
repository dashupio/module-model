// import action
import pretty from 'pretty-ms';
import moment from 'moment-timezone';
import helpers from 'handlebars-helpers';
import handlebars from 'handlebars';
import { Struct, Model, Query } from '@dashup/module';

// register helper
handlebars.registerHelper(helpers());
handlebars.registerHelper('ms', (amount, extra, options) => {
  // check now
  amount = parseInt(amount);

  // return formatted
  return pretty(amount);
});
handlebars.registerHelper('date', (date, fmt, options) => {
  // check now
  if (date === 'now') date = new Date();

  // check options
  if (typeof fmt !== 'string') {
    fmt = 'MMMM DD YYYY, LT';
    options = fmt;
  }

  // return formatted
  return moment(date).format(fmt);
});
handlebars.registerHelper('timezone', (tz, options) => {
  // check now
  let date = new Date();

  // return formatted
  return moment(date).tz(tz).format('ha z');
});
handlebars.registerHelper('since', (date, extra, options) => {
  // check now
  if (date === 'now') date = new Date();

  // check options
  if (typeof extra !== 'boolean') {
    extra = true;
    options = extra;
  }

  // return formatted
  return moment(date).fromNow(extra);
});
handlebars.registerHelper('var', (varName, varValue, options) => {
  // set var
  options.data.root[varName] = varValue;
});

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
      config : 'action/model',
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
      models = [new Model(data.model, 'model')];
    } else if (['update', 'updateOne', 'findOrCreate'].includes(action.update)) {
      // query model
      let query = new Query({
        ...opts,

        page  : action.model,
        nonce : opts.nonce,
      }, 'model');

      //f ound
      let queried = false;

      // check filter
      if (action.query) {
        // filters
        const filters = JSON.parse(action.query);

        // loop
        filters.forEach((filter) => {
          // set type
          const type = Object.keys(filter)[0];

          // set type
          filter[type] = filter[type].map((item) => {
            // get keys
            const name = Object.keys(item)[0];
            const fn = Object.keys(item[name])[0];

            // create thing
            const template = handlebars.compile(item[name][fn]);

            // check name
            if (name === '_id') {
              // by id
              query = query.findById(template({
                ...data,
              }));

              // found
              queried = true;
              
              // return
              return;
            }

            // return filtered
            return {
              [name] : {
                [fn] : template({
                  ...data,
                }),
              },
            };
          }).filter((t) => t);

          // check length
          if (!filter[type].length) return;

          // where
          if (query instanceof Promise) return;

          // add query
          query = query.where(filter);
        });
      }

      // find
      if (action.update === 'update') {
        // find
        models = queried ? [await query] : query.find();
      } else {
        // models
        const found = queried ? await query : query.findOne();

        // found
        models = found ? [found] : [];
      }

      // or create
      if (action.update === 'findOrCreate' && !models.length) {
        // create model
        models = [new Model({}, 'model')];
      }
    } else if (['create'].includes(action.update)) {
      // new model
      models = [new Model({}, 'model')];
    }

    // log models
    models.forEach((model) => {
      // loop fields
      action.fields.forEach((field) => {
        // check field
        if (!field.field && !field.name) return;

        // template
        const valueTemplate = handlebars.compile(field.value);

        // set field uuid
        const actualValue = valueTemplate({
          ...data,

          current : model.sanitise(),
        });

        // set value
        model.set(field.field || field.name, actualValue);
      });

      // save model
      model.save({
        ...opts,

        page  : model.get('_meta.page'),
        form  : model.get('_meta.form'),
        model : action.model || model.get('_meta.model'),
      })
    });
  }
}