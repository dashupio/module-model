// require first
const { Module } = require('@dashup/module');

// import base
const ModelPage = require('./pages/model');

// import fields
const ModelField = require('./fields/model');

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
    register(ModelField);
  }
}

// create new
module.exports = new ModelModule();
