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
   * registers dashup structs
   *
   * @param {*} register 
   */
  register(fn) {
    // register pages
    fn('page', ModelPage);

    // register pages
    fn('field', ModelField);

    // register actions
    fn('action', ModelAction);

    // register triggers
    fn('trigger', ModelTrigger);
  }
}

// create new
module.exports = new ModelModule();
