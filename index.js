// require first
const { Module } = require('@dashup/module');

// import base
const FlowPage = require('./pages/flow');

// import base
const HookAction   = require('./actions/hook');
const EventAction  = require('./actions/event');
const FilterAction = require('./actions/filter');

/**
 * export module
 */
class FlowModule extends Module {

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
    register(FlowPage);
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
    register(HookAction);
    register(EventAction);
    register(FilterAction);
  }
}

// create new
module.exports = new FlowModule();
