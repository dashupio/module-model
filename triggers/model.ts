// import base
import { Struct } from '@dashup/module';

/**
 * create dashup action
 */
export default class ModelTrigger extends Struct {

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
      config : 'trigger/model/config',
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
   * run trigger
   */
  listen() {
    // execute function
    const execute = (model, a, b) => {
      // check model
      if (!(model instanceof Model)) return;

      // set vars
      let hook;
      let type;

      // chec vars
      if (!b) {
        hook = a.hook;
        type = a.type;
      } else {
        hook = b.hook;
        type = b.type;
      }

      // check
      if (!hook || !type) return;

      // get model type
      const modelName = hook.split('.')[0];
      let updateType = hook.split('.')[1];

      // removed
      if (updateType === 'update' && model.get('_meta.archived')) {
        // removed
        updateType = 'remove';
      }

      // tense
      const tense = {
        create : 'created',
        update : 'updated',
        remove : 'removed',
      };

      // sanitise
      model.sanitise({}).then((sanitised) => {
        // create trigger object
        const data = {
          opts  : { type : updateType, name : modelName, when : type === 'pre' ? 'before' : 'after' },
          value : {
            model,
            sanitised,
          },
          query : query.where({
            'data.when'     : type === 'pre' ? 'before' : 'after',
            'data.event'    : tense[updateType],
            'data.model.id' : model.get('_meta.model'),
          }),
        };

        // hash
        const hash = [
          type,
          modelName,
          updateType,
          model.get('_id'),
        ].join('.');

        // run trigger
        run(data, hash);
      });
    };

    // add hooks
    this.eden.pre('*.update', execute);
    this.eden.pre('*.create', execute);
    this.eden.post('*.update', execute);
    this.eden.post('*.create', execute);
  }
}