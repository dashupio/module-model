// require first
const { Module } = require('@dashup/module');

// import base
const ModelPage = require('./pages/model');

// import fields
const ModelField = require('./fields/model');

// import actions
const ModelAction = require('./actions/model');

// import triggers
const ModelTrigger = require('./triggers/model');

/**
 * export module
 */
class ModelModule extends Module {

  /**
   * construct discord module
   */
  constructor() {
    // run super
    super();
  }
  
  /**
   * Register all page interfaces here
   * 
   * ```
   * // register connect class
   * register(Page);
   * ```
   * 
   * Class `Page` should extend `require('@dashup/module').Page`
   * 
   * @param {Function} register 
   */
  pages(register) {
    // register sms action
    register(ModelPage);
  }
  
  /**
   * Register all field interfaces here
   * 
   * ```
   * // register connect class
   * register(Field);
   * ```
   * 
   * Class `Field` should extend `require('@dashup/module').Field`
   * 
   * @param {Function} register 
   */
  fields(register) {
    // register sms action
    register(ModelField);
  }
  
  /**
   * Register all action interfaces here
   * 
   * ```
   * // register connect class
   * register(Action);
   * ```
   * 
   * Class `Action` should extend `require('@dashup/module').Action`
   * 
   * @param {Function} register 
   */
  actions(register) {
    // register sms action
    register(ModelAction);
  }
  
  /**
   * Register all trigger interfaces here
   * 
   * ```
   * // register connect class
   * register(Trigger);
   * ```
   * 
   * Class `Trigger` should extend `require('@dashup/module').Trigger`
   * 
   * @param {Function} register 
   */
  triggers(register) {
    // register sms action
    register(ModelTrigger);
  }
}

// create new
module.exports = new ModelModule();
