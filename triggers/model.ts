// import base
import { Struct, Query } from '@dashup/module';

/**
 * create dashup action
 */
export default class ModelTrigger extends Struct {

  /**
   * construct
   */
  constructor(...args) {
    // return
    super(...args);

    // run listen
    this.modelEvent = this.modelEvent.bind(this);
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
      config : 'trigger/model',
    };
  }

  /**
   * returns object of views
   */
  get events() {
    // return object of views
    return {
      'model.change' : (...args) => this.modelEvent('updated', ...args),
      'model.remove' : (...args) => this.modelEvent('removed', ...args),
      'model.create' : (...args) => this.modelEvent('created', ...args),
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
   * model change
   *
   * @param type 
   * @param id 
   */
  async modelEvent(type, opts, data) {
    // query pages where
    const pages = await new Query(opts, 'page').where({
      type                 : 'flow',
      'data.trigger.type'  : 'model',
      'data.trigger.model' : data._meta.model,
    }).find();

    // check page
    if (!pages) return;

    // trigger
    pages.forEach((page) => {
      // check type
      const events = page.get('data.trigger.event') || [];

      // check when
      if (!events.includes(type)) return;

      // emit new message
      this.dashup.connection.action({
        ...opts,

        page   : page.get('_id'),
        type   : 'page',
        struct : 'flow',
      }, 'trigger', {
        type  : 'model',
        event : type,
        model : data,
      });
    });
  }
}