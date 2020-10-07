
// import field interface
import { Struct, Query } from '@dashup/module';

/**
 * build address helper
 */
export default class ModelField extends Struct {

  /**
   * construct model field
   *
   * @param args 
   */
  constructor(...args) {
    // run super
    super(...args);

    // save
    this.submit   = this.submit.bind(this);
    this.sanitise = this.sanitise.bind(this);
  }

  /**
   * returns object of views
   */
  get views() {
    // return object of views
    return {
      view     : 'field/model/view',
      input    : 'field/model/input',
      config   : 'field/model/config',
      display  : 'field/model/display',
      validate : 'field/model/validate',
    };
  }
  /**
   * returns object of views
   */
  get actions() {
    // return object of views
    return {
      submit   : this.submit,
      sanitise : this.sanitise,
    };
  }

  /**
   * returns field type
   */
  get type() {
    // return field type label
    return 'model';
  }

  /**
   * returns field type
   */
  get data() {
    // return field type label
    return {
      tabs : ['Field', 'Display', 'Validate'],
    };
  }

  /**
   * returns field type
   */
  get title() {
    // return field type label
    return 'Model';
  }

  /**
   * returns category list to show field in
   */
  get categories() {
    // return array of categories
    return ['frontend'];
  }

  /**
   * returns category list to show field in
   */
  get description() {
    // return description string
    return 'Model Field';
  }

  /**
   * submit field value
   *
   * @param {*} param0 
   * @param {*} field 
   * @param {*} value 
   */
  async submit({ req, old }, field, value) {
    // check value
    if (!value) value = [];
    if (!Array.isArray(value)) value = [value];

    // return value map
    return {
      value : await Promise.all(value.filter(val => val).map(async (val, i) => {
        // run try catch
        try {
          // check mod
          return val._id || val.id || val;
        } catch (e) {
          // return old
          return old[i];
        }
      })),
    };
  }

  /**
   * returns sanitised result of field submission
   *
   * @param {*} param0 
   * @param {*} field 
   * @param {*} value 
   */
  async sanitise(opts, field, value) {
    // check noChild
    if (opts.noChild) return value;

    // get value
    if (!value) value = [];
    if (!Array.isArray(value)) value = [value];

    // query model
    const values = await new Query({
      ...opts,

      form : (field.form || {}).id || field.form,
      page : (field.model || {}).id || field.model,
    }, this.dashup, 'model').findByIds(value.map((v) => v.id || v));

    // map values
    return {
      sanitised : values.map((val) => val && val.get()).filter((v) => v)
    };
  }
}